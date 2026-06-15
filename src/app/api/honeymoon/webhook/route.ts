import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

// Stripe needs the raw, unparsed body to verify the signature.
export const dynamic = "force-dynamic";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// Stripe calls this URL after a payment. It is the ONLY place that records a
// contribution — we never trust the browser's "thank you" redirect, because a
// guest could close the tab before it loads. Stripe retries until we 200.
export async function POST(request: NextRequest) {
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    // Not wired up yet (preview mode). Acknowledge so nothing errors.
    return NextResponse.json({ received: true, notConfigured: true });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const signature = request.headers.get("stripe-signature") ?? "";
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook signature failed:", err);
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const experienceId = session.metadata?.experience_id;
    const amountCents = session.amount_total ?? 0;

    if (experienceId && amountCents > 0 && supabase) {
      // onConflict on the session id makes retries idempotent — a webhook Stripe
      // re-sends won't double-count the same payment.
      const { error } = await supabase
        .from("honeymoon_contributions")
        .upsert(
          {
            experience_id: experienceId,
            amount_cents: amountCents,
            contributor_name: session.customer_details?.name ?? null,
            contributor_email: session.customer_details?.email ?? null,
            stripe_session_id: session.id,
          },
          { onConflict: "stripe_session_id" }
        );

      if (error) {
        console.error("Failed to record contribution:", error);
        // 500 tells Stripe to retry later rather than dropping the gift.
        return NextResponse.json({ error: "DB write failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}

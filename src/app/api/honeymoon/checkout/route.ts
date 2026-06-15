import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getExperience } from "@/lib/honeymoon";

// Never cache — each call mints a one-time Stripe session.
export const dynamic = "force-dynamic";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";

// $5 minimum keeps fees sane; $10k ceiling is a sanity guard, not a real limit.
const MIN_CENTS = 500;
const MAX_CENTS = 1_000_000;

interface CheckoutBody {
  experienceId?: string;
  amountCents?: number;
}

export async function POST(request: NextRequest) {
  // Preview mode: Stripe not connected yet. The page shows a gentle notice so
  // you can still click through the flow while editing copy.
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json({ notConfigured: true }, { status: 200 });
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const experience = body.experienceId ? getExperience(body.experienceId) : undefined;
  if (!experience) {
    return NextResponse.json({ error: "Unknown experience." }, { status: 400 });
  }

  const amountCents = Math.round(Number(body.amountCents));
  if (!Number.isFinite(amountCents) || amountCents < MIN_CENTS || amountCents > MAX_CENTS) {
    return NextResponse.json(
      { error: "Please choose an amount of at least $5." },
      { status: 400 }
    );
  }

  const origin =
    request.headers.get("origin") ?? new URL(request.url).origin;

  const stripe = new Stripe(STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      billing_address_collection: "auto",
      // The webhook reads these back to record the contribution against the bar.
      metadata: {
        experience_id: experience.id,
        experience_title: experience.title,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: experience.title,
              description: experience.blurb,
            },
          },
        },
      ],
      success_url: `${origin}/registry/honeymoon/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/registry/honeymoon`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}

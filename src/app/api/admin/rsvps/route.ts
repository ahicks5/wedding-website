import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DEMO_GUESTS, DEMO_PARTIES } from "@/lib/demo-data";

// TEMPORARY: admin password gate disabled at the owner's request — anyone who
// reaches this route gets the data. To restore protection, set
// ADMIN_AUTH_DISABLED = false and set a known-good ADMIN_PASSWORD env var.
const ADMIN_AUTH_DISABLED = true;
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD ?? "wedding2026").trim();

export async function GET(request: NextRequest) {
  const password = request.headers.get("x-admin-password")?.trim();

  if (!ADMIN_AUTH_DISABLED && password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (supabase) {
    const [guestsRes, partiesRes] = await Promise.all([
      supabase.from("guests").select("*").order("last_name"),
      supabase.from("parties").select("*").order("party_name"),
    ]);

    if (guestsRes.error || partiesRes.error) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      guests: guestsRes.data,
      parties: partiesRes.data,
    });
  }

  // Demo mode
  return NextResponse.json({
    guests: DEMO_GUESTS,
    parties: DEMO_PARTIES,
    demo: true,
  });
}

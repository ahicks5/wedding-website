import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DEMO_GUESTS, DEMO_PARTIES } from "@/lib/demo-data";

// Simple password check via header. Trim to tolerate a stray space/newline
// accidentally included in the ADMIN_PASSWORD env var (a common Vercel paste
// mistake) or in the submitted value.
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD ?? "wedding2026").trim();

export async function GET(request: NextRequest) {
  const password = request.headers.get("x-admin-password")?.trim();

  if (password !== ADMIN_PASSWORD) {
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

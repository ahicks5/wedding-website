import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DEMO_GUESTS, DEMO_PARTIES } from "@/lib/demo-data";

// Admin password is HARDCODED here on purpose. The ADMIN_PASSWORD env var is
// intentionally ignored so a mistyped / stray-whitespace Vercel value can no
// longer break login. (Note: this value is visible in the source code.)
const ADMIN_PASSWORD = "dumptruck";

export async function GET(request: NextRequest) {
  const password = request.headers.get("x-admin-password")?.trim();

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (supabase) {
    try {
      const [guestsRes, partiesRes] = await Promise.all([
        supabase.from("guests").select("*").order("last_name"),
        supabase.from("parties").select("*").order("party_name"),
      ]);

      if (guestsRes.error || partiesRes.error) {
        // TEMP: surface the real Supabase error so we can diagnose the 500.
        return NextResponse.json(
          {
            error: "Failed to fetch data",
            detail:
              guestsRes.error?.message ??
              partiesRes.error?.message ??
              "unknown",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        guests: guestsRes.data,
        parties: partiesRes.data,
      });
    } catch (e) {
      // TEMP: surface unexpected exceptions too.
      return NextResponse.json(
        { error: "Exception", detail: e instanceof Error ? e.message : String(e) },
        { status: 500 }
      );
    }
  }

  // Demo mode
  return NextResponse.json({
    guests: DEMO_GUESTS,
    parties: DEMO_PARTIES,
    demo: true,
  });
}

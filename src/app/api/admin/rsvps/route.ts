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
        // DB reachable but the query failed (e.g. tables not created yet).
        // Don't block login — return empty data plus a flag the UI can show.
        return NextResponse.json({
          guests: [],
          parties: [],
          dbError: true,
          detail:
            guestsRes.error?.message ??
            partiesRes.error?.message ??
            "unknown",
        });
      }

      return NextResponse.json({
        guests: guestsRes.data,
        parties: partiesRes.data,
      });
    } catch (e) {
      // Couldn't reach Supabase at all (bad URL/key, project paused, etc.).
      // Still let the admin in so the checklist and the rest of the dashboard
      // work — the RSVP list will just be empty until the DB is connected.
      return NextResponse.json({
        guests: [],
        parties: [],
        dbError: true,
        detail: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // Demo mode
  return NextResponse.json({
    guests: DEMO_GUESTS,
    parties: DEMO_PARTIES,
    demo: true,
  });
}

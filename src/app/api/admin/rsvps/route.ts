import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DEMO_HOUSEHOLDS, DEMO_GUESTS, DEMO_RSVPS } from "@/lib/demo-data";

// Always run fresh — the admin dashboard must reflect live RSVP data.
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
      const [householdsRes, guestsRes, rsvpsRes] = await Promise.all([
        supabase.from("households").select("*").order("search_name"),
        supabase.from("guests").select("*").eq("removed", false).order("guest_id"),
        supabase.from("rsvps").select("*"),
      ]);

      if (householdsRes.error || guestsRes.error || rsvpsRes.error) {
        // DB reachable but a query failed (e.g. tables not created yet).
        // Don't block login — return empty data plus a flag the UI can show.
        return NextResponse.json({
          households: [],
          guests: [],
          rsvps: [],
          dbError: true,
          detail:
            householdsRes.error?.message ??
            guestsRes.error?.message ??
            rsvpsRes.error?.message ??
            "unknown",
        });
      }

      return NextResponse.json({
        households: householdsRes.data,
        guests: guestsRes.data,
        rsvps: rsvpsRes.data,
      });
    } catch (e) {
      // Couldn't reach Supabase at all (bad URL/key, project paused, etc.).
      // Still let the admin in so the checklist and the rest of the dashboard
      // work — the RSVP list will just be empty until the DB is connected.
      return NextResponse.json({
        households: [],
        guests: [],
        rsvps: [],
        dbError: true,
        detail: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // Demo mode
  return NextResponse.json({
    households: DEMO_HOUSEHOLDS,
    guests: DEMO_GUESTS,
    rsvps: DEMO_RSVPS,
    demo: true,
  });
}

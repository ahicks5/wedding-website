import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DEMO_GUESTS } from "@/lib/demo-data";

// Guests can search by ANY named guest (not just the primary contact). Each
// match resolves to that person's household, which the next step loads in full.
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  // Sanitize before it reaches a filter: strip SQL LIKE wildcards (% _) and
  // PostgREST filter metacharacters ( , ( ) * \ ), keeping letters (incl.
  // accents), digits, spaces, hyphens and apostrophes. This also makes the
  // string safe to interpolate into the .or() filter below.
  const query = raw.replace(/[%_,()*\\]/g, "").toLowerCase();

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  if (supabase) {
    const { data, error } = await supabase
      .from("guests")
      .select("guest_id, display_name, household_id")
      .eq("removed", false)
      .neq("name_status", "PLACEHOLDER_UNKNOWN") // unnamed plus-one seats aren't searchable
      .or(
        `display_name.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`
      )
      .order("display_name")
      .limit(12);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data ?? []);
  }

  // Demo mode
  const results = DEMO_GUESTS.filter(
    (g) =>
      !g.removed &&
      g.name_status !== "PLACEHOLDER_UNKNOWN" &&
      `${g.first_name ?? ""} ${g.last_name ?? ""} ${g.display_name}`
        .toLowerCase()
        .includes(query)
  )
    .slice(0, 12)
    .map((g) => ({
      guest_id: g.guest_id,
      display_name: g.display_name,
      household_id: g.household_id,
    }));

  return NextResponse.json(results);
}

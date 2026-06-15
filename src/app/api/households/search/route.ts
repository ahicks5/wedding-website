import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DEMO_HOUSEHOLDS } from "@/lib/demo-data";

// Guests search for their household by the single searchable name (the primary
// contact's full name). Returns lightweight {household_id, search_name} matches.
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  // Sanitize before it ever reaches a filter: strip SQL LIKE wildcards (% _)
  // and PostgREST filter metacharacters ( , ( ) * \ ), while keeping letters
  // (including accented names), digits, spaces, hyphens and apostrophes.
  const query = raw.replace(/[%_,()*\\]/g, "").toLowerCase();

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  if (supabase) {
    const { data, error } = await supabase
      .from("households")
      .select("household_id, search_name")
      .ilike("search_name", `%${query}%`)
      .order("search_name")
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  }

  // Demo mode
  const results = DEMO_HOUSEHOLDS.filter((h) =>
    h.search_name.toLowerCase().includes(query)
  )
    .slice(0, 10)
    .map((h) => ({ household_id: h.household_id, search_name: h.search_name }));

  return NextResponse.json(results);
}

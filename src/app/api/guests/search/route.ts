import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DEMO_GUESTS } from "@/lib/demo-data";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim().toLowerCase();

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  // Use Supabase if configured, otherwise use demo data
  if (supabase) {
    const { data, error } = await supabase
      .from("guests")
      .select("id, first_name, last_name, party_id")
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  }

  // Demo mode
  const results = DEMO_GUESTS.filter(
    (g) =>
      g.first_name.toLowerCase().includes(query) ||
      g.last_name.toLowerCase().includes(query) ||
      `${g.first_name} ${g.last_name}`.toLowerCase().includes(query)
  ).map((g) => ({
    id: g.id,
    first_name: g.first_name,
    last_name: g.last_name,
    party_id: g.party_id,
  }));

  return NextResponse.json(results);
}

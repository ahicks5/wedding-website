import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DEMO_GUESTS, DEMO_PARTIES } from "@/lib/demo-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: { partyId: string } }
) {
  const { partyId } = params;

  if (supabase) {
    const [partyRes, guestsRes] = await Promise.all([
      supabase.from("parties").select("*").eq("id", partyId).single(),
      supabase.from("guests").select("*").eq("party_id", partyId),
    ]);

    if (partyRes.error || guestsRes.error) {
      return NextResponse.json(
        { error: "Party not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      party: partyRes.data,
      guests: guestsRes.data,
    });
  }

  // Demo mode
  const party = DEMO_PARTIES.find((p) => p.id === partyId);
  const guests = DEMO_GUESTS.filter((g) => g.party_id === partyId);

  if (!party) {
    return NextResponse.json({ error: "Party not found" }, { status: 404 });
  }

  return NextResponse.json({ party, guests });
}

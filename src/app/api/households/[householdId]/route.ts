import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DEMO_HOUSEHOLDS, DEMO_GUESTS, DEMO_RSVPS } from "@/lib/demo-data";

// Returns a household, its non-removed guests, and any existing RSVP responses
// (so a guest can review/edit a response they already submitted).
export async function GET(
  _request: NextRequest,
  { params }: { params: { householdId: string } }
) {
  const householdId = Number(params.householdId);
  if (!Number.isInteger(householdId)) {
    return NextResponse.json({ error: "Invalid household" }, { status: 400 });
  }

  if (supabase) {
    const [householdRes, guestsRes] = await Promise.all([
      supabase.from("households").select("*").eq("household_id", householdId).single(),
      supabase
        .from("guests")
        .select("*")
        .eq("household_id", householdId)
        .eq("removed", false)
        .order("is_primary_contact", { ascending: false })
        .order("guest_id"),
    ]);

    if (householdRes.error || guestsRes.error) {
      return NextResponse.json({ error: "Household not found" }, { status: 404 });
    }

    const guestIds = guestsRes.data.map((g) => g.guest_id);
    const rsvpsRes = guestIds.length
      ? await supabase.from("rsvps").select("*").in("guest_id", guestIds)
      : { data: [], error: null };

    if (rsvpsRes.error) {
      return NextResponse.json({ error: "Could not load responses" }, { status: 500 });
    }

    return NextResponse.json({
      household: householdRes.data,
      guests: guestsRes.data,
      rsvps: rsvpsRes.data,
    });
  }

  // Demo mode
  const household = DEMO_HOUSEHOLDS.find((h) => h.household_id === householdId);
  if (!household) {
    return NextResponse.json({ error: "Household not found" }, { status: 404 });
  }
  const guests = DEMO_GUESTS.filter(
    (g) => g.household_id === householdId && !g.removed
  );
  const guestIds = new Set(guests.map((g) => g.guest_id));
  const rsvps = DEMO_RSVPS.filter((r) => guestIds.has(r.guest_id));

  return NextResponse.json({ household, guests, rsvps });
}

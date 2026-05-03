import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { RsvpStatus } from "@/lib/database.types";

interface GuestRsvp {
  id: string;
  rsvp_status: RsvpStatus;
  meal_choice: string | null;
  dietary_restrictions: string | null;
  notes: string | null;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { guests } = body as { guests: GuestRsvp[] };

  if (!guests || !Array.isArray(guests) || guests.length === 0) {
    return NextResponse.json(
      { error: "No guest data provided" },
      { status: 400 }
    );
  }

  if (supabase) {
    const db = supabase;
    const now = new Date().toISOString();

    // Update each guest in parallel
    const updates = guests.map((guest) =>
      db
        .from("guests")
        .update({
          rsvp_status: guest.rsvp_status,
          meal_choice: guest.meal_choice,
          dietary_restrictions: guest.dietary_restrictions,
          notes: guest.notes,
          responded_at: now,
        })
        .eq("id", guest.id)
    );

    const results = await Promise.all(updates);
    const errors = results.filter((r) => r.error);

    if (errors.length > 0) {
      return NextResponse.json(
        { error: "Failed to save some RSVPs" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  }

  // Demo mode — just acknowledge
  console.log("Demo RSVP submission:", guests);
  return NextResponse.json({ success: true, demo: true });
}

// ============================================
// Demo data for development without Supabase
// ============================================
// Exercises every RSVP path: a placeholder plus-one seat, rehearsal-dinner
// invitees, an infant (skips meals) and a child (kids' menu), and a household
// with an already-submitted response (to test editing an existing RSVP).

import type { Household, Guest, Rsvp } from "./database.types";

export const DEMO_HOUSEHOLDS: Household[] = [
  {
    household_id: 1,
    search_name: "Rick Hicks",
    address_line1: "123 Main St",
    address_line2: null,
    city: "Prairie Village",
    state: "KS",
    zip: "66208",
    created_at: "2026-01-15T00:00:00Z",
  },
  {
    household_id: 2,
    search_name: "Matthew Hicks",
    address_line1: "456 Oak Ave",
    address_line2: "Apt 2",
    city: "Omaha",
    state: "NE",
    zip: "68107",
    created_at: "2026-01-15T00:00:00Z",
  },
  {
    household_id: 3,
    search_name: "John Sager",
    address_line1: "789 Elm Blvd",
    address_line2: null,
    city: "Austin",
    state: "TX",
    zip: "78705",
    created_at: "2026-01-15T00:00:00Z",
  },
];

function guest(g: Partial<Guest> & Pick<Guest, "guest_id" | "household_id" | "display_name">): Guest {
  return {
    first_name: null,
    last_name: null,
    name_status: "confirmed",
    is_primary_contact: false,
    relationship_to_couple: null,
    side: null,
    invite_group: null,
    guest_type: "adult",
    tier: null,
    plus_one_allowed: null,
    invited_rehearsal_dinner: false,
    needs_review: false,
    review_reason: null,
    removed: false,
    created_at: "2026-01-15T00:00:00Z",
    updated_at: "2026-01-15T00:00:00Z",
    ...g,
  };
}

export const DEMO_GUESTS: Guest[] = [
  // Household 1 — both rehearsal-invited, already responded.
  guest({ guest_id: "G001", household_id: 1, display_name: "Rick Hicks", first_name: "Rick", last_name: "Hicks", is_primary_contact: true, side: "Hicks", invited_rehearsal_dinner: true }),
  guest({ guest_id: "G002", household_id: 1, display_name: "Vicki Hicks", first_name: "Vicki", last_name: "Hicks", side: "Hicks", invited_rehearsal_dinner: true }),

  // Household 2 — Matthew + an unnamed plus-one seat, both rehearsal-invited.
  guest({ guest_id: "G003", household_id: 2, display_name: "Matthew Hicks", first_name: "Matthew", last_name: "Hicks", is_primary_contact: true, side: "Hicks", plus_one_allowed: "Y", invited_rehearsal_dinner: true }),
  guest({ guest_id: "G004", household_id: 2, display_name: "Guest of Matthew Hicks", name_status: "PLACEHOLDER_UNKNOWN", side: "Hicks", invited_rehearsal_dinner: true }),

  // Household 3 — family with a child (kids' menu) and an infant (skips meals).
  guest({ guest_id: "G005", household_id: 3, display_name: "John Sager", first_name: "John", last_name: "Sager", is_primary_contact: true, side: "Sager" }),
  guest({ guest_id: "G006", household_id: 3, display_name: "Jane Sager", first_name: "Jane", last_name: "Sager", side: "Sager" }),
  guest({ guest_id: "G007", household_id: 3, display_name: "Lucy Sager", first_name: "Lucy", last_name: "Sager", side: "Sager", guest_type: "child" }),
  guest({ guest_id: "G008", household_id: 3, display_name: "Baby Sager", first_name: "Baby", last_name: "Sager", side: "Sager", guest_type: "infant" }),
];

// Household 1 has already submitted — used to test editing an existing response.
export const DEMO_RSVPS: Rsvp[] = [
  {
    guest_id: "G001",
    attending_wedding: true,
    attending_rehearsal: true,
    meal_preference: "Beef",
    dietary_notes: null,
    rsvp_email: "rick@example.com",
    rsvp_phone: "555-0100",
    notes: "Can't wait to celebrate!",
    plus_one_name: null,
    plus_one_type: null,
    submitted_at: "2026-05-01T00:00:00Z",
    updated_at: "2026-05-01T00:00:00Z",
  },
  {
    guest_id: "G002",
    attending_wedding: true,
    attending_rehearsal: false,
    meal_preference: "Chicken",
    dietary_notes: "Gluten-free",
    rsvp_email: null,
    rsvp_phone: null,
    notes: null,
    plus_one_name: null,
    plus_one_type: null,
    submitted_at: "2026-05-01T00:00:00Z",
    updated_at: "2026-05-01T00:00:00Z",
  },
];

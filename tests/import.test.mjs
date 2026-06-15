// ============================================
// Importer core tests  —  run with: npm test  (node --test)
// ============================================
// These prove the re-sync guarantee at the logic level, no database needed:
// imported records carry only imported columns, missing guests are soft-removed
// (not deleted), and ids are assigned/validated correctly.
// ============================================

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  nextGuestId,
  formatGuestId,
  parseGuests,
  computeSoftDeletes,
  GUEST_IMPORT_COLUMNS,
} from "../scripts/lib/import-core.mjs";

// A tiny helper to build a spreadsheet-style row object with sane defaults.
function row(overrides = {}) {
  return {
    household_id: "1",
    household_search_name: "Rick Hicks",
    is_primary_contact: "",
    guest_id: "",
    first_name: "",
    last_name: "",
    display_name: "Someone",
    name_status: "confirmed",
    relationship_to_couple: "friend",
    side: "Hicks",
    invite_group: "",
    guest_type: "adult",
    tier: "",
    plus_one_allowed: "",
    invited_rehearsal_dinner: "",
    rsvp_email: "",
    rsvp_phone: "",
    meal_preference: "",
    address_line1: "1 Main St",
    address_line2: "",
    city: "Austin",
    state: "TX",
    zip: "78701",
    needs_review: "",
    review_reason: "",
    ...overrides,
  };
}

test("formatGuestId / nextGuestId", () => {
  assert.equal(formatGuestId(1), "G001");
  assert.equal(formatGuestId(179), "G179");
  assert.equal(nextGuestId(["G001", "G005", "G003"]), "G006");
  assert.equal(nextGuestId([]), "G001");
  assert.equal(nextGuestId(["", null, "G010"]), "G011");
});

test("parseGuests maps rows and builds households", () => {
  const rows = [
    row({ guest_id: "G001", is_primary_contact: "Y", display_name: "Rick Hicks" }),
    row({ guest_id: "G002", display_name: "Vicki Hicks" }),
  ];
  const { households, guests } = parseGuests(rows);
  assert.equal(guests.length, 2);
  assert.equal(households.length, 1);
  assert.equal(households[0].household_id, 1);
  assert.equal(households[0].search_name, "Rick Hicks");
  assert.equal(guests[0].is_primary_contact, true);
  assert.equal(guests[1].is_primary_contact, false);
  assert.equal(guests[0].invited_rehearsal_dinner, false);
});

test("parseGuests assigns ids to blank guest_id rows and reports them", () => {
  const rows = [
    row({ guest_id: "G001", is_primary_contact: "Y" }),
    row({ guest_id: "", display_name: "Unnamed Plus One", name_status: "PLACEHOLDER_UNKNOWN" }),
  ];
  const { guests, idAssignments, placeholders } = parseGuests(rows, ["G001", "G002"]);
  // G001/G002 are reserved (sheet + DB), so the blank becomes G003.
  assert.equal(guests[1].guest_id, "G003");
  assert.equal(idAssignments.length, 1);
  assert.equal(idAssignments[0].assigned, "G003");
  assert.equal(placeholders, 1);
});

test("guest upsert payload contains ONLY imported columns (never rsvps fields)", () => {
  const { guests } = parseGuests([row({ guest_id: "G001", is_primary_contact: "Y" })]);
  const keys = Object.keys(guests[0]);
  // Every key must be a declared import column...
  for (const k of keys) {
    assert.ok(GUEST_IMPORT_COLUMNS.includes(k), `unexpected guest column: ${k}`);
  }
  // ...and no response columns may ever appear.
  for (const forbidden of [
    "attending_wedding",
    "attending_rehearsal",
    "meal_preference",
    "dietary_notes",
    "rsvp_email",
    "rsvp_phone",
    "plus_one_name",
  ]) {
    assert.ok(!keys.includes(forbidden), `rsvps column leaked into guests: ${forbidden}`);
  }
});

test("computeSoftDeletes finds ids in DB but absent from the file", () => {
  const dbIds = ["G001", "G002", "G003"];
  const fileIds = ["G001", "G003", "G004"];
  // G002 dropped from the sheet -> soft-remove. G004 is new -> not a delete.
  assert.deepEqual(computeSoftDeletes(dbIds, fileIds), ["G002"]);
  assert.deepEqual(computeSoftDeletes(["G001"], ["G001"]), []);
});

test("validations warn (never throw) for the known data problems", () => {
  const rows = [
    // household 1: two primaries
    row({ guest_id: "G001", household_id: "1", is_primary_contact: "Y" }),
    row({ guest_id: "G002", household_id: "1", is_primary_contact: "Y" }),
    // household 2: no primary, blank side on a confirmed guest, bad zip
    row({ guest_id: "G003", household_id: "2", is_primary_contact: "", side: "", zip: "6160" }),
  ];
  const { warnings } = parseGuests(rows);
  const joined = warnings.join("\n");
  assert.match(joined, /Household 1: 2 primary contacts/);
  assert.match(joined, /Household 2: no primary contact/);
  assert.match(joined, /blank side/);
  assert.match(joined, /malformed zip/);
});

test("placeholder guest with blank side does NOT warn (it's an unnamed plus-one)", () => {
  const rows = [
    row({ guest_id: "G001", is_primary_contact: "Y" }),
    row({ guest_id: "G002", name_status: "PLACEHOLDER_UNKNOWN", side: "", display_name: "" }),
  ];
  const { warnings } = parseGuests(rows);
  assert.ok(!warnings.some((w) => /blank side/.test(w)), "placeholder should not warn on side");
});

test("re-sync preserves responses: re-parsing an edited sheet never deletes", () => {
  // First import.
  const v1 = parseGuests([
    row({ guest_id: "G001", is_primary_contact: "Y", display_name: "Rick Hicks" }),
    row({ guest_id: "G002", display_name: "Vicki Hicks" }),
  ]);
  const dbIds = v1.guests.map((g) => g.guest_id);

  // Edited sheet: rename G002, add G003, drop nobody.
  const v2 = parseGuests(
    [
      row({ guest_id: "G001", is_primary_contact: "Y", display_name: "Rick Hicks" }),
      row({ guest_id: "G002", display_name: "Victoria Hicks" }), // renamed
      row({ guest_id: "G003", display_name: "New Guest" }), // added
    ],
    dbIds
  );

  // The existing guest is updated in place (same id) and never removed.
  assert.equal(v2.guests.find((g) => g.guest_id === "G002").display_name, "Victoria Hicks");
  assert.deepEqual(
    computeSoftDeletes(dbIds, v2.guests.map((g) => g.guest_id)),
    [],
    "no one should be soft-removed when nobody left the sheet"
  );
  // And the upsert still never touches response columns (re-asserted for v2).
  for (const g of v2.guests) {
    for (const k of Object.keys(g)) {
      assert.ok(GUEST_IMPORT_COLUMNS.includes(k));
    }
  }
});

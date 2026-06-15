// ============================================
// Importer core — pure, testable, no network
// ============================================
// All the logic that turns spreadsheet rows into database-ready records lives
// here as pure functions so it can be unit-tested with `node --test` without a
// Supabase connection. scripts/import-guests.mjs wires these to the database.
//
// The contract this module enforces:
//   * guest_id (G###) is the immutable key. Blanks get the next free id.
//   * The guest upsert payload contains ONLY imported columns — never any
//     rsvps fields — so re-importing can never clobber a submitted response.
// ============================================

const yes = (v) => String(v ?? "").trim().toUpperCase() === "Y";
const str = (v) => {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
};

// Columns the importer writes to the guests table. Kept as an explicit list so
// a test can assert no rsvps columns ever leak into the upsert payload.
export const GUEST_IMPORT_COLUMNS = [
  "guest_id",
  "household_id",
  "first_name",
  "last_name",
  "display_name",
  "name_status",
  "is_primary_contact",
  "relationship_to_couple",
  "side",
  "invite_group",
  "guest_type",
  "tier",
  "plus_one_allowed",
  "invited_rehearsal_dinner",
  "needs_review",
  "review_reason",
  "removed",
];

// Format an integer as a G### id (3-digit zero-padded, wider if it overflows).
export function formatGuestId(n) {
  return "G" + String(n).padStart(3, "0");
}

// Parse the numeric part of a G### id; returns 0 for anything unparseable.
function guestIdNum(id) {
  const m = /^G(\d+)$/.exec(String(id ?? "").trim());
  return m ? Number(m[1]) : 0;
}

// Given a set/array of existing ids, return the next free G### id.
export function nextGuestId(existingIds) {
  let max = 0;
  for (const id of existingIds) max = Math.max(max, guestIdNum(id));
  return formatGuestId(max + 1);
}

// Turn spreadsheet row objects (keyed by header) into database records.
//
//   rows           — array of objects from readRowObjects()
//   reservedDbIds  — guest_ids already in the DB (so newly-assigned ids don't
//                    collide with ones the sheet doesn't yet know about)
//
// Returns { households, guests, idAssignments, placeholders, warnings }.
export function parseGuests(rows, reservedDbIds = []) {
  const warnings = [];
  const idAssignments = [];

  // Pool of ids already taken (sheet + DB), grown as we assign new ones.
  const used = new Set();
  for (const id of reservedDbIds) if (id) used.add(String(id).trim());
  for (const r of rows) if (str(r.guest_id)) used.add(str(r.guest_id));

  const guests = [];
  const householdRows = new Map(); // household_id -> { primary rows seen }
  const primaryCount = new Map();

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const rowNum = i + 2; // 1-based + header row, for human-readable warnings

    // Assign a guest_id if the sheet left it blank.
    let guestId = str(r.guest_id);
    if (!guestId) {
      let n = 1;
      while (used.has(formatGuestId(n))) n++;
      guestId = formatGuestId(n);
      used.add(guestId);
      idAssignments.push({
        row: rowNum,
        display_name: str(r.display_name) ?? "(unnamed)",
        assigned: guestId,
      });
    }

    const householdId = Number(str(r.household_id));
    if (!Number.isInteger(householdId)) {
      warnings.push(`Row ${rowNum} (${guestId}): missing/invalid household_id`);
    }

    const nameStatus = str(r.name_status) ?? "confirmed";
    const side = str(r.side);
    const isPrimary = yes(r.is_primary_contact);
    const zip = str(r.zip);

    // --- validations (warn, never throw) ---
    if (isPrimary) {
      primaryCount.set(householdId, (primaryCount.get(householdId) ?? 0) + 1);
    }
    if (nameStatus === "confirmed" && !side) {
      warnings.push(
        `Row ${rowNum} (${guestId}, ${str(r.display_name) ?? "?"}): confirmed guest has blank side`
      );
    }
    if (zip && !/^\d{5}(-\d{4})?$/.test(zip)) {
      warnings.push(`Row ${rowNum} (${guestId}): malformed zip "${zip}"`);
    }

    guests.push({
      guest_id: guestId,
      household_id: householdId,
      first_name: str(r.first_name),
      last_name: str(r.last_name),
      display_name: str(r.display_name) ?? guestId,
      name_status: nameStatus,
      is_primary_contact: isPrimary,
      relationship_to_couple: str(r.relationship_to_couple),
      side,
      invite_group: str(r.invite_group),
      guest_type: str(r.guest_type) ?? "adult",
      tier: str(r.tier),
      plus_one_allowed: str(r.plus_one_allowed),
      invited_rehearsal_dinner: yes(r.invited_rehearsal_dinner),
      needs_review: yes(r.needs_review),
      review_reason: str(r.review_reason),
      removed: false,
    });

    // Build the household record from its primary row (fallback: first row seen).
    if (!householdRows.has(householdId) || isPrimary) {
      householdRows.set(householdId, {
        household_id: householdId,
        search_name: str(r.household_search_name) ?? str(r.display_name) ?? `Household ${householdId}`,
        address_line1: str(r.address_line1),
        address_line2: str(r.address_line2),
        city: str(r.city),
        state: str(r.state),
        zip,
      });
    }
  }

  // Per-household primary-contact integrity.
  for (const [hid] of householdRows) {
    const count = primaryCount.get(hid) ?? 0;
    if (count === 0) warnings.push(`Household ${hid}: no primary contact`);
    if (count > 1) warnings.push(`Household ${hid}: ${count} primary contacts (expected 1)`);
  }

  const households = [...householdRows.values()];
  const placeholders = guests.filter((g) => g.name_status === "PLACEHOLDER_UNKNOWN").length;

  return { households, guests, idAssignments, placeholders, warnings };
}

// Which guest_ids are in the DB but absent from the latest file — these get
// soft-removed (removed = true), never hard-deleted, so rsvps rows survive.
export function computeSoftDeletes(dbIds, fileIds) {
  const fileSet = new Set(fileIds.map((id) => String(id).trim()));
  return [...new Set(dbIds.map((id) => String(id).trim()))].filter(
    (id) => id && !fileSet.has(id)
  );
}

// ============================================
// Export the current guest list (households + guests) to a CSV for review.
//
//   node --env-file=.env.local scripts/export-guests.mjs [outfile.csv]
//
// Reads live data from Supabase using the same env vars as the importer
// (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY). Produces one row per
// guest, grouped by household, with addresses repeated per household. Soft-
// removed guests (removed=true) are excluded — this is the live invite list.
//
// The CSV contains guest names/addresses (PII) — it is NOT committed to git.
// ============================================

import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing Supabase env vars. Run with:\n" +
      "  node --env-file=.env.local scripts/export-guests.mjs"
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const outfile = process.argv[2] ?? "guest-list-review.csv";

// CSV field escaping: quote anything risky, double embedded quotes.
function cell(value) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
const yesNo = (b) => (b ? "Yes" : "No");

const COLUMNS = [
  "household_id",
  "household_name",
  "address_line1",
  "address_line2",
  "city",
  "state",
  "zip",
  "guest_id",
  "display_name",
  "first_name",
  "last_name",
  "guest_type",
  "name_status",
  "primary_contact",
  "side",
  "relationship_to_couple",
  "invite_group",
  "plus_one_allowed",
  "invited_rehearsal_dinner",
  "needs_review",
  "review_reason",
];

async function main() {
  const { data: households, error: hErr } = await supabase
    .from("households")
    .select("*");
  if (hErr) throw hErr;

  const { data: guests, error: gErr } = await supabase
    .from("guests")
    .select("*")
    .eq("removed", false);
  if (gErr) throw gErr;

  const byId = new Map(households.map((h) => [h.household_id, h]));

  // Sort: by household, primary contact first, then guest_id.
  guests.sort((a, b) => {
    if (a.household_id !== b.household_id)
      return a.household_id - b.household_id;
    if (a.is_primary_contact !== b.is_primary_contact)
      return a.is_primary_contact ? -1 : 1;
    return String(a.guest_id).localeCompare(String(b.guest_id));
  });

  const rows = [COLUMNS.join(",")];
  for (const g of guests) {
    const h = byId.get(g.household_id) ?? {};
    rows.push(
      [
        g.household_id,
        h.search_name,
        h.address_line1,
        h.address_line2,
        h.city,
        h.state,
        h.zip,
        g.guest_id,
        g.display_name,
        g.first_name,
        g.last_name,
        g.guest_type,
        g.name_status,
        yesNo(g.is_primary_contact),
        g.side,
        g.relationship_to_couple,
        g.invite_group,
        g.plus_one_allowed,
        yesNo(g.invited_rehearsal_dinner),
        yesNo(g.needs_review),
        g.review_reason,
      ]
        .map(cell)
        .join(",")
    );
  }

  // Prepend a BOM so Excel opens UTF-8 names (accents) correctly.
  writeFileSync(outfile, "﻿" + rows.join("\r\n"), "utf8");

  const householdCount = new Set(guests.map((g) => g.household_id)).size;
  console.log(
    `Wrote ${outfile}: ${guests.length} guests across ${householdCount} households.`
  );
}

main().catch((err) => {
  console.error("Export failed:", err.message ?? err);
  process.exit(1);
});

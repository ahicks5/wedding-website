#!/usr/bin/env node
// ============================================
// Guest List Importer  —  idempotent, re-runnable
// ============================================
// Reads the authoritative spreadsheet and syncs the households + guests tables
// in Supabase. Safe to run any number of times: it upserts on the stable
// guest_id, soft-removes guests that disappear from the sheet, and NEVER writes
// the rsvps table — so responses guests have already submitted always survive.
//
// Usage:
//   npm run import-guests                       # default file, live write
//   npm run import-guests -- --dry-run          # show the diff, write nothing
//   npm run import-guests -- path/to/file.xlsx  # explicit file
//
// Env (via Node's --env-file=.env.local, wired in package.json):
//   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// A --dry-run with no DB env still parses the file and prints what it found.
// ============================================

import { createClient } from "@supabase/supabase-js";
import { readRowObjects } from "./lib/read-xlsx.mjs";
import { parseGuests, computeSoftDeletes } from "./lib/import-core.mjs";

const SHEET = "Guests";

function parseArgs(argv) {
  const args = argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const file = args.find((a) => !a.startsWith("--")) ?? "Wedding_Guests_RSVP_Clean.xlsx";
  return { dryRun, file };
}

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function section(title) {
  console.log("\n" + title);
  console.log("-".repeat(title.length));
}

async function main() {
  const { dryRun, file } = parseArgs(process.argv);

  console.log(`Importing "${file}" (sheet: ${SHEET})${dryRun ? "  [DRY RUN]" : ""}`);

  // 1. Read the sheet.
  let rows;
  try {
    ({ rows } = readRowObjects(file, SHEET));
  } catch (err) {
    console.error(`\nCould not read the spreadsheet: ${err.message}`);
    process.exit(1);
  }

  // 2. Connect (optional for dry-run) and learn which guest_ids already exist,
  //    so we can assign new ids safely and count inserts vs updates.
  const supabase = getClient();
  let dbIds = [];
  if (supabase) {
    const { data, error } = await supabase.from("guests").select("guest_id");
    if (error) {
      console.error(`\nCould not read existing guests: ${error.message}`);
      process.exit(1);
    }
    dbIds = data.map((g) => g.guest_id);
  } else if (!dryRun) {
    console.error(
      "\nNo Supabase env found (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)." +
        "\nSet them in .env.local, or pass --dry-run to preview without a database."
    );
    process.exit(1);
  } else {
    console.log("\n(no database connection — dry-run will treat every guest as new)");
  }

  // 3. Parse into database-ready records.
  const { households, guests, idAssignments, placeholders, warnings } = parseGuests(rows, dbIds);
  const fileIds = guests.map((g) => g.guest_id);
  const dbIdSet = new Set(dbIds);
  const inserted = guests.filter((g) => !dbIdSet.has(g.guest_id));
  const updated = guests.filter((g) => dbIdSet.has(g.guest_id));
  const softDeletes = computeSoftDeletes(dbIds, fileIds);

  // 4. Report.
  section("Summary");
  console.log(`  Households:    ${households.length}`);
  console.log(`  Guests parsed: ${guests.length}`);
  console.log(`  Inserted:      ${inserted.length}`);
  console.log(`  Updated:       ${updated.length}`);
  console.log(`  Soft-removed:  ${softDeletes.length}`);
  console.log(`  Placeholders:  ${placeholders} (unnamed plus-one seats)`);

  if (idAssignments.length) {
    section(`Assigned ${idAssignments.length} new guest_id(s) — write these back into the sheet`);
    for (const a of idAssignments) {
      console.log(`  Row ${a.row}: ${a.display_name} -> ${a.assigned}`);
    }
  }

  if (softDeletes.length) {
    section(`Soft-removing ${softDeletes.length} guest(s) absent from the sheet`);
    console.log("  (kept in DB with removed=true so any RSVP is preserved)");
    console.log("  " + softDeletes.join(", "));
  }

  if (warnings.length) {
    section(`Warnings (${warnings.length}) — non-fatal`);
    for (const w of warnings) console.log(`  ! ${w}`);
  }

  if (dryRun) {
    console.log("\nDry run complete. No changes written.");
    return;
  }

  // 5. Write. Upserts are idempotent and keyed on stable ids, so a partial
  //    failure here is fully recovered simply by re-running the import.
  section("Writing to Supabase");

  const { error: hErr } = await supabase
    .from("households")
    .upsert(households, { onConflict: "household_id" });
  if (hErr) throw new Error(`households upsert failed: ${hErr.message}`);
  console.log(`  households: ${households.length} upserted`);

  const stamped = guests.map((g) => ({ ...g, updated_at: new Date().toISOString() }));
  const { error: gErr } = await supabase
    .from("guests")
    .upsert(stamped, { onConflict: "guest_id" });
  if (gErr) throw new Error(`guests upsert failed: ${gErr.message}`);
  console.log(`  guests: ${guests.length} upserted`);

  if (softDeletes.length) {
    const { error: dErr } = await supabase
      .from("guests")
      .update({ removed: true, updated_at: new Date().toISOString() })
      .in("guest_id", softDeletes);
    if (dErr) throw new Error(`soft-delete failed: ${dErr.message}`);
    console.log(`  guests: ${softDeletes.length} soft-removed`);
  }

  const { error: lErr } = await supabase.from("import_log").insert({
    filename: file,
    inserted: inserted.length,
    updated: updated.length,
    soft_removed: softDeletes.length,
    households: households.length,
    placeholders,
    warnings,
    dry_run: false,
  });
  if (lErr) console.warn(`  (could not write import_log: ${lErr.message})`);

  console.log("\nImport complete.");
}

main().catch((err) => {
  console.error("\nImport failed:", err.message);
  process.exit(1);
});

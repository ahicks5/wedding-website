import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// TEMPORARY: admin password gate disabled at the owner's request. To restore
// protection, set ADMIN_AUTH_DISABLED = false (matches src/app/api/admin/rsvps).
const ADMIN_AUTH_DISABLED = true;
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD ?? "wedding2026").trim();

type ItemState = { checked: boolean; notes: string };
type StateMap = Record<string, ItemState>;

function authorized(request: NextRequest): boolean {
  if (ADMIN_AUTH_DISABLED) return true;
  return request.headers.get("x-admin-password")?.trim() === ADMIN_PASSWORD;
}

// GET — return the saved state for every touched checklist item.
// In demo mode (no Supabase) returns an empty map; the client falls back to
// localStorage so the feature still works in local development.
export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ items: {}, demo: true });
  }

  const { data, error } = await supabase.from("checklist_items").select("*");

  if (error) {
    return NextResponse.json(
      { error: "Failed to load checklist" },
      { status: 500 }
    );
  }

  const items: StateMap = {};
  for (const row of data) {
    items[row.item_id] = { checked: row.checked, notes: row.notes ?? "" };
  }

  return NextResponse.json({ items });
}

// POST — upsert the state for a single item.
// Body: { item_id: string, checked: boolean, notes: string }
export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Partial<{ item_id: string; checked: boolean; notes: string }>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { item_id, checked, notes } = body;
  if (typeof item_id !== "string" || typeof checked !== "boolean") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Demo mode: nothing to persist server-side; the client keeps state in
  // localStorage. Report success so the UI behaves identically.
  if (!supabase) {
    return NextResponse.json({ ok: true, demo: true });
  }

  const { error } = await supabase.from("checklist_items").upsert(
    {
      item_id,
      checked,
      notes: notes ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "item_id" }
  );

  if (error) {
    return NextResponse.json(
      { error: "Failed to save checklist item" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

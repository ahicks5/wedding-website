import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Always run fresh — seating edits must reflect immediately.
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Admin password HARDCODED to match the other admin routes (env var ignored).
const ADMIN_PASSWORD = "dumptruck";

function authorized(request: NextRequest): boolean {
  return request.headers.get("x-admin-password")?.trim() === ADMIN_PASSWORD;
}

// GET — return every table and every assignment.
// In demo mode (no Supabase) or on any DB error, returns empty arrays plus
// demo:true so the client persists the whole seating layout in localStorage
// and the feature still works in local development.
export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ tables: [], assignments: [], demo: true });
  }

  try {
    const [tablesRes, assignmentsRes] = await Promise.all([
      supabase.from("seating_tables").select("*").order("sort_order"),
      supabase.from("seating_assignments").select("*"),
    ]);

    if (tablesRes.error || assignmentsRes.error) {
      // Tables not created yet (migration 005 not run) — fall back to demo so
      // the client keeps the layout in localStorage instead of crashing.
      return NextResponse.json({ tables: [], assignments: [], demo: true });
    }

    return NextResponse.json({
      tables: tablesRes.data,
      assignments: assignmentsRes.data,
    });
  } catch {
    return NextResponse.json({ tables: [], assignments: [], demo: true });
  }
}

// POST — a single action-based endpoint keeps all mutations in one place.
// Body: { action, ...payload }
//   upsertTable  { table: { id?, name, pos_x, pos_y, capacity, sort_order } }
//   deleteTable  { id }            (assignments cascade away with the table)
//   assign       { guest_id, table_id, seat_index? }
//   unassign     { guest_id }
type Body =
  | { action: "upsertTable"; table: Record<string, unknown> }
  | { action: "deleteTable"; id: string }
  | { action: "assign"; guest_id: string; table_id: string; seat_index?: number | null }
  | { action: "unassign"; guest_id: string };

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Demo mode: nothing to persist server-side; the client keeps the whole
  // layout in localStorage. Echo success so the UI behaves identically.
  if (!supabase) {
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    switch (body.action) {
      case "upsertTable": {
        const { data, error } = await supabase
          .from("seating_tables")
          .upsert(body.table as never)
          .select()
          .single();
        if (error) return NextResponse.json({ ok: true, demo: true });
        return NextResponse.json({ ok: true, table: data });
      }

      case "deleteTable": {
        const { error } = await supabase
          .from("seating_tables")
          .delete()
          .eq("id", body.id);
        if (error) return NextResponse.json({ ok: true, demo: true });
        return NextResponse.json({ ok: true });
      }

      case "assign": {
        const { error } = await supabase.from("seating_assignments").upsert(
          {
            guest_id: body.guest_id,
            table_id: body.table_id,
            seat_index: body.seat_index ?? null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "guest_id" }
        );
        if (error) return NextResponse.json({ ok: true, demo: true });
        return NextResponse.json({ ok: true });
      }

      case "unassign": {
        const { error } = await supabase
          .from("seating_assignments")
          .delete()
          .eq("guest_id", body.guest_id);
        if (error) return NextResponse.json({ ok: true, demo: true });
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch {
    // Supabase unreachable — report success; the client keeps localStorage.
    return NextResponse.json({ ok: true, demo: true });
  }
}

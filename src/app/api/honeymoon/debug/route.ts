import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// TEMPORARY diagnostic — shows which Supabase project this deployment is
// actually connected to and the raw contribution rows it can see. No PII is
// returned (no names/emails). Delete this route once the totals mismatch is
// resolved.
export const dynamic = "force-dynamic";

export async function GET() {
  // Safe to show: the project host is public (it's the NEXT_PUBLIC_ url).
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "(unset)";
  let projectHost = "(unset)";
  try {
    projectHost = new URL(url).host;
  } catch {
    /* leave as-is */
  }

  if (!supabase) {
    return NextResponse.json(
      { supabaseConfigured: false, projectHost, rows: [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const { data, error } = await supabase
    .from("honeymoon_contributions")
    .select("experience_id, amount_cents, created_at")
    .order("created_at", { ascending: false });

  return NextResponse.json(
    {
      supabaseConfigured: true,
      projectHost,
      rowCount: data?.length ?? 0,
      error: error?.message ?? null,
      rows: data ?? [],
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

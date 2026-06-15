import { supabase } from "@/lib/supabase";
import {
  HONEYMOON_EXPERIENCES,
  DEMO_RAISED_DOLLARS,
} from "@/lib/honeymoon";

// Map of experience_id -> total raised in whole dollars.
export type RaisedTotals = Record<string, number>;

/**
 * Server-only. Returns the amount raised per experience.
 *
 * - No Supabase (local preview): returns the DEMO seed so the bars look alive.
 * - Supabase configured: sums real contributions; an empty/zero table means
 *   the bars legitimately start at $0.
 */
export async function getRaisedTotals(): Promise<RaisedTotals> {
  if (!supabase) {
    return { ...DEMO_RAISED_DOLLARS };
  }

  const totals: RaisedTotals = {};
  for (const e of HONEYMOON_EXPERIENCES) totals[e.id] = 0;

  try {
    const { data, error } = await supabase
      .from("honeymoon_contributions")
      .select("experience_id, amount_cents");

    if (error || !data) return totals;

    for (const row of data) {
      const id = row.experience_id as string;
      if (id in totals) {
        totals[id] += Math.round((row.amount_cents as number) / 100);
      }
    }
    return totals;
  } catch {
    // Supabase unreachable — show empty bars rather than crash the page.
    return totals;
  }
}

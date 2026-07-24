import { supabase } from "./supabase";

// Small server-side settings store backed by the `site_settings` table
// (migration 006). Server-only: these read the service-role Supabase client.

const RSVP_OPEN_KEY = "rsvp_open";

// Whether the public RSVP form is currently accepting responses.
//
// Fail-OPEN by design: demo mode, a missing row, a query error, or an
// unreachable Supabase all return `true`. A transient database hiccup should
// never surprise guests with a "closed" wall — the admin closes RSVPs by
// explicitly writing `false`, which is the only thing that returns closed.
export async function getRsvpOpen(): Promise<boolean> {
  if (!supabase) return true;
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", RSVP_OPEN_KEY)
      .maybeSingle();
    if (error || !data) return true;
    // Stored as a jsonb boolean; anything other than an explicit `false` is open.
    return data.value !== false;
  } catch {
    return true;
  }
}

// Persist the RSVP-open flag. Returns whether the write succeeded. In demo mode
// (no Supabase) there's nothing to persist, so it reports success and the value
// simply resets to open on the next server read.
export async function setRsvpOpen(open: boolean): Promise<boolean> {
  if (!supabase) return true;
  try {
    const { error } = await supabase.from("site_settings").upsert(
      { key: RSVP_OPEN_KEY, value: open, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
    return !error;
  } catch {
    return false;
  }
}

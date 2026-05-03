import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client. The service-role key bypasses RLS and must
// never be exposed to the browser. All call sites are Next.js API routes
// (src/app/api/**), which run on the server.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

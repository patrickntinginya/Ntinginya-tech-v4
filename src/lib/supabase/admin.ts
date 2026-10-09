import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-only privileged client (service role). Bypasses RLS.
 * Use ONLY in server code that has already validated its input, for example the public contact
 * endpoint. Never import this file from a client component.
 */
export function createSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

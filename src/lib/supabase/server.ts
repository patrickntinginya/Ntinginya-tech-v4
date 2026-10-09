import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabasePublicEnv } from "./env";

/** Server client bound to the visitor's session cookies. RLS applies as that user. */
export async function createSupabaseServerClient() {
  const env = getSupabasePublicEnv();
  if (!env) throw new Error("Supabase is not configured.");
  const cookieStore = await cookies();
  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component, where cookies are read-only. Middleware refreshes sessions.
        }
      },
    },
  });
}

/**
 * Anonymous, cookie-free client for public pages. It reads as "anon", so RLS
 * guarantees only PUBLISHED posts are visible, and pages can be cached.
 */
export function createSupabasePublicClient() {
  const env = getSupabasePublicEnv();
  if (!env) return null;
  return createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

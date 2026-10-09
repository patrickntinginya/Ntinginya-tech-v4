"use client";

import { createBrowserClient } from "@supabase/ssr";

/** Browser client: anon key only. Every request it makes is limited by Row Level Security. */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase is not configured.");
  return createBrowserClient(url, anonKey);
}

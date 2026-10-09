import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Role = "user" | "admin" | "owner";
export type Profile = { id: string; email: string | null; full_name: string | null; role: Role };
export const STAFF_ROLES: ReadonlyArray<Role> = ["admin", "owner"];

export function isStaffRole(role: string | null | undefined): boolean {
  return role === "admin" || role === "owner";
}

/** Returns the signed-in user's profile, or null. Uses getUser(), which re-validates the token with Supabase. */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("id, email, full_name, role").eq("id", user.id).maybeSingle();
  return (data as Profile | null) ?? null;
});

/** For admin pages: redirects to /login unless the user is an admin or owner. */
export async function requireStaff(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (!isStaffRole(profile.role)) redirect("/login?error=forbidden");
  return profile;
}

/** For server actions and API routes: same check, but returns null instead of redirecting. */
export async function getStaffOrNull(): Promise<Profile | null> {
  const profile = await getCurrentProfile();
  return profile && isStaffRole(profile.role) ? profile : null;
}

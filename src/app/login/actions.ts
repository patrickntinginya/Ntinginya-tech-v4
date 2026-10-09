"use server";

import { redirect } from "next/navigation";
import { isStaffRole, type Profile } from "@/lib/auth";
import { logActivity } from "@/lib/cms/activity";
import type { FormState } from "@/lib/cms/action-types";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Only same-site /admin paths are allowed as a post-login target (no open redirects). */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  if (next.startsWith("/admin") && !next.startsWith("//") && !next.includes("\\") && !next.includes(":")) return next;
  return "/admin";
}

export async function loginAction(_prev: FormState, form: FormData): Promise<FormState> {
  if (!isSupabaseConfigured()) {
    return { error: "Sign-in is not set up yet. Supabase settings were not available when this site was built. Redeploy the site." };
  }
  const email = typeof form.get("email") === "string" ? (form.get("email") as string).trim().toLowerCase() : "";
  const password = typeof form.get("password") === "string" ? (form.get("password") as string) : "";
  if (!EMAIL.test(email) || email.length > 200) return { error: "Enter a valid email address.", fieldErrors: { email: "Enter a valid email address." } };
  if (!password || password.length > 200) return { error: "Enter your password.", fieldErrors: { password: "Enter your password." } };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    // One message for every failure, so the form never reveals which emails exist.
    return { error: "The email or password is not correct." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", data.user.id)
    .maybeSingle();

  // PGRST205: the table does not exist, i.e. the SQL in supabase/migrations has not been run yet.
  if (profileError?.code === "PGRST205") {
    await supabase.auth.signOut();
    return { error: "Sign-in works, but the database is not set up yet. The site owner needs to run the Supabase migrations." };
  }

  if (!profile || !isStaffRole((profile as Profile).role)) {
    await supabase.auth.signOut();
    return { error: "This account does not have access to the admin area." };
  }

  await logActivity(supabase, data.user.id, "login", { type: "session" });
  redirect(safeNext(form.get("next")));
}

export async function logoutAction(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) await logActivity(supabase, user.id, "logout", { type: "session" });
    await supabase.auth.signOut();
  }
  redirect("/login");
}

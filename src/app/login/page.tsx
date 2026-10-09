import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { getCurrentProfile, isStaffRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false, nocache: true },
};

type SP = { next?: string | string[]; error?: string | string[] };
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function LoginPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const profile = await getCurrentProfile();
  if (profile && isStaffRole(profile.role)) redirect("/admin");

  const next = first(sp.next);
  const forbidden = first(sp.error) === "forbidden";

  return (
    <section className="bg-mist py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-md rounded-2xl border border-deep/15 bg-paper p-6 sm:p-8">
          <h1 className="font-sans text-3xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-2 text-base text-deep/75">Administrator access for Ntinginya Tech.</p>
          {forbidden ? (
            <p role="alert" className="mt-5 rounded-lg border border-red-700/40 bg-red-50 p-3 font-sans text-sm text-red-900">
              That account does not have access to the admin area.
            </p>
          ) : null}
          {!isSupabaseConfigured() ? (
            <p role="alert" className="mt-5 rounded-lg border border-maize-700/50 bg-maize-300/40 p-3 font-sans text-sm">
              Sign-in is not set up yet. Supabase settings were not available when this site was built. If they
              have been added in Netlify, redeploy the site so the build picks them up.
            </p>
          ) : null}
          <LoginForm next={next} />
        </div>
      </Container>
    </section>
  );
}

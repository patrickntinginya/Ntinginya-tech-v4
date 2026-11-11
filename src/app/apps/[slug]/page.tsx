import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabasePublicClient } from "@/lib/supabase/server";
import ApkSafetyNotice from "@/components/apps/ApkSafetyNotice";

export const revalidate = 60;

export default async function PublicAppPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createSupabasePublicClient();
  if (!supabase) notFound();

  const { data: app } = await supabase
    .from("apps")
    .select("id,name,slug,description,icon_url")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!app) notFound();

  const { data: releases } = await supabase
    .from("app_releases")
    .select("id,version,version_code,release_notes,file_name,size_bytes,published_at")
    .eq("app_id", app.id)
    .eq("status", "PUBLISHED")
    .not("published_at", "is", null)
    .order("version_code", { ascending: false });

  const latest = releases?.[0];

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-12 sm:px-6">
      <Link href="/apps" className="text-sm font-semibold">← All apps</Link>

      <ApkSafetyNotice />

      <section className="mt-8 rounded-2xl border border-deep/15 bg-paper p-6 sm:p-8">
        {app.icon_url ? <img src={app.icon_url} alt="" className="mb-5 h-20 w-20 rounded-2xl object-cover" /> : null}
        <h1 className="text-3xl font-bold">{app.name}</h1>
        <p className="mt-4 whitespace-pre-wrap text-deep/75">{app.description}</p>

        {latest ? (
          <div className="mt-8 rounded-xl bg-mist p-5">
            <p className="text-sm text-deep/65">Latest release</p>
            <h2 className="mt-1 text-xl font-semibold">Version {latest.version}</h2>
            <p className="mt-1 text-sm text-deep/65">{(latest.size_bytes / 1048576).toFixed(1)} MB</p>
            <a href={`/api/apps/${latest.id}/download`} className="mt-5 inline-flex min-h-12 items-center justify-center rounded-lg bg-deep px-6 font-semibold text-white">
              Download APK
            </a>
          </div>
        ) : (
          <p className="mt-8 rounded-xl bg-mist p-5 text-sm">No published APK release is available yet.</p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold">Release history</h2>
        {!releases?.length ? <p className="text-sm text-deep/65">No releases published.</p> : (
          <div className="space-y-3">
            {releases.map((release) => (
              <div key={release.id} className="rounded-xl border border-deep/15 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">Version {release.version}</h3>
                    <p className="text-xs text-deep/65">Code {release.version_code} · {(release.size_bytes / 1048576).toFixed(1)} MB</p>
                  </div>
                  <a className="font-semibold underline" href={`/api/apps/${release.id}/download`}>Download</a>
                </div>
                {release.release_notes ? <p className="mt-3 whitespace-pre-wrap text-sm text-deep/75">{release.release_notes}</p> : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

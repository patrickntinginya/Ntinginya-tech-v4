import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedApps } from "@/lib/apps/public";

export const revalidate = 60;

export default async function AppsPage() {
  const apps = await getPublishedApps();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-field-700">
          Ntinginya Tech
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Our Apps</h1>
        <p className="mt-3 max-w-2xl text-deep/70">
          Discover and download applications built and published by Ntinginya Tech.
        </p>
      </header>

      {!apps.length ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-deep/70">
          No published apps are available yet.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <article
              key={app.id}
              className="flex flex-col rounded-2xl border border-deep/15 bg-paper p-6 transition hover:border-deep/40"
            >
              <div className="flex items-center gap-4">
                {app.icon_url ? (
                  <img
                    src={app.icon_url}
                    alt=""
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-mist text-2xl font-bold">
                    {app.name.slice(0, 1)}
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-semibold">{app.name}</h2>
                  <p className="mt-1 text-sm text-deep/65">
                    Version {app.latestRelease.version}
                  </p>
                </div>
              </div>

              <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-deep/70">
                {app.description || "Application by Ntinginya Tech."}
              </p>

              <p className="mt-3 text-xs text-deep/60">
                {(app.latestRelease.size_bytes / 1048576).toFixed(1)} MB
                {" · "}Version code {app.latestRelease.version_code}
              </p>

              <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
                <a
                  href={`/api/apps/${app.latestRelease.id}/download`}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-deep px-4 text-sm font-semibold text-white transition hover:bg-field-800"
                >
                  Download APK
                </a>

                <Link
                  href={`/apps/${app.slug}`}
                  className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold underline underline-offset-4"
                >
                  Details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

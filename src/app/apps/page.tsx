import Link from "next/link";
import { createSupabasePublicClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function AppsPage() {
  const supabase = createSupabasePublicClient();

  const { data: apps } = supabase
    ? await supabase
        .from("apps")
        .select("id,name,slug,description,icon_url")
        .eq("is_published", true)
        .order("name")
    : { data: [] };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-field-700">Ntinginya Tech</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Our Apps</h1>
        <p className="mt-3 max-w-2xl text-deep/70">Discover and download applications from Ntinginya Tech.</p>
      </header>

      {!apps?.length ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-deep/70">No published apps are available yet.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <Link key={app.id} href={`/apps/${app.slug}`} className="rounded-2xl border border-deep/15 bg-paper p-6 transition hover:border-deep/40">
              {app.icon_url ? <img src={app.icon_url} alt="" className="mb-4 h-16 w-16 rounded-xl object-cover" /> : null}
              <h2 className="text-xl font-semibold">{app.name}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-deep/70">{app.description}</p>
              <span className="mt-5 inline-block text-sm font-semibold">View app →</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

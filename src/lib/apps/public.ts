import { createSupabasePublicClient } from "@/lib/supabase/server";

export async function getPublishedApps(limit?: number) {
  const supabase = createSupabasePublicClient();
  if (!supabase) return [];

  const now = new Date().toISOString();

  const { data: releases, error: releasesError } = await supabase
    .from("app_releases")
    .select("id,app_id,version,version_code,size_bytes,published_at")
    .eq("status", "PUBLISHED")
    .not("published_at", "is", null)
    .lte("published_at", now)
    .order("version_code", { ascending: false });

  if (releasesError || !releases?.length) return [];

  // Keep only the newest published release for each app.
  const latestByApp = new Map<string, (typeof releases)[number]>();

  for (const release of releases) {
    if (!latestByApp.has(release.app_id)) {
      latestByApp.set(release.app_id, release);
    }
  }

  const appIds = [...latestByApp.keys()];

  const { data: apps, error: appsError } = await supabase
    .from("apps")
    .select("id,name,slug,description,icon_url")
    .eq("is_published", true)
    .in("id", appIds)
    .order("name");

  if (appsError || !apps?.length) return [];

  const results = apps
    .map((app) => ({
      ...app,
      latestRelease: latestByApp.get(app.id)!,
    }))
    .filter((app) => Boolean(app.latestRelease));

  return typeof limit === "number" ? results.slice(0, limit) : results;
}

import { requireStaff } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader, Card, Empty, StatusPill } from "@/components/admin/ui";
import { ApkUploader } from "./ApkUploader";
import { CreateAppForm } from "./CreateAppForm";
import { ReleaseActions } from "./ReleaseActions";
import { AppPublishAction } from "./AppPublishAction";

export const dynamic = "force-dynamic";

export default async function AdminAppsPage() {
  await requireStaff();
  const supabase = await createSupabaseServerClient();

  const { data: apps, error } = await supabase
    .from("apps")
    .select("id,name,slug,description,is_published,app_releases(id,version,version_code,status,file_name,size_bytes,created_at)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Apps & APK Distribution" description="Manage Android apps, upload APK releases and publish downloads." />

      {error ? <p role="alert" className="mb-4 text-red-700">{error.message}</p> : null}

      <Card className="mb-6">
        <h2 className="text-xl font-semibold">Add an app</h2>
        <CreateAppForm />
      </Card>

      <div className="space-y-5">
        {(apps ?? []).length === 0 ? <Empty>No apps created yet.</Empty> : null}

        {(apps ?? []).map((app) => {
          const releases = [...(app.app_releases ?? [])].sort((a, b) => b.version_code - a.version_code);
          return (
            <Card key={app.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{app.name}</h2>
                  <p className="text-sm text-deep/65">/apps/{app.slug}</p>
                  {app.description ? <p className="mt-2 text-sm">{app.description}</p> : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-md px-2 py-1 text-xs font-semibold ${app.is_published ? "bg-field-100 text-field-800" : "bg-maize-300/60 text-maize-700"}`}>
                    {app.is_published ? "PUBLISHED" : "HIDDEN"}
                  </span>
                  <AppPublishAction appId={app.id} published={app.is_published} />
                </div>
              </div>

              <ApkUploader appId={app.id} />

              <div className="mt-6 border-t border-deep/10 pt-4">
                <h3 className="mb-3 font-semibold">Releases ({releases.length})</h3>
                {releases.length === 0 ? <p className="text-sm text-deep/65">No releases yet.</p> : (
                  <div className="space-y-3">
                    {releases.map((release) => (
                      <div key={release.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-deep/10 p-3">
                        <div>
                          <p className="font-semibold">Version {release.version} · Code {release.version_code}</p>
                          <p className="text-xs text-deep/65">{release.file_name} · {(release.size_bytes / 1048576).toFixed(1)} MB</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusPill status={release.status} />
                          <ReleaseActions releaseId={release.id} status={release.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

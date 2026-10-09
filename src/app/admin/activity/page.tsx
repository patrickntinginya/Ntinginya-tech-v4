import { Empty, PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { actionLabel, listActivity } from "@/lib/cms/admin";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Activity" };

export default async function ActivityPage() {
  await requireStaff();
  const rows = await listActivity(150);
  return (
    <>
      <PageHeader title="Activity log" description="Who did what, most recent first. Passwords and secrets are never recorded." />
      {rows.length === 0 ? (
        <Empty>No activity yet.</Empty>
      ) : (
        <ul className="divide-y divide-deep/10 rounded-2xl border border-deep/15 bg-paper">
          {rows.map((a) => (
            <li key={a.id} className="flex flex-col gap-1 px-4 py-3 font-sans sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium">{actionLabel(a.action)}</p>
                <p className="truncate text-xs text-deep/70">
                  {a.user_name}
                  {a.target_type ? ` · ${a.target_type}` : ""}
                </p>
              </div>
              <time dateTime={a.created_at} className="text-xs text-deep/70">{formatDateTime(a.created_at)}</time>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

import Link from "next/link";
import { Card, Empty, PageHeader, StatCard, StatusPill, btnDark, btnOutline } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { actionLabel, getDashboard } from "@/lib/cms/admin";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  await requireStaff();
  const { stats, recentPosts, recentMessages, recentActivity } = await getDashboard();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Live numbers from your database."
        actions={
          <>
            <Link href="/admin/posts/new" className={btnDark}>
              New post
            </Link>
            <Link href="/admin/media" className={btnOutline}>
              Upload media
            </Link>
            <Link href="/admin/messages" className={btnOutline}>
              View messages
            </Link>
            <Link href="/admin/content" className={btnOutline}>
              Manage products
            </Link>
            <Link href="/admin/categories" className={btnOutline}>
              Manage categories
            </Link>
          </>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Total posts" value={stats.total} href="/admin/posts" />
        <StatCard label="Published" value={stats.published} href="/admin/posts?status=PUBLISHED" />
        <StatCard label="Drafts" value={stats.drafts} href="/admin/posts?status=DRAFT" />
        <StatCard label="Scheduled" value={stats.scheduled} href="/admin/posts?status=PUBLISHED" />
        <StatCard label="Content entries" value={stats.entries} href="/admin/content" />
        <StatCard label="Categories" value={stats.categories} href="/admin/categories" />
        <StatCard label="Media files" value={stats.media} href="/admin/media" />
        <StatCard label="Unread messages" value={stats.unread} href="/admin/messages?filter=unread" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <Card>
          <h2 className="font-sans text-xl font-semibold">Recent posts</h2>
          {recentPosts.length === 0 ? (
            <div className="mt-4"><Empty>No posts yet.</Empty></div>
          ) : (
            <ul className="mt-4 divide-y divide-deep/10">
              {recentPosts.map((p) => (
                <li key={p.id} className="py-3">
                  <Link href={`/admin/posts/${p.id}/edit`} className="block font-sans font-medium hover:underline">
                    {p.title}
                  </Link>
                  <p className="mt-1 flex items-center gap-2 font-sans text-xs text-deep/70">
                    <StatusPill status={p.status} /> {formatDateTime(p.updated_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="font-sans text-xl font-semibold">Recent messages</h2>
          {recentMessages.length === 0 ? (
            <div className="mt-4"><Empty>No messages yet.</Empty></div>
          ) : (
            <ul className="mt-4 divide-y divide-deep/10">
              {recentMessages.map((m) => (
                <li key={m.id} className="py-3">
                  <Link href="/admin/messages" className="block font-sans font-medium hover:underline">
                    {m.is_read ? "" : "● "}
                    {m.name}
                  </Link>
                  <p className="mt-1 truncate font-sans text-xs text-deep/70">
                    {m.subject || "No subject"} · {formatDateTime(m.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="font-sans text-xl font-semibold">Recent activity</h2>
          {recentActivity.length === 0 ? (
            <div className="mt-4"><Empty>No activity yet.</Empty></div>
          ) : (
            <ul className="mt-4 divide-y divide-deep/10">
              {recentActivity.map((a) => (
                <li key={a.id} className="py-3 font-sans text-sm">
                  <p className="font-medium">{actionLabel(a.action)}</p>
                  <p className="mt-0.5 text-xs text-deep/70">
                    {a.user_name} · {formatDateTime(a.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/activity" className="mt-3 inline-block font-sans text-sm font-semibold underline underline-offset-4">
            See all activity
          </Link>
        </Card>
      </div>
    </>
  );
}

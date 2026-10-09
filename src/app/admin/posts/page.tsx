import Link from "next/link";
import { setPostStatusAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Empty, Notice, PageHeader, StatusPill, btnDark, btnOutline } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { listAdminPosts } from "@/lib/cms/admin";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";
export const metadata = { title: "Posts" };

type SP = { status?: string; q?: string; notice?: string };
const FILTERS = [
  ["", "All"],
  ["PUBLISHED", "Published"],
  ["DRAFT", "Drafts"],
  ["ARCHIVED", "Archived"],
] as const;

const small = "inline-flex min-h-10 items-center justify-center rounded-md border border-deep/25 px-3 font-sans text-sm font-medium hover:bg-deep/5";

export default async function PostsPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireStaff();
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : "";
  const q = typeof sp.q === "string" ? sp.q.slice(0, 80) : "";
  const posts = await listAdminPosts({ status, q });

  return (
    <>
      <PageHeader
        title="Posts"
        description="Write, publish and manage News & Insights articles."
        actions={
          <Link href="/admin/posts/new" className={btnDark}>
            New post
          </Link>
        }
      />
      <Notice code={sp.notice} />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
          {FILTERS.map(([value, label]) => (
            <Link
              key={label}
              href={value ? `/admin/posts?status=${value}${q ? `&q=${encodeURIComponent(q)}` : ""}` : `/admin/posts${q ? `?q=${encodeURIComponent(q)}` : ""}`}
              aria-current={status === value ? "true" : undefined}
              className={cn("inline-flex min-h-10 items-center rounded-md border px-3 font-sans text-sm font-medium", status === value ? "border-deep bg-deep text-white" : "border-deep/30 hover:bg-deep/5")}
            >
              {label}
            </Link>
          ))}
        </nav>
        <form method="get" role="search" className="flex gap-2">
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <label htmlFor="post-search" className="sr-only">Search posts</label>
          <input id="post-search" name="q" type="search" defaultValue={q} maxLength={80} placeholder="Search titles" className="min-h-11 w-full rounded-lg border border-deep/30 bg-white px-3.5 font-sans text-base lg:w-64" />
          <button type="submit" className={btnOutline}>Search</button>
        </form>
      </div>

      {posts.length === 0 ? (
        <Empty>{q || status ? "No posts match." : "No posts yet. Create your first post."}</Empty>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => {
            const cat = Array.isArray(p.categories) ? p.categories[0] : p.categories;
            return (
              <li key={p.id} className="rounded-xl border border-deep/15 bg-paper p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <Link href={`/admin/posts/${p.id}/edit`} className="block break-words font-sans text-lg font-semibold hover:underline">
                      {p.title}
                    </Link>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs text-deep/70">
                      <StatusPill status={p.status} />
                      {p.featured ? <span className="rounded-md bg-maize-300/60 px-2 py-0.5 font-semibold text-maize-700">Featured</span> : null}
                      {cat ? <span>{cat.name}</span> : <span>No category</span>}
                      <span>Updated {formatDate(p.updated_at)}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/posts/${p.id}/edit`} className={small}>Edit</Link>
                    {p.status === "PUBLISHED" ? (
                      <>
                        <Link href={`/news/${p.slug}`} target="_blank" className={small}>View</Link>
                        <form action={setPostStatusAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="to" value="DRAFT" />
                          <button type="submit" className={small}>Unpublish</button>
                        </form>
                      </>
                    ) : (
                      <form action={setPostStatusAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="to" value="PUBLISHED" />
                        <ConfirmButton confirm="Publish this post now? It will be visible to everyone." className={small}>Publish</ConfirmButton>
                      </form>
                    )}
                    {p.status !== "ARCHIVED" ? (
                      <form action={setPostStatusAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="to" value="ARCHIVED" />
                        <button type="submit" className={small}>Archive</button>
                      </form>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

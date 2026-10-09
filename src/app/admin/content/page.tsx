import Link from "next/link";
import { deleteEntryAction, setEntryPublishedAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Empty, Notice, PageHeader, StatusPill, btnDanger, btnDark, btnOutline } from "@/components/admin/ui";
import { ENTRY_KINDS, STATUS_TEXT, isEntryKind, kindMeta } from "@/content/entry-kinds";
import type { StatusKey } from "@/content/types";
import { requireStaff } from "@/lib/auth";
import { listAdminEntries } from "@/lib/cms/admin";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";
export const metadata = { title: "Content" };

const small = "inline-flex min-h-11 items-center rounded-lg border border-deep/30 px-3 font-sans text-sm font-medium hover:bg-deep/5";

export default async function ContentPage({ searchParams }: { searchParams: Promise<{ kind?: string; notice?: string }> }) {
  await requireStaff();
  const sp = await searchParams;
  const kind = isEntryKind(sp.kind) ? sp.kind : undefined;
  const entries = await listAdminEntries(kind);

  return (
    <>
      <PageHeader
        title="Content"
        description="Products, solutions, Masterclass sessions and R&D items. Articles are managed under Posts."
        actions={
          <Link href={`/admin/content/new?kind=${kind ?? "product"}`} className={btnDark}>
            New {kindMeta[kind ?? "product"].label.toLowerCase()}
          </Link>
        }
      />
      <Notice code={sp.notice} />

      <nav aria-label="Content type" className="mb-5 flex flex-wrap gap-2">
        {[{ value: "", label: "All" }, ...ENTRY_KINDS.map((k) => ({ value: k, label: kindMeta[k].plural }))].map((t) => (
          <Link
            key={t.label}
            href={t.value ? `/admin/content?kind=${t.value}` : "/admin/content"}
            aria-current={(kind ?? "") === t.value ? "true" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center rounded-md border px-3 font-sans text-sm font-medium",
              (kind ?? "") === t.value ? "border-deep bg-deep text-white" : "border-deep/30 hover:bg-deep/5",
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {entries.length === 0 ? (
        <Empty>
          Nothing here yet. The website shows its built-in content until you publish something. Use the button above to add the first one.
        </Empty>
      ) : (
        <ul className="space-y-3">
          {entries.map((e) => (
            <li key={e.id} className="rounded-xl border border-deep/15 bg-paper p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <Link href={`/admin/content/${e.id}/edit`} className="block break-words font-sans text-lg font-semibold hover:underline">
                    {e.title}
                  </Link>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs text-deep/70">
                    <StatusPill status={e.is_published ? "PUBLISHED" : "DRAFT"} />
                    <span>{kindMeta[e.kind].label}</span>
                    <span>{STATUS_TEXT[e.status_label as StatusKey] ?? e.status_label}</span>
                    {e.featured ? <span className="font-semibold">Featured</span> : null}
                    <span>Updated {formatDate(e.updated_at)}</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/content/${e.id}/edit`} className={small}>
                    Edit
                  </Link>
                  <form action={setEntryPublishedAction}>
                    <input type="hidden" name="id" value={e.id} />
                    <input type="hidden" name="publish" value={e.is_published ? "0" : "1"} />
                    <button type="submit" className={small}>
                      {e.is_published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={deleteEntryAction}>
                    <input type="hidden" name="id" value={e.id} />
                    <ConfirmButton confirm="Delete this permanently?" className={cn(btnDanger, "min-h-11")}>
                      Delete
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-8 font-sans text-sm text-deep/70">
        Built-in content that is not listed here lives in the source code and is shown alongside what you publish.{" "}
        <Link href="/admin/posts" className={cn(btnOutline, "ml-1 min-h-0 px-2 py-1 text-sm")}>
          Manage articles
        </Link>
      </p>
    </>
  );
}

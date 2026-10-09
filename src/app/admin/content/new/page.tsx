import { EntryForm } from "@/components/admin/EntryForm";
import { PageHeader } from "@/components/admin/ui";
import { isEntryKind, kindMeta } from "@/content/entry-kinds";
import { requireStaff } from "@/lib/auth";
import { listAdminMedia } from "@/lib/cms/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "New content" };

export default async function NewEntryPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  await requireStaff();
  const sp = await searchParams;
  const kind = isEntryKind(sp.kind) ? sp.kind : "product";
  const media = await listAdminMedia(undefined, 60);
  return (
    <>
      <PageHeader title={`New ${kindMeta[kind].label.toLowerCase()}`} description="Save it as a draft first if you are not ready. Nothing is public until you tick Published." />
      <EntryForm kind={kind} entry={null} media={media} />
    </>
  );
}

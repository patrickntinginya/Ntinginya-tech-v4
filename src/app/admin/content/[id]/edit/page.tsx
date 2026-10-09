import { notFound } from "next/navigation";
import { EntryForm } from "@/components/admin/EntryForm";
import { Notice, PageHeader } from "@/components/admin/ui";
import { isEntryKind } from "@/content/entry-kinds";
import { requireStaff } from "@/lib/auth";
import { getAdminEntry, listAdminMedia } from "@/lib/cms/admin";
import { isUuid } from "@/lib/cms/validation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit content" };

export default async function EditEntryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  await requireStaff();
  const { id } = await params;
  const sp = await searchParams;
  if (!isUuid(id)) notFound();
  const [entry, media] = await Promise.all([getAdminEntry(id), listAdminMedia(undefined, 60)]);
  if (!entry || !isEntryKind(entry.kind)) notFound();
  return (
    <>
      <PageHeader title={entry.title} description="Edit this item." />
      <Notice code={sp.notice} />
      <EntryForm kind={entry.kind} entry={entry} media={media} />
    </>
  );
}

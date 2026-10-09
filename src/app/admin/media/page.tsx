import { MediaGrid } from "@/components/admin/MediaGrid";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { Card, Notice, PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { listAdminMedia } from "@/lib/cms/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Media" };

export default async function MediaPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  await requireStaff();
  const { notice } = await searchParams;
  const media = await listAdminMedia(undefined, 200);
  return (
    <>
      <PageHeader title="Media library" description="Images for articles. Tap an image to copy its link or delete it." />
      <Notice code={notice} />
      <div className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <Card className="h-fit">
          <h2 className="mb-4 font-sans text-xl font-semibold">Upload</h2>
          <MediaUploader />
        </Card>
        <MediaGrid media={media} />
      </div>
    </>
  );
}

import { PostForm } from "@/components/admin/PostForm";
import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { listAdminCategories, listAdminMedia } from "@/lib/cms/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "New post" };

export default async function NewPostPage() {
  await requireStaff();
  const [categories, media] = await Promise.all([listAdminCategories(), listAdminMedia(undefined, 60)]);
  return (
    <>
      <PageHeader title="New post" description="Save a draft any time. Nothing is public until you publish." />
      <PostForm post={null} initialHtml="" categories={categories} media={media} />
    </>
  );
}

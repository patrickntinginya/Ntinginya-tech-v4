import Link from "next/link";
import { notFound } from "next/navigation";
import { deletePostAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { PostForm } from "@/components/admin/PostForm";
import { Notice, PageHeader, btnDanger, btnOutline } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { getAdminPost, listAdminCategories, listAdminMedia } from "@/lib/cms/admin";
import { sanitizeArticleHtml } from "@/lib/cms/sanitize";
import { isUuid } from "@/lib/cms/validation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit post" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ notice?: string }> };

export default async function EditPostPage({ params, searchParams }: Props) {
  await requireStaff();
  const { id } = await params;
  const { notice } = await searchParams;
  if (!isUuid(id)) notFound();

  const [post, categories, media] = await Promise.all([getAdminPost(id), listAdminCategories(), listAdminMedia(undefined, 60)]);
  if (!post) notFound();

  return (
    <>
      <PageHeader
        title="Edit post"
        actions={
          post.status === "PUBLISHED" ? (
            <Link href={`/news/${post.slug}`} target="_blank" className={btnOutline}>
              View live
            </Link>
          ) : undefined
        }
      />
      <Notice code={notice} />
      {/* key: a fresh editor is mounted whenever the saved version changes. Content is re-sanitised before it is loaded. */}
      <PostForm key={post.updated_at} post={post} initialHtml={sanitizeArticleHtml(post.content)} categories={categories} media={media} />

      <div className="mt-10 rounded-xl border border-red-700/30 p-4">
        <h2 className="font-sans text-lg font-semibold">Delete this post</h2>
        <p className="mt-1 font-sans text-sm text-deep/75">This permanently removes the post. To keep it but hide it, use Archive instead.</p>
        <form action={deletePostAction} className="mt-3">
          <input type="hidden" name="id" value={post.id} />
          <ConfirmButton confirm="Delete this post permanently? This cannot be undone." className={btnDanger}>
            Delete post
          </ConfirmButton>
        </form>
      </div>
    </>
  );
}

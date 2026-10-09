"use client";

import { useActionState, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { savePostAction } from "@/app/admin/actions";
import type { AdminCategory, AdminMedia, AdminPost } from "@/lib/cms/admin";
import type { FormState } from "@/lib/cms/action-types";
import { slugify } from "@/lib/cms/slug";
import { ImageField } from "./ImageField";
import { RichEditor } from "./RichEditor";
import { StatusPill, btnDark, btnGreen, btnOutline, inputClass, labelClass } from "./ui";

export function PostForm({
  post,
  initialHtml,
  categories,
  media,
}: {
  post: AdminPost | null;
  initialHtml: string;
  categories: AdminCategory[];
  media: AdminMedia[];
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePostAction, {});
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? "");
  const [content, setContent] = useState(initialHtml);
  const [tags, setTags] = useState((post?.tags ?? []).join(", "));
  const [authorName, setAuthorName] = useState(post?.author_name ?? "");
  // The picker works in the device's local time; the server receives an ISO (UTC) timestamp.
  // Filled after mount so the server (UTC) and the phone's time zone never disagree during hydration.
  const [publishedLocal, setPublishedLocal] = useState("");
  useEffect(() => {
    if (post?.published_at) setPublishedLocal(toLocalInput(post.published_at));
  }, [post?.published_at]);
  const publishedIso = publishedLocal && !Number.isNaN(new Date(publishedLocal).getTime()) ? new Date(publishedLocal).toISOString() : "";
  const status = post?.status ?? "DRAFT";

  return (
    <form action={action} className="space-y-6">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="published_at" value={publishedIso} />

      <div aria-live="polite">
        {state.error ? (
          <p role="alert" className="rounded-lg border border-red-700/40 bg-red-50 p-3 font-sans text-sm text-red-900">
            {state.error}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2 font-sans text-sm text-deep/75">
        Status: <StatusPill status={status} />
      </div>

      <div>
        <label htmlFor="post-title" className={labelClass}>
          Title
        </label>
        <input
          id="post-title"
          name="title"
          type="text"
          required
          maxLength={200}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="post-slug" className={labelClass}>
          Slug (web address)
        </label>
        <input
          id="post-slug"
          name="slug"
          type="text"
          maxLength={100}
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          aria-invalid={state.fieldErrors?.slug ? true : undefined}
          aria-describedby="slug-help"
          className={inputClass}
        />
        <p id="slug-help" className="mt-1 break-all font-sans text-xs text-deep/70">
          /news/{slug || "your-title-here"} · Created from the title; you can edit it. Each slug must be unique.
        </p>
      </div>

      <div>
        <label htmlFor="post-excerpt" className={labelClass}>
          Excerpt
        </label>
        <textarea id="post-excerpt" name="excerpt" rows={3} maxLength={400} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={inputClass} />
        <p className="mt-1 text-right font-sans text-xs text-deep/70">{excerpt.length}/400</p>
      </div>

      <div>
        <p id="content-label" className={labelClass}>
          Content
        </p>
        <RichEditor initialHtml={initialHtml} onChange={setContent} media={media} />
        {state.fieldErrors?.content ? <p className="mt-1 font-sans text-sm text-red-800">{state.fieldErrors.content}</p> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label htmlFor="post-category" className={labelClass}>
            Category
          </label>
          <select id="post-category" name="category_id" defaultValue={post?.category_id ?? ""} className={inputClass}>
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <ImageField name="featured_image" label="Featured image" initial={post?.featured_image ?? ""} media={media} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div>
          <label htmlFor="post-author" className={labelClass}>
            Author (shown publicly)
          </label>
          <input id="post-author" name="author_name" type="text" maxLength={120} value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Defaults to your profile name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="post-tags" className={labelClass}>
            Tags
          </label>
          <input id="post-tags" name="tags" type="text" maxLength={500} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="irrigation, livestock, ai" aria-describedby="tags-help" className={inputClass} />
          <p id="tags-help" className="mt-1 font-sans text-xs text-deep/70">Separate with commas. Up to 12.</p>
        </div>
        <div>
          <label htmlFor="post-published" className={labelClass}>
            Published date
          </label>
          <input id="post-published" type="datetime-local" value={publishedLocal} onChange={(e) => setPublishedLocal(e.target.value)} aria-describedby="published-help" className={inputClass} />
          <p id="published-help" className="mt-1 font-sans text-xs text-deep/70">Empty = the moment you publish. A future date keeps the article hidden until then.</p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-deep/15 p-4">
        <input id="post-featured" name="featured" type="checkbox" defaultChecked={post?.featured ?? false} className="mt-1 h-5 w-5 rounded border-deep/40" />
        <label htmlFor="post-featured" className="font-sans text-base">
          <span className="font-semibold">Featured article</span>
          <span className="block text-sm text-deep/75">Shown first on the home page and at the top of News &amp; Insights. Only published articles appear.</span>
        </label>
      </div>

      <fieldset className="space-y-5 rounded-xl border border-deep/15 p-4">
        <legend className="px-2 font-sans text-base font-semibold">Search and social (SEO)</legend>
        <p className="font-sans text-sm text-deep/75">Leave these empty to use the title, excerpt and featured image.</p>
        <div>
          <label htmlFor="post-seo-title" className={labelClass}>
            SEO title
          </label>
          <input id="post-seo-title" name="seo_title" type="text" maxLength={70} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputClass} />
          <p className="mt-1 text-right font-sans text-xs text-deep/70">{seoTitle.length}/70</p>
        </div>
        <div>
          <label htmlFor="post-seo-description" className={labelClass}>
            SEO description
          </label>
          <textarea id="post-seo-description" name="seo_description" rows={3} maxLength={170} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className={inputClass} />
          <p className="mt-1 text-right font-sans text-xs text-deep/70">{seoDescription.length}/170</p>
        </div>
        <ImageField name="social_image" label="Social sharing image" help="Shown when the article is shared. Falls back to the featured image." initial={post?.social_image ?? ""} media={media} />
      </fieldset>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap gap-2 border-t border-deep/15 bg-mist/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-4">
        {status === "PUBLISHED" ? (
          <>
            <button type="submit" name="intent" value="update" disabled={pending} className={btnGreen}>
              {pending ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
              Save changes
            </button>
            <button type="submit" name="intent" value="unpublish" disabled={pending} className={btnOutline}>
              Unpublish
            </button>
            <button type="submit" name="intent" value="archive" disabled={pending} className={btnOutline}>
              Archive
            </button>
          </>
        ) : status === "ARCHIVED" ? (
          <>
            <button type="submit" name="intent" value="update" disabled={pending} className={btnDark}>
              Save changes
            </button>
            <button type="submit" name="intent" value="draft" disabled={pending} className={btnOutline}>
              Restore to draft
            </button>
            <button type="submit" name="intent" value="publish" disabled={pending} className={btnGreen}>
              Publish
            </button>
          </>
        ) : (
          <>
            <button type="submit" name="intent" value="draft" disabled={pending} className={btnDark}>
              {pending ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
              Save draft
            </button>
            <button type="submit" name="intent" value="publish" disabled={pending} className={btnGreen}>
              Publish
            </button>
            {post ? (
              <button type="submit" name="intent" value="archive" disabled={pending} className={btnOutline}>
                Archive
              </button>
            ) : null}
          </>
        )}
      </div>
    </form>
  );
}

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

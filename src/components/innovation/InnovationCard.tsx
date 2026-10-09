import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import type { PublicPost } from "@/lib/cms/public";
import { countryFromTags } from "@/lib/innovation";
import { formatDate } from "@/lib/format";
import { CmsImage } from "@/components/media/CmsImage";
import { Card } from "@/components/ui/Card";

/** Innovation Hub card: image, title, short description, country, category, date and Read more. */
export function InnovationCard({ post, priority = false }: { post: PublicPost; priority?: boolean }) {
  const country = countryFromTags(post.tags);
  return (
    <Card as="article" interactive className="flex h-full flex-col overflow-hidden !p-0">
      <div className="bg-sage">
        {post.featured_image ? (
          <CmsImage
            src={post.featured_image}
            alt=""
            priority={priority}
            className="aspect-[16/10] w-full object-cover"
          />
        ) : (
          <div className="grid aspect-[16/10] w-full place-items-center bg-deep text-white/40">
            <Globe aria-hidden="true" className="h-10 w-10" strokeWidth={1.3} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <ul className="flex flex-wrap items-center gap-2 font-sans text-xs font-semibold" aria-label="Article details">
          {post.category ? (
            <li className="rounded-md bg-field-100 px-2 py-1 text-field-800">{post.category.name}</li>
          ) : null}
          {country ? <li className="rounded-md border border-deep/25 px-2 py-1 text-deep">{country}</li> : null}
        </ul>

        <h3 className="mt-3 font-sans text-xl font-semibold leading-tight tracking-tight text-balance">
          <Link
            href={`/news/${post.slug}`}
            className="underline-offset-4 hover:underline after:absolute after:inset-0 after:content-['']"
          >
            {post.title}
          </Link>
        </h3>

        {post.excerpt ? <p className="mt-2 text-base leading-relaxed text-deep/80">{post.excerpt}</p> : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5 font-sans text-sm">
          <time dateTime={post.published_at} className="text-deep/70">
            {formatDate(post.published_at)}
          </time>
          <span className="inline-flex items-center gap-1.5 font-semibold text-field-800">
            Read more<span className="sr-only"> about {post.title}</span>
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Card>
  );
}

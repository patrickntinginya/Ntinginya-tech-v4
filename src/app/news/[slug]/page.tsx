import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/news/PostCard";
import { CmsImage } from "@/components/media/CmsImage";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { getPublishedPost, getRelatedPosts } from "@/lib/cms/public";
import { htmlToText, sanitizeArticleHtml } from "@/lib/cms/sanitize";
import { formatDate } from "@/lib/format";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  // Unknown, draft and archived slugs get no metadata and are marked noindex.
  if (!post) return { title: "Article not found", robots: { index: false, follow: false } };

  const title = post.seo_title || post.title;
  const description =
    post.seo_description || post.excerpt || htmlToText(post.content).slice(0, 160) || siteConfig.description;
  const image = post.social_image || post.featured_image || undefined;
  const path = `/news/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    keywords: post.tags.length ? post.tags : undefined,
    authors: post.author_name ? [{ name: post.author_name }] : undefined,
    openGraph: {
      type: "article",
      siteName: siteConfig.name,
      title,
      description,
      url: path,
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: post.author_name ? [post.author_name] : undefined,
      tags: post.tags.length ? post.tags : undefined,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, images: image ? [image] : undefined },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);
  const html = sanitizeArticleHtml(post.content);
  const image = post.social_image || post.featured_image;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || undefined,
    image: image ? [image] : undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: post.author_name ? { "@type": "Person", name: post.author_name } : { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    keywords: post.tags.length ? post.tags.join(", ") : undefined,
    mainEntityOfPage: `${siteConfig.url}/news/${post.slug}`,
  };

  return (
    <>
      <article>
        <header className="border-b border-deep/10 bg-mist">
          <Container className="py-14 sm:py-20">
            <nav aria-label="Breadcrumb" className="font-sans text-sm text-deep/75">
              <ol className="flex flex-wrap items-center gap-2">
                <li><Link href="/" className="underline-offset-4 hover:underline">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/news" className="underline-offset-4 hover:underline">News &amp; Insights</Link></li>
              </ol>
            </nav>
            {post.category ? (
              <p className="mt-6">
                <Link href={`/news?category=${post.category.slug}`} className="rounded-md bg-field-100 px-2 py-1 font-sans text-xs font-semibold text-field-800 hover:bg-field-300">
                  {post.category.name}
                </Link>
              </p>
            ) : null}
            <h1 className="mt-4 max-w-4xl font-sans text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-balance sm:text-5xl">
              {post.title}
            </h1>
            {post.excerpt ? <p className="mt-5 max-w-2xl text-lg leading-relaxed text-deep/80 sm:text-xl">{post.excerpt}</p> : null}
            <p className="mt-6 font-sans text-sm text-deep/75">
              {post.author_name ? <>By {post.author_name} · </> : null}
              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              {post.updated_at && post.updated_at.slice(0, 10) !== post.published_at.slice(0, 10) ? (
                <> · Updated <time dateTime={post.updated_at}>{formatDate(post.updated_at)}</time></>
              ) : null}
            </p>
          </Container>
        </header>

        <div className="bg-paper py-12 sm:py-16">
          <Container>
            {post.featured_image ? (
              <figure className="mx-auto mb-10 max-w-4xl">
                <CmsImage
                  src={post.featured_image}
                  alt={post.title}
                  width={1600}
                  height={900}
                  sizes="(min-width: 1024px) 896px, 100vw"
                  priority
                  className="h-auto w-full rounded-2xl object-cover"
                />
              </figure>
            ) : null}
            {/* Content is sanitised (sanitize-html allow-list) both when saved and here, before rendering. */}
            <div className="article-prose mx-auto max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />
            {post.tags.length ? (
              <ul aria-label="Tags" className="mx-auto mt-10 flex max-w-3xl flex-wrap gap-2 border-t border-deep/10 pt-6">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <Link href={`/news?q=${encodeURIComponent(tag)}`} className="inline-block rounded-md border border-deep/15 px-2 py-1 font-sans text-xs font-medium text-deep/80 hover:border-field-700 hover:text-field-800">
                      #{tag}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </Container>
        </div>
      </article>

      {related.length ? (
        <section className="bg-mist py-14 sm:py-16" aria-labelledby="related-heading">
          <Container>
            <h2 id="related-heading" className="font-sans text-2xl font-semibold tracking-tight">More to read</h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.id} className="flex"><div className="w-full"><PostCard post={p} /></div></li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
      <CTASection />

      <script
        type="application/ld+json"
        // "<" is escaped so article text can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}

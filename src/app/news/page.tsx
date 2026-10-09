import Link from "next/link";
import { Search } from "lucide-react";
import { PostCard } from "@/components/news/PostCard";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { getFeaturedPosts, getPublicCategories, listPublishedPosts } from "@/lib/cms/public";
import { buildMetadata } from "@/lib/metadata";
import { cn } from "@/lib/cn";

export const metadata = buildMetadata({
  title: "News & Insights",
  description:
    "Articles and updates from Ntinginya Tech on technology, software, AI, agriculture and livestock innovation, research and education.",
  path: "/news",
});

export const revalidate = 60;

type SP = { q?: string | string[]; category?: string | string[]; page?: string | string[] };
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

function href(params: { q?: string; category?: string; page?: number }) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.category) sp.set("category", params.category);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const qs = sp.toString();
  return qs ? `/news?${qs}` : "/news";
}

export default async function NewsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = first(sp.q).slice(0, 80);
  const category = first(sp.category).slice(0, 80);
  const page = Math.max(1, parseInt(first(sp.page), 10) || 1);

  const [categories, result, featuredPosts] = await Promise.all([
    getPublicCategories(),
    listPublishedPosts({ q, categorySlug: category || undefined, page }),
    getFeaturedPosts(1),
  ]);

  const filtered = Boolean(q || category);
  const showFeatured = !filtered && page === 1 && result.posts.length > 0;
  // A post staff marked "Featured" leads the list; otherwise the newest article does.
  const featured = showFeatured ? featuredPosts[0] ?? result.posts[0] : undefined;
  const grid = showFeatured ? result.posts.filter((p) => p.id !== featured?.id) : result.posts;

  return (
    <>
      <PageHero
        crumb="News & Insights"
        title="News and insights."
        description="Practical writing on technology, software, AI, agriculture and livestock innovation, research and education."
      />

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <form action="/news" method="get" role="search" className="flex w-full max-w-md gap-2">
              {category ? <input type="hidden" name="category" value={category} /> : null}
              <label htmlFor="news-search" className="sr-only">
                Search articles
              </label>
              <input
                id="news-search"
                name="q"
                type="search"
                defaultValue={q}
                maxLength={80}
                placeholder="Search articles"
                className="min-h-11 w-full rounded-lg border border-deep/30 bg-white px-3.5 font-sans text-base placeholder:text-deep/50 focus-visible:border-field-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-field-700"
              />
              <button
                type="submit"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-deep px-4 font-sans text-[0.9375rem] font-semibold text-white hover:bg-deep-800"
              >
                <Search aria-hidden="true" className="h-4 w-4" />
                Search
              </button>
            </form>

            <nav aria-label="Categories">
              <ul className="flex flex-wrap gap-2">
                <li>
                  <Link
                    href={href({ q })}
                    aria-current={!category ? "true" : undefined}
                    className={cn(
                      "inline-flex min-h-9 items-center rounded-md border px-3 font-sans text-sm font-medium",
                      !category ? "border-deep bg-deep text-white" : "border-deep/30 hover:bg-deep/5",
                    )}
                  >
                    All
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={href({ q, category: c.slug })}
                      aria-current={category === c.slug ? "true" : undefined}
                      className={cn(
                        "inline-flex min-h-9 items-center rounded-md border px-3 font-sans text-sm font-medium",
                        category === c.slug ? "border-deep bg-deep text-white" : "border-deep/30 hover:bg-deep/5",
                      )}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-10">
            {result.posts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-deep/30 p-10 text-center">
                <h2 className="font-sans text-2xl font-semibold">
                  {filtered ? "No articles match your search." : "No articles have been published yet."}
                </h2>
                <p className="mt-2 text-deep/75">
                  {filtered ? "Try a different word or category." : "Check back soon for the first Ntinginya Tech article."}
                </p>
                {filtered ? (
                  <Link href="/news" className="mt-4 inline-block font-sans font-semibold underline underline-offset-4">
                    Show all articles
                  </Link>
                ) : null}
              </div>
            ) : (
              <>
                {featured ? (
                  <div className="mb-8">
                    <h2 className="sr-only">Featured article</h2>
                    <PostCard post={featured} featured priority />
                  </div>
                ) : null}
                {grid.length ? (
                  <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {grid.map((post) => (
                      <li key={post.id} className="flex">
                        <div className="w-full">
                          <PostCard post={post} />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            )}
          </div>

          {result.pageCount > 1 ? (
            <nav aria-label="Pagination" className="mt-10 flex items-center justify-between font-sans">
              {result.page > 1 ? (
                <Link href={href({ q, category, page: result.page - 1 })} className="min-h-11 rounded-lg border border-deep/30 px-4 py-2.5 font-semibold hover:bg-deep/5">
                  Newer articles
                </Link>
              ) : (
                <span />
              )}
              <span className="text-sm text-deep/70">
                Page {result.page} of {result.pageCount}
              </span>
              {result.page < result.pageCount ? (
                <Link href={href({ q, category, page: result.page + 1 })} className="min-h-11 rounded-lg border border-deep/30 px-4 py-2.5 font-semibold hover:bg-deep/5">
                  Older articles
                </Link>
              ) : (
                <span />
              )}
            </nav>
          ) : null}
        </Container>
      </section>
      <CTASection />
    </>
  );
}

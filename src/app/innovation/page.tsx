import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { PostCard } from "@/components/news/PostCard";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { publicationTopics } from "@/config/site";
import { getPublicCategories, listPublishedPosts } from "@/lib/cms/public";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "AI & Innovation",
  description: "Practical articles on artificial intelligence, digital innovation and technology shaping work and business.",
  path: "/innovation",
});

export const revalidate = 60;

type SP = { page?: string | string[] };
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function InnovationPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(first(sp.page), 10) || 1);
  const categories = await getPublicCategories();
  const category = categories.find((item) => item.slug === "ai-innovation");
  const result = category
    ? await listPublishedPosts({ categoryId: category.id, page })
    : { posts: [], total: 0, page, pageCount: 1 };
  const topic = publicationTopics.find((item) => item.slug === "ai-innovation")!;

  return (
    <>
      <PageHero
        crumb="AI & Innovation"
        title="AI & Innovation"
        description={topic.description}
      />
      <section className="bg-paper py-12 sm:py-16">
        <Container>
          {result.posts.length ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.posts.map((post) => (
                <li key={post.id} className="flex"><div className="w-full"><PostCard post={post} as="h2" /></div></li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-deep/15 bg-white p-8 text-center sm:p-12">
              <h2 className="font-sans text-2xl font-semibold">No AI &amp; Innovation articles are published yet.</h2>
              <p className="mt-2 text-deep/75">Browse all published insights across technology, business and finance.</p>
              <Link href="/news" className="mt-5 inline-block font-sans font-semibold underline underline-offset-4">Explore all articles</Link>
            </div>
          )}
          {result.pageCount > 1 ? (
            <nav aria-label="Pagination" className="mt-10 flex items-center justify-between font-sans">
              {result.page > 1 ? <Link href={`/innovation?page=${result.page - 1}`} className="min-h-11 rounded-lg border border-deep/30 px-4 py-2.5 font-semibold hover:bg-deep/5">Newer articles</Link> : <span />}
              <span className="text-sm text-deep/70">Page {result.page} of {result.pageCount}</span>
              {result.page < result.pageCount ? <Link href={`/innovation?page=${result.page + 1}`} className="min-h-11 rounded-lg border border-deep/30 px-4 py-2.5 font-semibold hover:bg-deep/5">Older articles</Link> : <span />}
            </nav>
          ) : null}
        </Container>
      </section>
      <CTASection
        title="Technology should be useful and understandable."
        text="Explore our practical coverage of AI tools and digital innovation, or send us a question or story idea."
        ctaLabel="Contact the editorial team"
      />
    </>
  );
}

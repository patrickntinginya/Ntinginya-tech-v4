import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { capabilities } from "@/content/solutions";
import { products } from "@/content/products";
import { kindMeta } from "@/content/entry-kinds";
import { searchEntries } from "@/lib/cms/entries";
import { searchPublishedPosts } from "@/lib/cms/public";
import { formatDate } from "@/lib/format";

// Search results are never indexed; the pages they link to are.
export const metadata: Metadata = {
  title: "Search",
  description: "Search Ntinginya Tech articles, products, solutions, Masterclass and R&D.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

type Hit = { key: string; title: string; text: string | null; href: string; kind: string; date?: string | null; status?: Parameters<typeof StatusBadge>[0]["status"] };

function matches(term: string, ...fields: Array<string | null | undefined>): boolean {
  const t = term.toLowerCase();
  return fields.some((f) => f && f.toLowerCase().includes(t));
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const sp = await searchParams;
  const q = ((Array.isArray(sp.q) ? sp.q[0] : sp.q) ?? "").replace(/\s+/g, " ").trim().slice(0, 80);

  let hits: Hit[] = [];
  if (q.length >= 2) {
    // Articles and structured content are searched in the database; only the matches are sent to the page.
    const [posts, entries] = await Promise.all([searchPublishedPosts(q, 10), searchEntries(q, 12)]);

    const builtIn: Hit[] = [
      ...products
        .filter((p) => matches(q, p.name, p.summary, p.category))
        .map((p): Hit => ({ key: `p-${p.slug}`, title: p.name, text: p.summary, href: `/products/${p.slug}`, kind: "Product", status: p.badges[0] })),
      ...capabilities
        .filter((c) => matches(q, c.title, c.text))
        .map((c): Hit => ({ key: `s-${c.id}`, title: c.title, text: c.text, href: `/solutions#${c.id}`, kind: "Solution" })),
    ];
    const entryHits = entries.map((e): Hit => ({
      key: `e-${e.id}`,
      title: e.title,
      text: e.summary,
      href: e.kind === "product" ? `/products/${e.slug}` : kindMeta[e.kind].publicPath,
      kind: kindMeta[e.kind].label,
      status: e.status,
    }));
    const postHits = posts.map((p): Hit => ({
      key: `a-${p.id}`,
      title: p.title,
      text: p.excerpt,
      href: `/news/${p.slug}`,
      kind: p.category?.name ?? "Article",
      date: p.published_at,
    }));
    const seen = new Set<string>();
    hits = [...postHits, ...entryHits, ...builtIn].filter((h) => (seen.has(h.href + h.title) ? false : (seen.add(h.href + h.title), true)));
  }

  return (
    <>
      <PageHero crumb="Search" title="Search Ntinginya Tech." description="Find articles, products, solutions, Masterclass and R&D." />
      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <form action="/search" method="get" role="search" className="flex max-w-xl gap-2">
            <label htmlFor="site-search" className="sr-only">
              Search the site
            </label>
            <input
              id="site-search"
              name="q"
              type="search"
              defaultValue={q}
              maxLength={80}
              placeholder="Search"
              className="min-h-12 w-full rounded-control border border-deep/30 bg-white px-3.5 font-sans text-base placeholder:text-deep/50 focus-visible:border-field-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-field-700"
            />
            <button type="submit" className="inline-flex min-h-12 items-center gap-2 rounded-control bg-deep px-5 font-sans text-[0.9375rem] font-semibold text-white hover:bg-deep-800">
              <Search aria-hidden="true" className="h-4 w-4" />
              Search
            </button>
          </form>

          <div className="mt-10" aria-live="polite">
            {q.length < 2 ? (
              <p className="text-deep/75">Type at least two letters to search.</p>
            ) : hits.length === 0 ? (
              <EmptyState title={`No results for "${q}".`}>
                <p>
                  Try a different word, or browse{" "}
                  <Link href="/news" className="font-semibold underline underline-offset-4">
                    News &amp; Insights
                  </Link>
                  .
                </p>
              </EmptyState>
            ) : (
              <>
                <p className="font-sans text-sm text-deep/75">
                  {hits.length} result{hits.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
                </p>
                <ul className="mt-4 divide-y divide-deep/10 border-y border-deep/10">
                  {hits.map((h) => (
                    <li key={h.key} className="py-5">
                      <p className="flex flex-wrap items-center gap-2 font-sans text-xs font-semibold text-deep/70">
                        {h.kind}
                        {h.status ? <StatusBadge status={h.status} /> : null}
                        {h.date ? <time dateTime={h.date}>{formatDate(h.date)}</time> : null}
                      </p>
                      <h2 className="mt-1 font-sans text-xl font-semibold leading-snug tracking-tight">
                        <Link href={h.href} className="underline-offset-4 hover:underline">
                          {h.title}
                        </Link>
                      </h2>
                      {h.text ? <p className="mt-1 max-w-2xl text-base leading-relaxed text-deep/80">{h.text}</p> : null}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

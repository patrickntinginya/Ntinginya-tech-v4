import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PostCard } from "@/components/news/PostCard";
import { CTASection } from "@/components/sections/CTASection";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { publicationTopics, siteConfig } from "@/config/site";
import { getFeaturedPosts, getPublicCategories, listPublishedPosts } from "@/lib/cms/public";

export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    getFeaturedPosts(3),
    listPublishedPosts({ page: 1, pageSize: 3 }),
    getPublicCategories(),
  ]);
  const topicArticles = await Promise.all(
    publicationTopics.map(async (topic) => {
      const category = categories.find((item) => item.slug === topic.slug);
      if (!category) return { topic, posts: [] };
      const result = await listPublishedPosts({ categoryId: category.id, page: 1, pageSize: 3 });
      return { topic, posts: result.posts };
    }),
  );

  return (
    <>
      <section className="relative overflow-hidden bg-mist">
        <Container className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.12em] text-field-800">
              Digital knowledge from Tanzania
            </p>
            <h1 className="mt-4 max-w-3xl font-sans text-4xl font-semibold leading-[1.04] tracking-[-0.035em] text-balance sm:text-6xl">
              Make sense of a changing digital world.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-deep/80 sm:text-xl">
              Ntinginya Tech publishes clear reporting, practical guides and considered perspectives on technology,
              business, finance and digital work—for readers in Tanzania, across Africa and beyond.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/news" variant="dark" size="lg">Explore the latest</ButtonLink>
              <ButtonLink href="#topics" variant="outline" size="lg">Browse topics</ButtonLink>
            </div>
            <p className="mt-6 font-sans text-sm text-deep/65">
              Practical context. Responsible advice. No promises of easy money.
            </p>
          </div>

          <div className="rounded-2xl border border-deep/10 bg-paper p-6 shadow-card sm:p-8">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.1em] text-field-800">
              Explore our coverage
            </p>
            <ul className="mt-3 divide-y divide-deep/10">
              {publicationTopics.slice(0, 4).map((topic) => (
                <li key={topic.slug}>
                  <Link href={topic.href} className="group flex min-h-14 items-center justify-between gap-4 py-3">
                    <span className="font-sans text-lg font-semibold">{topic.label}</span>
                    <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 text-field-800 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <Section tone="paper" id="topics">
        <SectionHeading
          title="Ideas you can put to work"
          description="Explore practical information across the tools, decisions and opportunities shaping everyday life and business."
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {publicationTopics.map((topic) => (
            <li key={topic.slug}>
              <Link
                href={topic.href}
                className="group flex h-full min-h-36 flex-col rounded-xl border border-deep/15 bg-white p-5 transition-colors hover:border-field-700"
              >
                <span className="font-sans text-lg font-semibold">{topic.label}</span>
                <span className="mt-2 text-sm leading-relaxed text-deep/75">{topic.description}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 font-sans text-sm font-semibold text-field-800">
                  Browse articles <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {featured.length ? (
        <Section tone="mist" id="editors-picks" spacing="tight">
          <SectionHeading
            title="Editor's picks"
            description="Articles selected by the Ntinginya Tech team. This is an editorial selection, not a ranking by traffic."
          />
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {featured.map((post) => (
              <li key={post.id} className="flex"><div className="w-full"><PostCard post={post} as="h3" /></div></li>
            ))}
          </ul>
        </Section>
      ) : null}

      {latest.posts.length ? (
        <Section tone={featured.length ? "paper" : "mist"} id="latest-articles" spacing="tight">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading title="Latest articles" description="New reporting and practical explainers from our publication." />
            <Link href="/news" className="inline-flex min-h-11 items-center gap-2 font-sans font-semibold underline underline-offset-4">
              All articles <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {latest.posts.map((post) => (
              <li key={post.id} className="flex"><div className="w-full"><PostCard post={post} as="h3" /></div></li>
            ))}
          </ul>
        </Section>
      ) : null}

      {topicArticles.map(({ topic, posts }) =>
        posts.length ? (
          <Section key={topic.slug} tone="paper" id={topic.slug} spacing="tight">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading title={topic.label} description={topic.description} />
              <Link href={topic.href} className="inline-flex min-h-11 items-center gap-2 font-sans font-semibold underline underline-offset-4">
                More in {topic.label} <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-8 grid gap-5 md:grid-cols-3">
              {posts.map((post) => (
                <li key={post.id} className="flex"><div className="w-full"><PostCard post={post} as="h3" /></div></li>
              ))}
            </ul>
          </Section>
        ) : null,
      )}

      <Section tone="deep" id="editorial-approach" spacing="tight">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.1em] text-maize-400">Our approach</p>
            <h2 className="mt-3 font-sans text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Useful information, handled with care.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/75">
              We aim to explain the facts, make sources clear and review AI-assisted drafts before publication. Articles
              about money and online work are informational—not guarantees or individual financial advice.
            </p>
          </div>
          <ButtonLink href="/editorial-standards" variant="maize" size="lg">Read our standards</ButtonLink>
        </div>
      </Section>

      <CTASection
        title="Have a question, idea or responsible partnership enquiry?"
        text="Get in touch with the Ntinginya Tech team about feedback, article suggestions or advertising and sponsorship enquiries."
        ctaLabel="Contact Ntinginya Tech"
      />
    </>
  );
}

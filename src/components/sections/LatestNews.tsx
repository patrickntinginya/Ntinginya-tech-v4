import Link from "next/link";
import { PostCard } from "@/components/news/PostCard";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFeaturedPosts, listPublishedPosts } from "@/lib/cms/public";

/**
 * Home-page news: the featured article first (if staff marked one), then the newest articles.
 * Hidden entirely until at least one article is published, so an empty database never leaves a hole.
 */
export async function LatestNews() {
  const [featured, latest] = await Promise.all([getFeaturedPosts(1), listPublishedPosts({ page: 1 })]);
  const lead = featured[0];
  const rest = latest.posts.filter((p) => p.id !== lead?.id);
  const posts = (lead ? [lead, ...rest] : rest).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <Section tone="mist" id="latest-news" spacing="tight">
      <SectionHeading
        title="Latest news and insights"
        description="Practical writing on technology, software, AI, agriculture and livestock innovation."
      />
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {posts.map((post, i) => (
          <li key={post.id} className="reveal flex">
            <div className="w-full">
              <PostCard post={post} as="h3" priority={false} />
              {i === 0 && lead ? <p className="mt-2 font-sans text-xs font-semibold text-field-800">Featured</p> : null}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <ButtonLink href="/news" variant="dark" size="lg">
          Read all articles
        </ButtonLink>
        <Link href="/search" className="font-sans font-semibold underline underline-offset-4">
          Search the site
        </Link>
      </div>
    </Section>
  );
}

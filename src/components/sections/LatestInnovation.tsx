import Link from "next/link";
import { InnovationCard } from "@/components/innovation/InnovationCard";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { listInnovationPosts } from "@/lib/cms/public";

/**
 * Home-page preview of the newest Innovation Hub articles from the CMS.
 * Renders nothing until at least one article is published, so the home page never shows an empty box.
 */
export async function LatestInnovation() {
  const { posts } = await listInnovationPosts({ page: 1, pageSize: 3 });
  if (posts.length === 0) return null;

  return (
    <Section tone="paper" id="latest-innovation" spacing="tight">
      <SectionHeading
        title="Latest from the Innovation Hub"
        description="Recent articles on agricultural and livestock technology from Tanzania and around the world."
      />
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {posts.map((post) => (
          <li key={post.id} className="reveal flex">
            <div className="w-full">
              <InnovationCard post={post} />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <ButtonLink href="/innovation" variant="dark" size="lg">
          Explore the Innovation Hub
        </ButtonLink>
        <Link href="/news" className="font-sans font-semibold underline underline-offset-4">
          All news and insights
        </Link>
      </div>
    </Section>
  );
}

import Link from "next/link";
import { ArrowRight, Beef, GraduationCap, Radio, Sprout, type LucideIcon } from "lucide-react";
import { PostCard } from "@/components/news/PostCard";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { listPublishedPosts } from "@/lib/cms/public";

const categories: Array<{ title: string; text: string; href: string; cta: string; icon: LucideIcon }> = [
  {
    title: "Farming",
    text: "Crop and farm management, and the technology that supports everyday farm decisions.",
    href: "/news?q=farming",
    cta: "Read about farming",
    icon: Sprout,
  },
  {
    title: "Livestock",
    text: "Herd records, animal health and productivity, and tools suited to livestock keepers.",
    href: "/news?q=livestock",
    cta: "Read about livestock",
    icon: Beef,
  },
  {
    title: "Agricultural Education",
    text: "Practical learning for farmers, officers and agribusiness professionals.",
    href: "/masterclass",
    cta: "See the Masterclass",
    icon: GraduationCap,
  },
  {
    title: "AgriTech",
    text: "Agricultural technology from Tanzania and around the world, studied for local fit.",
    href: "/innovation",
    cta: "Explore the Innovation Hub",
    icon: Radio,
  },
];

/**
 * The four agriculture categories, plus the newest articles from the existing "Agriculture & Livestock"
 * CMS category. Articles appear automatically when published; nothing is duplicated or hardcoded.
 */
export async function AgricultureCategories() {
  const { posts } = await listPublishedPosts({ categorySlug: "agriculture-livestock", page: 1 });
  const latest = posts.slice(0, 3);

  return (
    <Section tone="paper" id="agriculture-categories">
      <SectionHeading
        title="Explore agriculture by topic"
        description="Four ways into the subject, each connected to what we publish and what we are building."
      />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <li key={c.title} className="reveal flex">
              <Card as="article" interactive surface="white" className="flex w-full flex-col">
                <Icon aria-hidden="true" className="h-8 w-8 text-field-700" strokeWidth={1.5} />
                <h3 className="mt-4 font-sans text-xl font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-deep/80">{c.text}</p>
                <Link
                  href={c.href}
                  className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 font-sans text-[0.9375rem] font-semibold text-field-800 underline-offset-4 hover:underline after:absolute after:inset-0 after:rounded-card after:content-['']"
                >
                  {c.cta}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </Card>
            </li>
          );
        })}
      </ul>

      {latest.length > 0 ? (
        <div className="mt-16">
          <h3 className="font-sans text-2xl font-semibold tracking-tight">Latest agriculture and livestock articles</h3>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {latest.map((post) => (
              <li key={post.id} className="flex">
                <div className="w-full">
                  <PostCard post={post} as="h3" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Section>
  );
}

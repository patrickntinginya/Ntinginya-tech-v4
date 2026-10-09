import { InnovationFeed } from "@/components/innovation/InnovationFeed";
import { CTASection } from "@/components/sections/CTASection";
import { InnovationSection } from "@/components/sections/InnovationSection";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Global AgriTech Innovation Hub",
  description:
    "The Global AgriTech Innovation Hub is a future Ntinginya Tech platform to discover, analyze, test, adapt and deploy agricultural innovation for Tanzania.",
  path: "/innovation",
});

// Articles come from the CMS; refresh at most once a minute.
export const revalidate = 60;

type SP = { topic?: string | string[]; page?: string | string[] };
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function InnovationPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const topic = first(sp.topic).slice(0, 60);
  const page = Math.max(1, parseInt(first(sp.page), 10) || 1);

  return (
    <>
      <PageHero
        crumb="Innovation"
        title="Global AgriTech Innovation Hub"
        description="A future platform for studying how the world farms, and for testing what could work in Tanzania."
      >
        <StatusBadge status="future" />
      </PageHero>
      <Section tone="paper" id="articles" spacing="tight">
        <SectionHeading
          title="Innovation articles"
          description="Agricultural and livestock technology from Tanzania and around the world, published as we research it."
        />
        <div className="mt-10">
          <InnovationFeed topicSlug={topic || undefined} page={page} />
        </div>
      </Section>
      <InnovationSection full ctaHref="#countries" />
      <CTASection title="Interested in agricultural innovation?" text="Researchers, innovators and agribusinesses are welcome to get in touch." />
    </>
  );
}

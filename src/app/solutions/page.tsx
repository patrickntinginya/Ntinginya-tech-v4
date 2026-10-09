import { CoreAreasSection } from "@/components/sections/CoreAreasSection";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { SolutionsDetail } from "@/components/sections/SolutionsDetail";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Solutions",
  description:
    "Software, agriculture and livestock technology, AgriTech innovation, education and AI: the solutions Ntinginya Tech builds and is developing.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        crumb="Solutions"
        title="Solutions built around real problems."
        description="From business software to agriculture technology, everything we build starts with understanding the problem and the people facing it."
      />
      <CoreAreasSection />
      <SolutionsDetail />
      <CTASection />
    </>
  );
}

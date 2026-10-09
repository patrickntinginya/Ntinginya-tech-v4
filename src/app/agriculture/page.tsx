import { AgricultureCategories } from "@/components/sections/AgricultureCategories";
import { AgricultureSection } from "@/components/sections/AgricultureSection";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Agriculture & Livestock",
  description:
    "How Ntinginya Tech wants to connect farmers, livestock keepers, experts and researchers with practical agricultural technology in Tanzania.",
  path: "/agriculture",
});

export default function AgriculturePage() {
  return (
    <>
      <PageHero
        crumb="Agriculture"
        title="Agriculture and livestock, one of our biggest opportunities."
        description="Our long-term agricultural vision is ambitious. We are being clear that it is a vision, and that each step will be researched, tested and adapted to Tanzania."
      />
      <AgricultureCategories />
      <AgricultureSection />
      <CTASection title="Working in agriculture or livestock?" text="We would like to learn about the problems you face and the tools you wish existed." />
    </>
  );
}

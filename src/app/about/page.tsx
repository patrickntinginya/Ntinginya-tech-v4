import { AboutSection } from "@/components/sections/AboutSection";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { PurposeSection } from "@/components/sections/PurposeSection";
import { VisionSection } from "@/components/sections/VisionSection";
import { WhySection } from "@/components/sections/WhySection";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Ntinginya Tech is a Tanzanian technology and innovation company building software and applying research, education and technology to real-world problems.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="About"
        title="A technology company that starts with the problem."
        description="Ntinginya Tech combines technology, research, education, innovation and local understanding to build practical solutions."
      />
      <AboutSection full />
      <PurposeSection />
      <WhySection />
      <VisionSection />
      <CTASection />
    </>
  );
}

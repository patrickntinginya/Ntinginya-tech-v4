import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { AboutSection } from "@/components/sections/AboutSection";
import { AgricultureSection } from "@/components/sections/AgricultureSection";
import { CoreAreasSection } from "@/components/sections/CoreAreasSection";
import { CTASection } from "@/components/sections/CTASection";
import { Hero } from "@/components/sections/Hero";
import { HomeHighlights } from "@/components/sections/HomeHighlights";
import { InnovationSection } from "@/components/sections/InnovationSection";
import { LatestInnovation } from "@/components/sections/LatestInnovation";
import { LatestNews } from "@/components/sections/LatestNews";
import { MasterclassSection } from "@/components/sections/MasterclassSection";
import { NetworkCTA } from "@/components/sections/NetworkCTA";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { PurposeSection } from "@/components/sections/PurposeSection";
import { ResearchSection } from "@/components/sections/ResearchSection";
import { VisionSection } from "@/components/sections/VisionSection";
import { WhySection } from "@/components/sections/WhySection";

export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <PurposeSection />
      <CoreAreasSection />
      <ProductsSection />
      <AgricultureSection />
      <InnovationSection />
      <LatestInnovation />
      <HomeHighlights />
      <LatestNews />
      <MasterclassSection />
      <ResearchSection />
      <NetworkCTA />
      <WhySection />
      <VisionSection />
      <AboutSection />
      <CTASection />
    </>
  );
}

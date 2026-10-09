import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { ResearchPrograms } from "@/components/sections/ResearchPrograms";
import { ResearchSection } from "@/components/sections/ResearchSection";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Research & Development",
  description:
    "Ntinginya Tech researches problems before building technology: identify, research, validate, design, build, pilot, measure, improve and scale.",
  path: "/r-and-d",
});

export default function ResearchPage() {
  return (
    <>
      <PageHero
        crumb="R&D"
        title="Research and development that keeps us honest."
        description="We understand a problem before we build for it, and we measure what happened afterwards."
      />
      <ResearchSection full />
      <ResearchPrograms />
      <CTASection title="Want to collaborate on research?" text="We welcome conversations with researchers, institutions and practitioners." />
    </>
  );
}

import { engagementSteps } from "@/content/solutions";
import { SolutionCards } from "./SolutionCards";
import { ButtonLink } from "@/components/ui/Button";
import { ProcessRail } from "@/components/ui/ProcessRail";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SolutionsDetail() {
  return (
    <>
      <Section tone="paper" id="software">
        <SectionHeading
          title="Software and digital solutions"
          description="The technology side of Ntinginya Tech. These are the kinds of solutions we build with businesses and organizations."
        />
        <div className="mt-14">
          <SolutionCards />
        </div>
      </Section>

      <Section tone="mist" id="work-with-us">
        <SectionHeading
          title="How to work with Ntinginya Tech"
          description="Bring us a problem, not just a feature list. We will help work out what is worth building."
        />
        <ProcessRail steps={engagementSteps} className="mt-14" />
        <div className="mt-12">
          <ButtonLink href="/contact?subject=Work%20with%20Ntinginya%20Tech" variant="dark" size="lg">
            Work With Us
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}

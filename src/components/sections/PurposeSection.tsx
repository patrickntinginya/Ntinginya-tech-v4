import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessRail } from "@/components/ui/ProcessRail";

const steps = [
  { label: "Problem", note: "Start with a real problem." },
  { label: "Research", note: "Understand it deeply." },
  { label: "Design", note: "Shape a practical solution." },
  { label: "Build", note: "Create a first version." },
  { label: "Test", note: "Try it in real conditions." },
  { label: "Improve", note: "Learn and refine." },
  { label: "Scale", note: "Grow beyond the first users." },
];

export function PurposeSection() {
  return (
    <Section tone="paper" id="purpose">
      <SectionHeading
        title="Technology With Purpose"
        description={
          <>
            <p>
              Ntinginya Tech does not build technology simply because technology exists. Every solution starts with a
              real problem and is shaped through research, design, testing and improvement before it is scaled.
            </p>
            <p className="mt-4">
              We focus on practical solutions that can work in real environments, not on tools that only look good in a
              demo.
            </p>
          </>
        }
      />
      <ProcessRail steps={steps} highlightLast className="mt-14 lg:mt-16" />
    </Section>
  );
}

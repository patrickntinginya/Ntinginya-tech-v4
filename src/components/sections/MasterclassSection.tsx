import { masterclassAudience, masterclassLevels } from "@/content/masterclass";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";

// The levels rise from left to right on large screens, like steps.
const stepOffsets = ["lg:mt-20", "lg:mt-10", "lg:mt-0"];

export function MasterclassSection() {
  return (
    <Section tone="paper" id="masterclass">
      <SectionHeading
        title="Learn. Innovate. Apply."
        description={
          <>
            <p>
              <strong>Masterclass ya Kilimo na Ufugaji</strong> (the Agriculture &amp; Livestock Masterclass) is a future
              professional learning platform for people who work with farms, livestock and agricultural technology.
            </p>
            <div className="mt-4">
              <StatusBadge status="future" />
            </div>
          </>
        }
      />

      <ol className="mt-14 grid gap-4 lg:grid-cols-3 lg:items-start lg:gap-5">
        {masterclassLevels.map((level, i) => (
          <li
            key={level.name}
            className={cn(
              "rounded-2xl border border-dashed border-deep/40 p-6 sm:p-8",
              i === masterclassLevels.length - 1 ? "bg-maize-300 lg:min-h-64" : i === 1 ? "bg-sage lg:min-h-56" : "bg-mist lg:min-h-48",
              stepOffsets[i],
            )}
          >
            <p className="font-sans text-sm font-medium text-deep/70">Level {i + 1}</p>
            <h3 className="mt-2 font-sans text-2xl font-semibold tracking-tight">{level.name}</h3>
            <p className="mt-3 text-base leading-relaxed text-deep/85">{level.text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-16 grid gap-8 lg:grid-cols-12">
        <h3 className="font-sans text-2xl font-semibold tracking-tight lg:col-span-4">Who it is for</h3>
        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:col-span-8">
          {masterclassAudience.map((a) => (
            <li key={a} className="border-t border-deep/15 pt-3 font-sans text-base font-medium">
              {a}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
        <ButtonLink href="/contact?subject=Ntinginya%20Masterclass" variant="dark" size="lg">
          Register your interest
        </ButtonLink>
        <p className="text-sm text-deep/75">Enrolment is not open yet. Tell us you are interested and we will be in touch.</p>
      </div>
    </Section>
  );
}

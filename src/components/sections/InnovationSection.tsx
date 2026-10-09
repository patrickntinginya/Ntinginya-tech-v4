import { countries, hubShowcase } from "@/content/countries";
import { evaluationQuestions } from "@/content/research";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessRail } from "@/components/ui/ProcessRail";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";

const approach = [
  { label: "Discover", note: "Find innovations worldwide." },
  { label: "Analyze", note: "Study how they work and what they need." },
  { label: "Test", note: "Try them at small scale in Tanzania." },
  { label: "Adapt", note: "Change them to fit local conditions." },
  { label: "Deploy", note: "Roll out only what has proved useful." },
];

export function InnovationSection({ full = false, ctaHref = "/innovation" }: { full?: boolean; ctaHref?: string }) {
  return (
    <Section tone="mist" id="innovation">
      <SectionHeading
        title="Discover How the World Is Farming."
        description={
          <>
            <p>
              Ntinginya Tech wants to study agricultural innovations from around the world and explore how suitable
              technologies can be tested and adapted to local conditions.
            </p>
            <div className="mt-4">
              <StatusBadge status="future" />
            </div>
          </>
        }
      />

      <div className="mt-12">
        <h3 className="font-sans text-lg font-semibold tracking-tight">What the AgriTech Innovation Hub will showcase</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {hubShowcase.map((item) => (
            <li key={item} className="rounded-md border border-deep/20 bg-paper px-3 py-1.5 font-sans text-sm font-medium">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div id="countries" className="mt-12 scroll-mt-24">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-deep/20 bg-deep/20 lg:grid-cols-5">
          {countries.map((c) => (
            <li key={c.name} className={cn("flex flex-col p-5", c.home ? "bg-maize-300" : "bg-paper")}>
              <p className="font-sans text-xs font-medium text-deep/70">{c.region}</p>
              <h3 className="mt-1 font-sans text-xl font-semibold leading-tight tracking-tight">{c.name}</h3>
              <ul className="mt-4 space-y-1.5 text-[0.9375rem] leading-snug text-deep/80">
                {c.themes.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-deep/75">
          Themes are starting points for research, not conclusions. Nothing here means a technology will work in
          Tanzania. We will study more African countries as the research grows.
        </p>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h3 className="font-sans text-2xl font-semibold tracking-tight">We do not copy and paste technology</h3>
          <p className="mt-3 text-base leading-relaxed text-deep/80">
            A technology that works in one country will not automatically work in another. Every idea moves through the
            same five steps before it reaches a farmer.
          </p>
        </div>
        <div className="lg:col-span-8">
          <ProcessRail steps={approach} highlightLast />
        </div>
      </div>

      {full ? (
        <div className="mt-16 rounded-2xl bg-paper p-6 sm:p-10">
          <h3 className="font-sans text-2xl font-semibold tracking-tight">What we will ask of every technology</h3>
          <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {evaluationQuestions.map((q) => (
              <li key={q} className="border-t border-deep/15 pt-4 text-base leading-relaxed">
                {q}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-12">
        <ButtonLink href={ctaHref} variant="dark" size="lg">
          Explore Global Innovation
        </ButtonLink>
      </div>
    </Section>
  );
}

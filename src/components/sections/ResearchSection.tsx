import { researchFocus, researchSteps } from "@/content/research";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ResearchSection({ full = false }: { full?: boolean }) {
  return (
    <Section tone="deep" id="research">
      <SectionHeading
        dark
        title="Research Before We Build."
        description="Ntinginya Tech wants to understand problems deeply before building technology. That means asking questions, testing assumptions and learning from the people who face the problem every day."
      />

      <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/20 bg-white/20 sm:grid-cols-2 lg:grid-cols-3">
        {researchSteps.map((step, i) => (
          <li key={step.title} className="bg-deep p-6 sm:p-7">
            <span className="font-sans text-4xl font-semibold leading-none text-maize-400">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-5 font-sans text-xl font-semibold tracking-tight">{step.title}</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/80">{step.text}</p>
          </li>
        ))}
      </ol>

      {full ? (
        <div className="mt-16 grid gap-8 lg:grid-cols-12">
          <h3 className="font-sans text-2xl font-semibold tracking-tight lg:col-span-4">What we want to understand</h3>
          <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:col-span-8">
            {researchFocus.map((item) => (
              <li key={item} className="border-t border-white/20 pt-4 leading-relaxed text-white/90">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Section>
  );
}

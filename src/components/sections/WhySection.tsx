import { principles } from "@/content/principles";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function WhySection() {
  return (
    <Section tone="paper" id="why">
      <SectionHeading title="Why Ntinginya Tech" description="Four principles guide what we choose to build and how we build it." />
      <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {principles.map((p) => {
          const Icon = p.icon;
          return (
            <li key={p.title} className="border-t-2 border-deep pt-6">
              <Icon aria-hidden="true" className="h-7 w-7 text-field-700" strokeWidth={1.6} />
              <h3 className="mt-5 font-sans text-xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-deep/80">{p.text}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

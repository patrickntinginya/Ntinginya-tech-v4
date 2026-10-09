import Link from "next/link";
import { agriAreas, agriInitiatives, agriJourney } from "@/content/agriculture";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessRail } from "@/components/ui/ProcessRail";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function AgricultureSection() {
  return (
    <Section tone="field" id="agriculture">
      <SectionHeading
        dark
        title="Bringing Modern Technology Closer to Agriculture."
        description="Ntinginya Tech wants to help connect farmers, livestock keepers, experts, researchers and technology with practical agricultural solutions. This is a long-term vision, and we are at the start of it."
      />

      <ul className="mt-14 grid gap-x-10 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
        {agriAreas.map((area) => {
          const Icon = area.icon;
          return (
            <li key={area.title} className="flex gap-4 border-t border-white/20 py-6">
              <Icon aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-maize-400" strokeWidth={1.6} />
              <div>
                <h3 className="font-sans text-lg font-semibold leading-snug">{area.title}</h3>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-white/80">{area.text}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-16 rounded-2xl border border-white/20 p-6 sm:p-10">
        <h3 className="font-sans text-2xl font-semibold tracking-tight">From global idea to local farm</h3>
        <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-white/80">
          Good ideas travel best when they are tested and adapted along the way. This is the path we want every
          agricultural innovation to follow.
        </p>
        <ProcessRail steps={agriJourney} dark highlightLast className="mt-10" />
      </div>

      <div className="mt-16">
        <h3 className="font-sans text-2xl font-semibold tracking-tight">Agriculture &amp; Livestock Technology initiatives</h3>
        <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-white/80">
          None of these is operating yet. Each one is labelled with where it stands today.
        </p>
        <ul className="mt-8 grid gap-4 lg:grid-cols-3">
          {agriInitiatives.map((item) => (
            <li key={item.title} className="flex flex-col rounded-2xl border border-dashed border-white/30 p-6">
              <StatusBadge status={item.status} tone="dark" className="self-start" />
              <h4 className="mt-4 font-sans text-xl font-semibold leading-snug tracking-tight">{item.title}</h4>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/80">{item.text}</p>
              {item.audience ? (
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  <span className="font-sans font-semibold text-white/90">For: </span>
                  {item.audience}
                </p>
              ) : null}
              {item.href ? (
                <Link href={item.href} className="mt-auto pt-5 font-sans text-sm font-semibold text-maize-300 underline-offset-4 hover:underline">
                  Learn more
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

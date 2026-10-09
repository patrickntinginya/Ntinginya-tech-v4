import Link from "next/link";
import { coreAreas, type CoreArea } from "@/content/core-areas";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";

type CardTone = "deep" | "field" | "sand" | "paper" | "maize" | "deep-alt";

// Each card gets its own surface and footprint so the grid reads as six different things.
const layout: Record<string, { tone: CardTone; span: string }> = {
  "01": { tone: "deep", span: "md:col-span-2" },
  "02": { tone: "field", span: "" },
  "03": { tone: "sand", span: "lg:col-span-2" },
  "04": { tone: "paper", span: "" },
  "05": { tone: "maize", span: "" },
  "06": { tone: "deep-alt", span: "md:col-span-2" },
};

const toneClasses: Record<CardTone, { card: string; muted: string; chip: string; dark: boolean }> = {
  deep: { card: "bg-deep text-white", muted: "text-white/80", chip: "border-white/25 text-white/90", dark: true },
  "deep-alt": { card: "bg-deep-800 text-white", muted: "text-white/80", chip: "border-white/25 text-white/90", dark: true },
  field: { card: "bg-field-700 text-white", muted: "text-white/85", chip: "border-white/30 text-white", dark: true },
  sand: { card: "bg-sage text-deep", muted: "text-deep/80", chip: "border-deep/25 text-deep", dark: false },
  paper: { card: "bg-paper text-deep border border-deep/15", muted: "text-deep/75", chip: "border-deep/25 text-deep", dark: false },
  maize: { card: "bg-maize-400 text-deep", muted: "text-deep/85", chip: "border-deep/30 text-deep", dark: false },
};

function CoreAreaCard({ area, tone }: { area: CoreArea; tone: CardTone }) {
  const t = toneClasses[tone];
  const Icon = area.icon;
  return (
    <article className={cn("relative flex h-full flex-col rounded-2xl p-6 sm:p-8", t.card)}>
      <div className="flex items-start justify-between gap-4">
        <span className="font-sans text-4xl font-semibold leading-none tracking-tight opacity-60 sm:text-5xl">{area.id}</span>
        <Icon aria-hidden="true" className="h-8 w-8 shrink-0" strokeWidth={1.5} />
      </div>

      <h3 className="mt-8 font-sans text-2xl font-semibold leading-tight tracking-[-0.015em] text-balance">{area.title}</h3>
      <p className={cn("mt-3 text-base leading-relaxed", t.muted)}>{area.summary}</p>

      {area.chips ? (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${area.title}: examples`}>
          {area.chips.map((chip) => (
            <li key={chip} className={cn("rounded-md border px-2.5 py-1 font-sans text-[0.8125rem] font-medium leading-snug", t.chip)}>
              {chip}
            </li>
          ))}
        </ul>
      ) : null}

      {area.note ? <p className={cn("mt-5 text-[0.9375rem] leading-relaxed", t.muted)}>{area.note}</p> : null}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-8">
        {area.status ? <StatusBadge status={area.status} tone={t.dark ? "dark" : "light"} /> : <span />}
        {/* The ::after makes the whole card clickable while keeping a single, accessible link. */}
        <Link
          href={area.href}
          className="font-sans text-[0.9375rem] font-semibold underline decoration-1 underline-offset-4 after:absolute after:inset-0 after:rounded-2xl after:content-['']"
        >
          Learn more<span className="sr-only"> about {area.title}</span>
        </Link>
      </div>
    </article>
  );
}

export function CoreAreasSection() {
  return (
    <Section tone="mist" id="core-areas">
      <SectionHeading
        title="Our Core Areas"
        description="Six areas, one approach: understand the problem first, then build what works. Areas marked proposed or future do not exist yet."
      />
      <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {coreAreas.map((area) => {
          const config = layout[area.id];
          return (
            <li key={area.id} className={cn("min-w-0", config.span)}>
              <CoreAreaCard area={area} tone={config.tone} />
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

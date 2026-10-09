import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "./PageHero";

export type LegalSection = { heading: string; body: ReactNode };

export function LegalPage({
  title,
  crumb,
  intro,
  updated = "30 September 2026",
  sections,
}: {
  title: string;
  crumb: string;
  intro: string;
  updated?: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero title={title} crumb={crumb} description={intro} />
      <section className="bg-paper py-16 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="font-sans text-sm text-deep/70">Last updated: {updated}</p>
            <div className="mt-8 space-y-10">
              {sections.map((s) => (
                <section key={s.heading}>
                  <h2 className="font-sans text-2xl font-semibold tracking-tight">{s.heading}</h2>
                  <div className="mt-3 space-y-3 text-base leading-relaxed text-deep/85">{s.body}</div>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

import Link from "next/link";
import { futureTechnologies, researchFocus } from "@/content/research";
import { products } from "@/content/products";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge, StatusBadges } from "@/components/ui/StatusBadge";
import { listEntries, type PublicEntry } from "@/lib/cms/entries";

/**
 * Research areas, experiments, innovation projects, publications and future technologies.
 * Experiments and publications are empty on purpose until real ones exist.
 */
function EntryList({ items }: { items: PublicEntry[] }) {
  return (
    <ul className="space-y-4">
      {items.map((e) => (
        <li key={e.id}>
          <Card as="article" surface="white">
            <StatusBadge status={e.status} />
            <h3 className="mt-3 font-sans text-xl font-semibold leading-tight tracking-tight">{e.title}</h3>
            {e.summary ? <p className="mt-2 text-[0.9375rem] leading-relaxed text-deep/80">{e.summary}</p> : null}
            {e.cta_url ? (
              <Link href={e.cta_url} className="mt-3 inline-flex min-h-11 items-center font-sans text-[0.9375rem] font-semibold text-field-800 underline underline-offset-4">
                {e.cta_label || "Read more"}
                <span className="sr-only">: {e.title}</span>
              </Link>
            ) : null}
          </Card>
        </li>
      ))}
    </ul>
  );
}

export async function ResearchPrograms() {
  // Items staff have published in /admin/content (kind: R&D item), grouped by their type.
  const items = await listEntries("research", 60);
  const experiments = items.filter((e) => e.category === "Experiment");
  const publications = items.filter((e) => e.category === "Publication");
  const projects = items.filter((e) => e.category === "Research project" || e.category === "Innovation project");
  return (
    <>
      <Section tone="paper" id="research-areas">
        <SectionHeading
          title="Research areas"
          description="The questions we are studying right now. They are starting points for research, not findings."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {researchFocus.map((area) => (
            <li key={area} className="reveal flex">
              <Card as="article" surface="white" className="w-full">
                <p className="font-sans text-lg font-semibold leading-snug tracking-tight">{area}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="mist" id="experiments">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-sans text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">Experiments</h2>
            <div className="mt-6">
              {experiments.length > 0 ? (
                <EntryList items={experiments} />
              ) : (
                <EmptyState title="No experiments have been published yet.">
                  <p>We will publish pilots and what we learned from them, including what did not work.</p>
                </EmptyState>
              )}
            </div>
          </div>
          <div id="publications">
            <h2 className="font-sans text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">Publications</h2>
            <div className="mt-6">
              {publications.length > 0 ? (
                <EntryList items={publications} />
              ) : (
                <EmptyState title="No publications yet.">
                  <p>
                    Research notes will be shared in{" "}
                    <Link href="/news" className="font-semibold underline underline-offset-4">
                      News &amp; Insights
                    </Link>{" "}
                    as they are written.
                  </p>
                </EmptyState>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper" id="innovation-projects">
        <SectionHeading
          title="Innovation projects"
          description="What we are building or planning, and how far along each one is."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {products.map((p) => (
            <li key={p.slug} className="reveal flex">
              <Card as="article" interactive surface="white" className="flex w-full flex-col">
                <StatusBadges statuses={p.badges} />
                <h3 className="mt-3 font-sans text-xl font-semibold leading-tight tracking-tight">
                  <Link href={`/products/${p.slug}`} className="underline-offset-4 hover:underline after:absolute after:inset-0 after:content-['']">
                    {p.name}
                  </Link>
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-deep/80">{p.summary}</p>
              </Card>
            </li>
          ))}
        </ul>
        {projects.length > 0 ? (
          <div className="mt-8">
            <EntryList items={projects} />
          </div>
        ) : null}
      </Section>

      <Section tone="deep" id="future-technologies">
        <SectionHeading dark title="Future technologies" description="Areas we want to understand before we build with them." />
        <ul className="mt-12 grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {futureTechnologies.map((t) => (
            <li key={t} className="border-t border-white/20 pt-4 leading-relaxed text-white/90">
              {t}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

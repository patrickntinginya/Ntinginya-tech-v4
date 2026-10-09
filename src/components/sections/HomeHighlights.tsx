import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { listEntries, type PublicEntry } from "@/lib/cms/entries";
import { formatDate } from "@/lib/format";

function Highlight({ heading, entry, href }: { heading: string; entry: PublicEntry; href: string }) {
  return (
    <li className="reveal flex">
      <Card as="article" interactive surface="white" className="flex w-full flex-col">
        <p className="font-sans text-sm font-medium text-deep/70">{heading}</p>
        <div className="mt-2">
          <StatusBadge status={entry.status} />
        </div>
        <h3 className="mt-3 font-sans text-xl font-semibold leading-tight tracking-tight">
          <Link href={href} className="underline-offset-4 hover:underline after:absolute after:inset-0 after:content-['']">
            {entry.title}
          </Link>
        </h3>
        {entry.event_at ? <p className="mt-1 font-sans text-sm text-deep/70">{formatDate(entry.event_at)}</p> : null}
        {entry.summary ? <p className="mt-2 text-base leading-relaxed text-deep/80 line-clamp-4">{entry.summary}</p> : null}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 font-sans text-sm font-semibold text-field-800">
          Learn more
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </span>
      </Card>
    </li>
  );
}

/**
 * Home highlights pulled from the database: a featured product, the next Masterclass session and a
 * featured R&D item. Each card appears only when staff have published something to show.
 */
export async function HomeHighlights() {
  const [products, sessions, research] = await Promise.all([
    listEntries("product", 1, true),
    listEntries("masterclass", 5),
    listEntries("research", 1, true),
  ]);
  const upcoming = sessions.find((s) => !s.event_at || new Date(s.event_at).getTime() > Date.now()) ?? null;
  const product = products[0];
  const study = research[0];
  if (!product && !upcoming && !study) return null;

  return (
    <Section tone="paper" id="highlights" spacing="tight">
      <SectionHeading title="Highlights" description="What we are working on, as published by the Ntinginya Tech team." />
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {product ? <Highlight heading="Featured product" entry={product} href={`/products/${product.slug}`} /> : null}
        {upcoming ? <Highlight heading="Masterclass" entry={upcoming} href="/masterclass" /> : null}
        {study ? <Highlight heading="Research and development" entry={study} href="/r-and-d" /> : null}
      </ul>
    </Section>
  );
}

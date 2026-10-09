import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";
import { capabilities } from "@/content/solutions";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { listEntries } from "@/lib/cms/entries";

/** Reusable solution cards: icon, title, description, call to action and a hover lift. Data lives in content/solutions.ts. */
export async function SolutionCards() {
  // Solutions staff have published in /admin/content appear after the built-in ones.
  const extra = await listEntries("solution", 24);
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {capabilities.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.id} id={item.id} className="reveal flex scroll-mt-24">
            <Card as="article" interactive surface="white" className="flex w-full flex-col">
              <span className="grid h-12 w-12 place-items-center rounded-control bg-deep text-white">
                <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.6} />
              </span>
              <h3 className="mt-5 font-sans text-xl font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-deep/80">{item.text}</p>
              <Link
                href={`/contact?subject=${encodeURIComponent(item.subject)}`}
                className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-5 font-sans text-[0.9375rem] font-semibold text-field-800 underline-offset-4 hover:underline after:absolute after:inset-0 after:rounded-card after:content-['']"
              >
                Discuss this solution<span className="sr-only">: {item.title}</span>
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          </li>
        );
      })}
      {extra.map((e) => (
        <li key={e.id} id={e.slug} className="reveal flex scroll-mt-24">
          <Card as="article" interactive surface="white" className="flex w-full flex-col">
            <span className="grid h-12 w-12 place-items-center rounded-control bg-deep text-white">
              <Lightbulb aria-hidden="true" className="h-6 w-6" strokeWidth={1.6} />
            </span>
            <h3 className="mt-5 font-sans text-xl font-semibold tracking-tight">{e.title}</h3>
            <div className="mt-2">
              <StatusBadge status={e.status} />
            </div>
            {e.summary ? <p className="mt-3 text-base leading-relaxed text-deep/80">{e.summary}</p> : null}
            <Link
              href={e.cta_url || `/contact?subject=${encodeURIComponent(e.title)}`}
              className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-5 font-sans text-[0.9375rem] font-semibold text-field-800 underline-offset-4 hover:underline after:absolute after:inset-0 after:rounded-card after:content-['']"
            >
              {e.cta_label || "Discuss this solution"}
              <span className="sr-only">: {e.title}</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </Card>
        </li>
      ))}
    </ul>
  );
}

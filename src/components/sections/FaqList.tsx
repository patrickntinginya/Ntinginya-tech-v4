import { ChevronDown } from "lucide-react";

/** Accessible FAQ using native <details>, so it needs no JavaScript and works with the keyboard. */
export function FaqList({ items }: { items: ReadonlyArray<{ q: string; a: string }> }) {
  return (
    <div className="divide-y divide-deep/15 border-y border-deep/15">
      {items.map((item) => (
        <details key={item.q} className="faq group">
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-4 font-sans text-lg font-semibold">
            {item.q}
            <ChevronDown aria-hidden="true" className="faq-chevron h-5 w-5 shrink-0 transition-transform duration-base" />
          </summary>
          <p className="pb-5 pr-9 text-base leading-relaxed text-deep/80">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

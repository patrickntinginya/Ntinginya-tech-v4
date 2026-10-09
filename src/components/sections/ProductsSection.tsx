import type { ReactNode } from "react";
import { products as builtInProducts } from "@/content/products";
import { getAllProducts } from "@/lib/cms/entries";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProductCard } from "./ProductCard";

function Group({ title, blurb, children, id }: { title: ReactNode; blurb: string; children: ReactNode; id: string }) {
  return (
    <section aria-labelledby={id} className="mt-14 first:mt-0">
      <div className="mb-6 max-w-2xl">
        <h3 id={id} className="font-sans text-xl font-semibold tracking-tight">
          {title}
        </h3>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-deep/75">{blurb}</p>
      </div>
      {children}
    </section>
  );
}

export async function ProductsSection({ withHeading = true }: { withHeading?: boolean }) {
  // Built-in products plus anything staff have published in /admin/content.
  const products = await getAllProducts(builtInProducts);
  const mvp = products.filter((p) => p.group === "mvp");
  const future = products.filter((p) => p.group === "future");
  const live = products.filter((p) => p.group === "live");

  return (
    <Section tone="paper" id="products">
      {withHeading ? (
        <SectionHeading
          className="mb-14"
          title="Products and platforms"
          description="What is available, what we are building now and what is still an idea. Each product is labelled honestly, and nothing is presented as launched unless it is."
        />
      ) : null}

      <Group id="group-live" title={<span className="inline-flex items-center gap-3"><StatusBadge status="live" /> Available now</span>} blurb="Products that people can use today.">
        {live.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {live.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-deep/30 p-6 sm:p-8">
            <p className="font-sans text-lg font-semibold">No products are live yet.</p>
            <p className="mt-1 max-w-xl text-[0.9375rem] leading-relaxed text-deep/75">
              Ntinginya Tech is at an early stage. Products will appear here once they launch. Until then, you can
              follow what we are building below or get in touch to hear about launches.
            </p>
          </div>
        )}
      </Group>

      <Group
        id="group-mvp"
        title={<span className="inline-flex flex-wrap items-center gap-2"><StatusBadge status="mvp" /> <StatusBadge status="in-development" /> <span className="ml-1">Being built now</span></span>}
        blurb="Early versions being built and tested. Not publicly available yet."
      >
        <div className="grid gap-5">
          {mvp.map((p) => (
            <ProductCard key={p.slug} product={p} featured />
          ))}
        </div>
      </Group>

      <Group
        id="group-future"
        title={<span className="inline-flex flex-wrap items-center gap-2"><StatusBadge status="future" /> <StatusBadge status="proposed" /> <span className="ml-1">Future products</span></span>}
        blurb="Ideas we intend to explore. They have not launched, and plans may change as we learn."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {future.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Group>
    </Section>
  );
}

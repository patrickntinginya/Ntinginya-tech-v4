import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { StatusBadges } from "@/components/ui/StatusBadge";
import { PageHero } from "@/components/sections/PageHero";
import { getProduct, products } from "@/content/products";
import { entryToProduct, getAllProducts, getEntry } from "@/lib/cms/entries";
import { buildMetadata } from "@/lib/metadata";

type Params = { slug: string };
type Props = { params: Promise<Params> };

export function generateStaticParams(): Params[] {
  return products.map((p) => ({ slug: p.slug }));
}

/** A published database product wins over a built-in one with the same slug. */
async function findProduct(slug: string) {
  const entry = await getEntry("product", slug);
  if (entry) return { product: entry ? entryToProduct(entry) : undefined, entry };
  return { product: getProduct(slug), entry: null };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { product, entry } = await findProduct(slug);
  if (!product) return { title: "Product not found", robots: { index: false, follow: false } };
  return buildMetadata({
    title: entry?.seo_title || product.name,
    description: entry?.seo_description || product.summary || `${product.name} by Ntinginya Tech.`,
    path: `/products/${product.slug}`,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const { product, entry } = await findProduct(slug);
  if (!product) notFound();

  const others = (await getAllProducts(products)).filter((p) => p.slug !== product.slug);

  return (
    <>
      <PageHero crumb="Products" title={product.name} description={product.summary}>
        <p className="font-sans text-sm text-deep/75">{product.category}</p>
        <StatusBadges statuses={product.badges} className="mt-3" />
      </PageHero>

      <section className="bg-paper py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-7">
            {product.problem ? (
              <div>
                <h2 className="font-sans text-2xl font-semibold tracking-tight">{entry ? "About" : "Problem it solves"}</h2>
                <p className="mt-3 whitespace-pre-line text-lg leading-relaxed text-deep/85">{product.problem}</p>
              </div>
            ) : null}
            {product.users.length > 0 ? (
            <div>
              <h2 className="font-sans text-2xl font-semibold tracking-tight">Who it is for</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {product.users.map((u) => (
                  <li key={u} className="rounded-md border border-deep/25 px-3 py-1.5 font-sans text-sm font-medium">
                    {u}
                  </li>
                ))}
              </ul>
            </div>
            ) : null}
            {product.scope.length > 0 ? (
            <div>
              <h2 className="font-sans text-2xl font-semibold tracking-tight">
                {product.group === "mvp" ? "What it covers" : product.group === "live" ? "What it includes" : "Areas we want to explore"}
              </h2>
              <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {product.scope.map((s) => (
                  <li key={s} className="border-t border-deep/15 pt-3 font-sans text-base font-medium">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            ) : null}
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-dashed border-deep/40 p-6 sm:p-8">
              <h2 className="font-sans text-xl font-semibold tracking-tight">Status</h2>
              <p className="mt-3 text-base leading-relaxed text-deep/85">{product.statusNote}</p>
              <ButtonLink
                href={`/contact?subject=${encodeURIComponent(product.interestSubject)}`}
                variant="dark"
                className="mt-6 w-full sm:w-auto"
              >
                {entry?.cta_label && !entry.cta_url ? entry.cta_label : product.group === "mvp" ? "Ask about this product" : "Register your interest"}
              </ButtonLink>
              {entry?.cta_url ? (
                <ButtonLink href={entry.cta_url} variant="outline" className="mt-3 w-full sm:ml-3 sm:mt-6 sm:w-auto">
                  {entry.cta_label || "Learn more"}
                </ButtonLink>
              ) : null}
            </div>
          </aside>
        </Container>
      </section>

      <section className="bg-mist py-16">
        <Container>
          <h2 className="font-sans text-2xl font-semibold tracking-tight">Other products</h2>
          <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {others.map((p) => (
              <li key={p.slug} className="border-t border-deep/20 pt-3">
                <Link href={`/products/${p.slug}`} className="font-sans text-lg font-semibold underline-offset-4 hover:underline">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}

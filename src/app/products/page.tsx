import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Products",
  description:
    "Ntinginya Tech products: Business Manager (MVP in development) and future platforms for agriculture, innovation, education and farmer support.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <>
      <PageHero
        crumb="Products"
        title="What we are building, and how far along it is."
        description="Every product is labelled as live, MVP, in development, proposed or future, so you always know what exists today."
      />
      <ProductsSection withHeading={false} />
      <CTASection title="Want to hear when something launches?" text="Tell us which product interests you and we will keep you informed." />
    </>
  );
}

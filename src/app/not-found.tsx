import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="bg-mist py-28">
      <Container>
        <p className="font-sans text-sm font-semibold text-field-700">Error 404</p>
        <h1 className="mt-3 max-w-2xl font-sans text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">
          This page could not be found.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-deep/80">
          The link may be broken or the page may have moved. Head back home or browse our products.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" variant="dark" size="lg">
            Go to the homepage
          </ButtonLink>
          <ButtonLink href="/products" variant="outline" size="lg">
            See our products
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

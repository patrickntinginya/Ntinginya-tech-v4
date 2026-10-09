"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="bg-mist py-28">
      <Container>
        <h1 className="max-w-2xl font-sans text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">
          Something went wrong.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-deep/80">
          The page failed to load. Try again, or go back to the homepage.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="dark" size="lg" onClick={() => reset()}>
            Try again
          </Button>
          <ButtonLink href="/" variant="outline" size="lg">
            Go to the homepage
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

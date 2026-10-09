import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { ContourBackdrop } from "@/components/visuals/ContourBackdrop";

export function PageHero({
  title,
  description,
  crumb,
  children,
}: {
  title: string;
  description: string;
  crumb: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-deep/10 bg-mist">
      <ContourBackdrop className="text-deep opacity-[0.10]" seed={1.3} />
      <Container className="relative py-16 sm:py-20 lg:py-24">
        <nav aria-label="Breadcrumb" className="font-sans text-sm text-deep/75">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="underline-offset-4 hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-deep">
              {crumb}
            </li>
          </ol>
        </nav>
        <h1 className="mt-6 max-w-4xl font-sans text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-deep/80 text-pretty sm:text-xl sm:leading-relaxed">{description}</p>
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </section>
  );
}

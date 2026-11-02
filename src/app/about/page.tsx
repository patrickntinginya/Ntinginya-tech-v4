import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "Learn about Ntinginya Tech, a digital information platform sharing practical technology, business, finance and digital work insights.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="About Us"
        title="Knowledge for decisions in a digital world."
        description="Ntinginya Tech is a digital information platform covering technology, business, finance and digital opportunities."
      />
      <Section tone="paper">
        <Container>
          <div className="max-w-3xl">
            <h2 className="font-sans text-3xl font-semibold tracking-tight">Rooted in Tanzania. Open to the world.</h2>
            <div className="mt-5 space-y-5 text-lg leading-relaxed text-deep/80">
              <p>
                Ntinginya Tech publishes practical information for people learning about technology, building
                businesses, making financial decisions and developing digital skills. Our coverage starts with
                Tanzania and East Africa, and is written for readers across Africa and internationally.
              </p>
              <p>
                We focus on useful explanations and realistic guidance—not hype, guaranteed earnings or claims that
                unlaunched products are available. Articles are informational and do not replace qualified financial,
                legal or other professional advice.
              </p>
              <p>
                We welcome questions, corrections and story ideas. Read our{" "}
                <Link href="/editorial-standards" className="font-semibold text-field-800 underline underline-offset-4">
                  editorial standards
                </Link>{" "}
                to learn how we approach accuracy, AI-assisted work, reviews and commercial content.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

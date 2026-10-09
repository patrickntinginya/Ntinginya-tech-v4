import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroVisual } from "@/components/visuals/HeroVisual";

const focusAreas = [
  "Software",
  "Agriculture and livestock",
  "AgriTech innovation",
  "Education",
  "AI and digital innovation",
  "Research and development",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-mist">
      <Container className="grid items-center gap-12 pb-12 pt-12 sm:pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:pb-16 lg:pt-20">
        <div>
          <p className="flex items-center gap-3 font-sans text-sm font-medium text-field-700">
            <span aria-hidden="true" className="h-px w-8 bg-field-700" />
            {siteConfig.tagline}
          </p>

          <h1 className="mt-6 font-sans text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.03em] text-balance sm:text-6xl xl:text-[4.25rem]">
            Technology. Agriculture. Innovation.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-deep/80 text-pretty sm:text-xl sm:leading-relaxed">
            Building digital solutions and advancing modern agriculture through technology, knowledge and innovation.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/solutions" variant="dark" size="lg">
              Explore Solutions
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              Work With Us
            </ButtonLink>
          </div>

          <p className="mt-10 max-w-md border-l-2 border-maize-400 pl-4 text-[0.9375rem] leading-relaxed text-deep/80">
            <span className="font-sans font-semibold text-deep">Where we are today:</span> we are building
            Ntinginya Business Manager, currently an MVP. Everything else on this site is clearly marked as coming
            soon or proposed.
          </p>
        </div>

        <div className="mx-auto w-full max-w-[34rem] lg:max-w-none">
          <HeroVisual />
        </div>
      </Container>

      <Container className="pb-14">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-deep/15 pt-6 sm:grid-cols-3 lg:grid-cols-6" aria-label="Focus areas">
          {focusAreas.map((area) => (
            <li key={area} className="font-sans text-sm font-medium leading-snug text-deep/85">
              {area}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

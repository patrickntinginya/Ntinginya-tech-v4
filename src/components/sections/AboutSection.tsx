import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

const ingredients = ["Technology", "Research", "Education", "Innovation", "Local understanding"];

export function AboutSection({ full = false }: { full?: boolean }) {
  return (
    <Section tone="mist" id="about">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="font-sans text-[1.9rem] font-semibold leading-[1.1] tracking-[-0.025em] text-balance sm:text-4xl lg:text-[2.75rem]">
            Technology should solve problems, not create complexity.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-deep/80">
            That simple belief is where Ntinginya Tech begins. We are a Tanzanian technology and innovation company that
            builds software and applies technology, education, research and innovation to real-world problems.
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-deep/80">
            We are not an agriculture-only company. Agriculture and livestock are major areas of focus alongside
            software, AI and research, and we want each of them to strengthen the others.
          </p>
          {!full ? (
            <ButtonLink href="/about" variant="outline" className="mt-8">
              About Ntinginya Tech
            </ButtonLink>
          ) : null}
        </div>

        <div className="lg:col-span-5">
          <h3 className="font-sans text-lg font-semibold">What we bring together</h3>
          <ul className="mt-4 divide-y divide-deep/15 border-y border-deep/15">
            {ingredients.map((item, i) => (
              <li key={item} className="flex items-center gap-4 py-3.5 font-sans text-lg font-medium">
                <span aria-hidden="true" className="w-5 text-center text-xl text-field-700">
                  {i === 0 ? "" : "+"}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

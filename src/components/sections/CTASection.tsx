import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export function CTASection({
  title = "Have a problem worth solving?",
  text = "Talk to us about software, agriculture technology, research or partnerships.",
  ctaHref = "/contact",
  ctaLabel = "Talk to Ntinginya Tech",
}: {
  title?: string;
  text?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <Section tone="field" spacing="tight">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-sans text-3xl font-semibold leading-tight tracking-[-0.02em] text-balance sm:text-4xl">{title}</h2>
          <p className="mt-3 text-lg leading-relaxed text-white/85">{text}</p>
        </div>
        <ButtonLink href={ctaHref} variant="maize" size="lg" className="w-full sm:w-auto">
          {ctaLabel}
        </ButtonLink>
      </div>
    </Section>
  );
}

import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

/** Home-page call to action for the Expert Network. */
export function NetworkCTA() {
  return (
    <Section tone="deep" spacing="tight" id="network">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-sans text-3xl font-semibold leading-tight tracking-[-0.02em] text-balance sm:text-4xl">
            Join the Ntinginya Tech Network
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-white/85">
            Developers, agriculture experts, designers, researchers and marketers: tell us what you do and how you would like to
            work with us.
          </p>
        </div>
        <ButtonLink href="/network" variant="maize" size="lg" className="w-full sm:w-auto">
          Join the network
        </ButtonLink>
      </div>
    </Section>
  );
}

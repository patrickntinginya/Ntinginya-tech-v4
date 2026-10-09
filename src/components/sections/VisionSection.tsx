import { mission, vision } from "@/content/principles";
import { Section } from "@/components/ui/Section";
import { ContourBackdrop } from "@/components/visuals/ContourBackdrop";

export function VisionSection() {
  return (
    <Section tone="deep" id="vision" spacing="loose" className="overflow-hidden">
      <ContourBackdrop className="text-white opacity-[0.12]" seed={4.2} rings={11} />
      <div className="relative">
        <h2 className="font-sans text-lg font-semibold text-maize-400">Our vision</h2>
        <p className="mt-5 max-w-5xl font-sans text-[2rem] font-semibold leading-[1.12] tracking-[-0.025em] text-balance sm:text-5xl lg:text-6xl">
          {vision}
        </p>

        <div className="mt-14 max-w-2xl border-t border-white/25 pt-6">
          <h2 className="font-sans text-lg font-semibold text-maize-400">Our mission</h2>
          <p className="mt-3 text-lg leading-relaxed text-white/85 text-pretty sm:text-xl">{mission}</p>
        </div>
      </div>
    </Section>
  );
}

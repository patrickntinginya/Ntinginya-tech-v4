import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

export type SectionTone = "mist" | "paper" | "deep" | "field";

const tones: Record<SectionTone, string> = {
  mist: "bg-mist text-deep",
  paper: "bg-paper text-deep",
  deep: "surface-dark bg-deep text-white",
  field: "surface-dark bg-field-700 text-white",
};

const spacings = {
  tight: "py-16 sm:py-20",
  default: "py-20 sm:py-24 lg:py-28",
  loose: "py-24 sm:py-32 lg:py-36",
} as const;

export function Section({
  id,
  tone = "mist",
  spacing = "default",
  className,
  containerClassName,
  children,
}: {
  id?: string;
  tone?: SectionTone;
  spacing?: keyof typeof spacings;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-20", spacings[spacing], tones[tone], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

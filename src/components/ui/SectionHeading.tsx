import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  title: ReactNode;
  description?: ReactNode;
  dark?: boolean;
  /** Title left, description right on large screens. */
  split?: boolean;
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export function SectionHeading({ title, description, dark = false, split = true, as: Tag = "h2", className }: Props) {
  const titleClass =
    "font-sans text-[1.9rem] font-semibold leading-[1.1] tracking-[-0.025em] text-balance sm:text-4xl lg:text-[2.75rem]";
  const descClass = cn("text-[1.0625rem] leading-relaxed text-pretty", dark ? "text-white/80" : "text-deep/75");

  if (!split) {
    return (
      <div className={cn("max-w-3xl", className)}>
        <Tag className={titleClass}>{title}</Tag>
        {description ? <div className={cn("mt-5", descClass)}>{description}</div> : null}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-12", className)}>
      <Tag className={cn(titleClass, "lg:col-span-7")}>{title}</Tag>
      {description ? <div className={cn(descClass, "lg:col-span-5")}>{description}</div> : null}
    </div>
  );
}

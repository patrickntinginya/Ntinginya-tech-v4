import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Surface = "paper" | "white" | "outline" | "dashed" | "dark";

const surfaces: Record<Surface, string> = {
  paper: "border border-deep/15 bg-paper",
  white: "border border-deep/15 bg-white",
  outline: "border border-deep/25 bg-transparent",
  dashed: "border border-dashed border-deep/40 bg-transparent",
  dark: "surface-dark border border-white/15 bg-deep-800 text-white",
};

/**
 * Shared card surface. Radius, shadow and hover motion come from the design tokens in globals.css,
 * so every card changes together. `interactive` adds the hover lift (motion-safe only).
 */
export function Card({
  surface = "paper",
  interactive = false,
  as: Tag = "div",
  className,
  children,
}: {
  surface?: Surface;
  interactive?: boolean;
  as?: "div" | "article" | "li";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={cn("relative rounded-card p-6 sm:p-7", surfaces[surface], interactive && "lift", className)}>
      {children}
    </Tag>
  );
}

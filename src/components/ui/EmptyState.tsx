import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** An honest "nothing here yet" panel. Used wherever content has not been published, so nothing is invented. */
export function EmptyState({
  title,
  children,
  dark = false,
  className,
}: {
  title: string;
  children?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-dashed p-6 sm:p-8",
        dark ? "border-white/35" : "border-deep/30",
        className,
      )}
    >
      <p className="font-sans text-lg font-semibold">{title}</p>
      {children ? (
        <div className={cn("mt-1 max-w-xl text-[0.9375rem] leading-relaxed", dark ? "text-white/80" : "text-deep/75")}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

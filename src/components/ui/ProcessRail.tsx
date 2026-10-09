import { cn } from "@/lib/cn";

export type RailStep = { label: string; note?: string };

/**
 * A numbered sequence. Vertical on small screens, horizontal on large screens.
 * The final step can be highlighted as the destination.
 */
export function ProcessRail({
  steps,
  dark = false,
  highlightLast = false,
  className,
}: {
  steps: RailStep[];
  dark?: boolean;
  highlightLast?: boolean;
  className?: string;
}) {
  return (
    <ol className={cn("grid gap-6 lg:grid-flow-col lg:auto-cols-fr", className)}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        const emphasised = highlightLast && last;
        return (
          <li key={step.label} className="relative flex gap-4 lg:flex-col">
            {!last ? (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-[1.0625rem] top-10 h-[calc(100%-1rem)] w-px lg:left-10 lg:top-[1.125rem] lg:h-px lg:w-[calc(100%-1.25rem)]",
                  dark ? "bg-white/25" : "bg-deep/25",
                )}
              />
            ) : null}
            <span
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-full border font-sans text-sm font-semibold",
                emphasised
                  ? "border-maize-400 bg-maize-400 text-deep"
                  : dark
                    ? "border-white/40 text-white"
                    : "border-deep/40 text-deep",
              )}
            >
              {i + 1}
            </span>
            <div className="pt-1.5 lg:pt-0">
              <p className="font-sans text-base font-semibold leading-snug">{step.label}</p>
              {step.note ? (
                <p className={cn("mt-1 text-[0.9375rem] leading-snug", dark ? "text-white/75" : "text-deep/75")}>
                  {step.note}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

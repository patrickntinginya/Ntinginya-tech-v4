import { contourPaths } from "@/lib/contours";
import { cn } from "@/lib/cn";

/** Quiet topographic lines used behind page headers and dark statements. */
export function ContourBackdrop({
  className,
  seed = 3,
  rings = 9,
}: {
  className?: string;
  seed?: number;
  rings?: number;
}) {
  const paths = contourPaths({ cx: 500, cy: 300, rings, start: 50, step: 34, seed, points: 72 });
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMaxYMid slice"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth={i % 4 === 0 ? 1.4 : 0.8} />
      ))}
    </svg>
  );
}

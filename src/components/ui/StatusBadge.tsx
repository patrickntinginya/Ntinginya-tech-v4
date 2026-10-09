import { cn } from "@/lib/cn";
import type { StatusKey } from "@/content/types";

const config: Record<StatusKey, { label: string; light: string; dark: string }> = {
  live: {
    label: "LIVE",
    light: "bg-field-700 text-white",
    dark: "bg-field-300 text-deep",
  },
  mvp: {
    label: "MVP",
    light: "bg-maize-400 text-deep",
    dark: "bg-maize-400 text-deep",
  },
  "in-development": {
    label: "IN DEVELOPMENT",
    light: "border border-maize-700/60 text-maize-700",
    dark: "border border-maize-400/70 text-maize-300",
  },
  "future": {
    label: "FUTURE",
    light: "border border-deep/40 text-deep",
    dark: "border border-white/50 text-white",
  },
  proposed: {
    label: "PROPOSED",
    light: "border border-dashed border-deep/50 text-deep/80",
    dark: "border border-dashed border-white/50 text-white/80",
  },
};

export function StatusBadge({
  status,
  tone = "light",
  className,
}: {
  status: StatusKey;
  tone?: "light" | "dark";
  className?: string;
}) {
  const item = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 font-sans text-[0.6875rem] font-semibold leading-none tracking-wider",
        item[tone],
        className,
      )}
    >
      {item.label}
    </span>
  );
}

export function StatusBadges({
  statuses,
  tone,
  className,
}: {
  statuses: StatusKey[];
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {statuses.map((s) => (
        <StatusBadge key={s} status={s} tone={tone} />
      ))}
    </div>
  );
}

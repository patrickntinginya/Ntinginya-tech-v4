import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { NOTICES } from "@/lib/cms/action-types";

export const inputClass =
  "w-full rounded-lg border border-deep/30 bg-white px-3.5 py-3 font-sans text-base text-deep placeholder:text-deep/45 focus-visible:border-field-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-field-700 aria-[invalid=true]:border-red-700";
export const labelClass = "mb-1.5 block font-sans text-sm font-semibold text-deep";
export const btn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-sans text-[0.9375rem] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";
export const btnDark = `${btn} bg-deep text-white hover:bg-deep-800`;
export const btnGreen = `${btn} bg-field-700 text-white hover:bg-field-800`;
export const btnOutline = `${btn} border border-deep/30 text-deep hover:bg-deep/5`;
export const btnDanger = `${btn} border border-red-700/50 text-red-800 hover:bg-red-50`;

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-sans text-3xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-base text-deep/75">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-deep/15 bg-paper p-4 sm:p-6", className)}>{children}</div>;
}

export function Notice({ code, error }: { code?: string; error?: string }) {
  const message = error ?? (code ? NOTICES[code] : undefined);
  if (!message) return null;
  const bad = Boolean(error) || ["failed", "forbidden", "not_found", "category_in_use"].includes(code ?? "");
  return (
    <p
      role={bad ? "alert" : "status"}
      className={cn(
        "mb-5 rounded-lg border p-3 font-sans text-sm",
        bad ? "border-red-700/40 bg-red-50 text-red-900" : "border-field-700/40 bg-field-100 text-field-800",
      )}
    >
      {message}
    </p>
  );
}

const pillStyles: Record<string, string> = {
  PUBLISHED: "bg-field-100 text-field-800",
  DRAFT: "bg-maize-300/60 text-maize-700",
  ARCHIVED: "bg-deep/10 text-deep/80",
};
export function StatusPill({ status }: { status: string }) {
  return (
    <span className={cn("inline-block rounded-md px-2 py-0.5 font-sans text-xs font-semibold", pillStyles[status] ?? pillStyles.ARCHIVED)}>
      {status}
    </span>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-dashed border-deep/30 p-8 text-center font-sans text-deep/75">{children}</div>;
}

export function StatCard({ label, value, href }: { label: string; value: number; href?: string }) {
  const body = (
    <>
      <p className="font-sans text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 font-sans text-sm text-deep/75">{label}</p>
    </>
  );
  const cls = "block rounded-2xl border border-deep/15 bg-paper p-4 sm:p-5";
  return href ? (
    <Link href={href} className={cn(cls, "hover:border-deep/40")}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

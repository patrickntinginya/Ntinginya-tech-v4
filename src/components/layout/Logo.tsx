import Link from "next/link";
import { cn } from "@/lib/cn";

/** Logo mark. Replace the contents of this component (or use next/image) once an official logo exists. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("h-9 w-9 shrink-0", className)}>
      <rect width="40" height="40" rx="9" fill="#0A2A30" />
      <path d="M11 29V11l18 18V11" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="29" cy="11" r="3.2" fill="#F5B700" />
    </svg>
  );
}

export function Logo({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Ntinginya Tech, home"
      className={cn("inline-flex items-center gap-3 rounded-md", className)}
    >
      <LogoMark className={dark ? "ring-1 ring-white/25 rounded-[9px]" : undefined} />
      <span className={cn("font-sans text-[1.0625rem] leading-none tracking-[0.14em]", dark ? "text-white" : "text-deep")}>
        <span className="font-bold">NTINGINYA</span> <span className="font-light">TECH</span>
      </span>
    </Link>
  );
}

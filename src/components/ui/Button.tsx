import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "dark" | "outline" | "outline-light" | "maize";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-lg text-center font-sans font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-field-700 text-white hover:bg-field-800",
  dark: "bg-deep text-white hover:bg-deep-800",
  maize: "bg-maize-400 text-deep hover:bg-maize-300",
  outline: "border border-deep/30 text-deep hover:border-deep hover:bg-deep hover:text-white",
  "outline-light": "border border-white/35 text-white hover:border-white hover:bg-white hover:text-deep",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 text-[0.9375rem]",
  lg: "min-h-12 px-6 py-3 text-base",
};

type Styling = { variant?: Variant; size?: Size; className?: string };

export function buttonStyles({ variant = "dark", size = "md", className }: Styling): string {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & Styling;

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & Styling;

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}

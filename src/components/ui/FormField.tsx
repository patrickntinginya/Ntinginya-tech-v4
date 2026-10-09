import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

/** Shared input styling for every public form (contact, Expert Network). */
export const inputClass =
  "w-full rounded-control border border-deep/30 bg-white px-3.5 py-3 font-sans text-base text-deep placeholder:text-deep/50 focus-visible:border-field-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-field-700 aria-[invalid=true]:border-red-700";

/** Label + control + inline error. The control must use id `field-${name}` and, when invalid, aria-describedby `error-${name}`. */
export function Field({
  name,
  label,
  required,
  error,
  hint,
  children,
}: {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={`field-${name}`} className="mb-1.5 block font-sans text-sm font-semibold">
        {label}
        {required ? <span className="text-red-700"> *</span> : <span className="font-normal text-deep/70"> (optional)</span>}
      </label>
      {children}
      {hint && !error ? (
        <p id={`hint-${name}`} className="mt-1.5 font-sans text-sm text-deep/70">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`error-${name}`} className="mt-1.5 flex items-start gap-1.5 font-sans text-sm text-red-700">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

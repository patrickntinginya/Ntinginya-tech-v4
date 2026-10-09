"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { FormState } from "@/lib/cms/action-types";
import { loginAction } from "./actions";

const inputClass =
  "w-full rounded-lg border border-deep/30 bg-white px-3.5 py-3 font-sans text-base text-deep focus-visible:border-field-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-field-700 aria-[invalid=true]:border-red-700";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, {});

  return (
    <form action={action} className="mt-6 space-y-5" noValidate>
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="login-email" className="mb-1.5 block font-sans text-sm font-semibold">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          required
          maxLength={200}
          aria-invalid={state.fieldErrors?.email ? true : undefined}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="login-password" className="mb-1.5 block font-sans text-sm font-semibold">
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={200}
          aria-invalid={state.fieldErrors?.password ? true : undefined}
          className={inputClass}
        />
      </div>

      <div aria-live="polite">
        {state.error ? (
          <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-700/40 bg-red-50 p-3 font-sans text-sm text-red-900">
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            {state.error}
          </p>
        ) : null}
      </div>

      <Button type="submit" variant="dark" size="lg" disabled={pending} className="w-full">
        {pending ? (
          <>
            <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />
            Signing in
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}

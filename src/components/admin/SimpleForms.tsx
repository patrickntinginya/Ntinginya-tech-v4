"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { createCategoryAction, saveProfileNameAction, saveSettingsAction } from "@/app/admin/actions";
import type { FormState } from "@/lib/cms/action-types";
import { btnDark, inputClass, labelClass } from "./ui";

function Status({ state }: { state: FormState }) {
  return (
    <div aria-live="polite">
      {state.error ? <p role="alert" className="rounded-lg border border-red-700/40 bg-red-50 p-3 font-sans text-sm text-red-900">{state.error}</p> : null}
      {state.ok && state.message ? <p role="status" className="rounded-lg border border-field-700/40 bg-field-100 p-3 font-sans text-sm text-field-800">{state.message}</p> : null}
    </div>
  );
}

function Submit({ pending, children }: { pending: boolean; children: string }) {
  return (
    <button type="submit" disabled={pending} className={btnDark}>
      {pending ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

export function CategoryCreateForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createCategoryAction, {});
  return (
    <form action={action} className="space-y-4" key={state.ok ? "done" : "form"}>
      <div>
        <label htmlFor="cat-name" className={labelClass}>Name</label>
        <input id="cat-name" name="name" type="text" required maxLength={80} className={inputClass} />
      </div>
      <div>
        <label htmlFor="cat-slug" className={labelClass}>Slug (optional)</label>
        <input id="cat-slug" name="slug" type="text" maxLength={80} className={inputClass} />
      </div>
      <div>
        <label htmlFor="cat-desc" className={labelClass}>Description (optional)</label>
        <input id="cat-desc" name="description" type="text" maxLength={200} className={inputClass} />
      </div>
      <Status state={state} />
      <Submit pending={pending}>Add category</Submit>
    </form>
  );
}

type SettingsValues = {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  whatsapp: string;
  default_seo_title: string;
  default_seo_description: string;
  social: Record<string, string>;
};

export function SettingsForm({ values, socialKeys }: { values: SettingsValues; socialKeys: readonly string[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveSettingsAction, {});
  const err = (k: string) => (state.fieldErrors?.[k] ? true : undefined);
  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="s-name" className={labelClass}>Site name</label>
        <input id="s-name" name="site_name" defaultValue={values.site_name} required maxLength={80} aria-invalid={err("site_name")} className={inputClass} />
      </div>
      <div>
        <label htmlFor="s-desc" className={labelClass}>Site description</label>
        <textarea id="s-desc" name="site_description" defaultValue={values.site_description} rows={3} maxLength={300} className={inputClass} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="s-email" className={labelClass}>Contact email</label>
          <input id="s-email" name="contact_email" type="email" defaultValue={values.contact_email} maxLength={200} aria-invalid={err("contact_email")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="s-phone" className={labelClass}>Contact phone</label>
          <input id="s-phone" name="contact_phone" type="tel" defaultValue={values.contact_phone} maxLength={30} aria-invalid={err("contact_phone")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="s-wa" className={labelClass}>WhatsApp number</label>
          <input id="s-wa" name="whatsapp" type="tel" defaultValue={values.whatsapp} maxLength={30} aria-invalid={err("whatsapp")} className={inputClass} />
        </div>
      </div>
      <div>
        <label htmlFor="s-seo-t" className={labelClass}>Default SEO title</label>
        <input id="s-seo-t" name="default_seo_title" defaultValue={values.default_seo_title} maxLength={70} className={inputClass} />
      </div>
      <div>
        <label htmlFor="s-seo-d" className={labelClass}>Default SEO description</label>
        <textarea id="s-seo-d" name="default_seo_description" defaultValue={values.default_seo_description} rows={3} maxLength={170} className={inputClass} />
      </div>
      <fieldset className="space-y-4 rounded-xl border border-deep/15 p-4">
        <legend className="px-2 font-sans text-base font-semibold">Social links</legend>
        <p className="font-sans text-sm text-deep/75">Full https:// links only. Empty ones are not shown on the site.</p>
        {socialKeys.map((k) => (
          <div key={k}>
            <label htmlFor={`s-social-${k}`} className={labelClass}>{k}</label>
            <input id={`s-social-${k}`} name={`social_${k}`} type="url" inputMode="url" defaultValue={values.social[k] ?? ""} maxLength={300} placeholder="https://" aria-invalid={err(`social_${k}`)} className={inputClass} />
          </div>
        ))}
      </fieldset>
      <Status state={state} />
      <Submit pending={pending}>Save settings</Submit>
    </form>
  );
}

export function ProfileNameForm({ name }: { name: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProfileNameAction, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="p-name" className={labelClass}>Your name (shown as article author)</label>
        <input id="p-name" name="full_name" defaultValue={name} required maxLength={80} autoComplete="name" className={inputClass} />
      </div>
      <Status state={state} />
      <Submit pending={pending}>Save name</Submit>
    </form>
  );
}

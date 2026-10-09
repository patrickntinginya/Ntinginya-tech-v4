"use client";

import { useActionState, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { saveEntryAction } from "@/app/admin/actions";
import { STATUS_KEYS, STATUS_TEXT, kindMeta, type EntryKind } from "@/content/entry-kinds";
import type { AdminEntry, AdminMedia } from "@/lib/cms/admin";
import type { FormState } from "@/lib/cms/action-types";
import { slugify } from "@/lib/cms/slug";
import { ImageField } from "./ImageField";
import { btnGreen, btnOutline, inputClass, labelClass } from "./ui";

/** One form for every kind of structured content. Fields that do not apply to a kind are simply not shown. */
export function EntryForm({ kind, entry, media }: { kind: EntryKind; entry: AdminEntry | null; media: AdminMedia[] }) {
  const meta = kindMeta[kind];
  const [state, action, pending] = useActionState<FormState, FormData>(saveEntryAction, {});
  const [title, setTitle] = useState(entry?.title ?? "");
  const [slug, setSlug] = useState(entry?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(entry));
  // The date picker uses the device's local time; the server receives an ISO (UTC) timestamp.
  const [eventLocal, setEventLocal] = useState("");
  useEffect(() => {
    if (entry?.event_at) setEventLocal(toLocalInput(entry.event_at));
  }, [entry?.event_at]);
  const eventIso = eventLocal && !Number.isNaN(new Date(eventLocal).getTime()) ? new Date(eventLocal).toISOString() : "";
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-6">
      {entry ? <input type="hidden" name="id" value={entry.id} /> : null}
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="event_at" value={eventIso} />

      <div aria-live="polite">
        {state.error ? (
          <p role="alert" className="rounded-lg border border-red-700/40 bg-red-50 p-3 font-sans text-sm text-red-900">
            {state.error}
          </p>
        ) : null}
      </div>

      <p className="font-sans text-sm text-deep/75">{meta.help}</p>

      <div>
        <label htmlFor="entry-title" className={labelClass}>
          Title
        </label>
        <input
          id="entry-title"
          name="title"
          type="text"
          required
          maxLength={200}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="entry-slug" className={labelClass}>
          Slug (web address)
        </label>
        <input
          id="entry-slug"
          name="slug"
          type="text"
          maxLength={100}
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          aria-invalid={fe.slug ? true : undefined}
          className={inputClass}
        />
        {kind === "product" ? (
          <p className="mt-1 break-all font-sans text-xs text-deep/70">/products/{slug || "your-title-here"}</p>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="entry-status" className={labelClass}>
            Status
          </label>
          <select id="entry-status" name="status_label" defaultValue={entry?.status_label ?? "proposed"} className={inputClass}>
            {STATUS_KEYS.map((key) => (
              <option key={key} value={key}>
                {STATUS_TEXT[key]}
              </option>
            ))}
          </select>
          <p className="mt-1 font-sans text-xs text-deep/70">Be honest. LIVE means people can use it today.</p>
        </div>

        <div>
          <label htmlFor="entry-category" className={labelClass}>
            {meta.categories.length > 0 ? "Type" : "Category (optional)"}
          </label>
          {meta.categories.length > 0 ? (
            <select id="entry-category" name="category" defaultValue={entry?.category ?? ""} className={inputClass}>
              <option value="">Choose…</option>
              {meta.categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          ) : (
            <input id="entry-category" name="category" type="text" maxLength={80} defaultValue={entry?.category ?? ""} className={inputClass} />
          )}
        </div>
      </div>

      <div>
        <label htmlFor="entry-summary" className={labelClass}>
          Short description
        </label>
        <textarea
          id="entry-summary"
          name="summary"
          rows={3}
          maxLength={400}
          defaultValue={entry?.summary ?? ""}
          aria-invalid={fe.summary ? true : undefined}
          className={inputClass}
        />
        <p className="mt-1 font-sans text-xs text-deep/70">Up to 400 characters. Shown on cards and in search results.</p>
      </div>

      <div>
        <label htmlFor="entry-body" className={labelClass}>
          Full description
        </label>
        <textarea id="entry-body" name="body" rows={8} maxLength={8000} defaultValue={entry?.body ?? ""} className={inputClass} />
        <p className="mt-1 font-sans text-xs text-deep/70">Plain text. Shown on the detail page where one exists.</p>
      </div>

      <div>
        <label htmlFor="entry-features" className={labelClass}>
          Features or topics
        </label>
        <textarea id="entry-features" name="features" rows={5} defaultValue={(entry?.features ?? []).join("\n")} className={inputClass} />
        <p className="mt-1 font-sans text-xs text-deep/70">One per line. Up to 20.</p>
      </div>

      <ImageField name="image" label="Image" initial={entry?.image ?? ""} media={media} />

      {meta.usesDate ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="entry-event" className={labelClass}>
              Date and time
            </label>
            <input
              id="entry-event"
              type="datetime-local"
              value={eventLocal}
              onChange={(e) => setEventLocal(e.target.value)}
              aria-invalid={fe.event_at ? true : undefined}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="entry-location" className={labelClass}>
              Location or format
            </label>
            <input id="entry-location" name="location" type="text" maxLength={160} defaultValue={entry?.location ?? ""} placeholder="For example: online, or a city" className={inputClass} />
          </div>
        </div>
      ) : (
        <input type="hidden" name="location" value={entry?.location ?? ""} />
      )}

      {kind === "masterclass" ? (
        <div>
          <label htmlFor="entry-byline" className={labelClass}>
            Instructor or expert
          </label>
          <input id="entry-byline" name="byline" type="text" maxLength={160} defaultValue={entry?.byline ?? ""} className={inputClass} />
          <p className="mt-1 font-sans text-xs text-deep/70">Only enter a real person who has agreed to teach.</p>
        </div>
      ) : (
        <input type="hidden" name="byline" value={entry?.byline ?? ""} />
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="entry-cta-label" className={labelClass}>
            Button text
          </label>
          <input id="entry-cta-label" name="cta_label" type="text" maxLength={80} defaultValue={entry?.cta_label ?? ""} placeholder={kind === "masterclass" ? "Ask about this session" : "Learn more"} className={inputClass} />
        </div>
        <div>
          <label htmlFor="entry-cta-url" className={labelClass}>
            Button link
          </label>
          <input id="entry-cta-url" name="cta_url" type="text" inputMode="url" maxLength={600} defaultValue={entry?.cta_url ?? ""} placeholder="https://… or /contact?subject=…" className={inputClass} />
          <p className="mt-1 font-sans text-xs text-deep/70">
            {kind === "masterclass"
              ? "Registration is not automatic. Point this at /contact so people can request information."
              : "An https:// link or a path on this site."}
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="entry-sort" className={labelClass}>
            Order
          </label>
          <input id="entry-sort" name="sort_order" type="number" inputMode="numeric" min={-1000} max={1000} defaultValue={entry?.sort_order ?? 0} className={inputClass} />
          <p className="mt-1 font-sans text-xs text-deep/70">Lower numbers come first.</p>
        </div>
        <div className="flex items-start gap-3 pt-7">
          <input id="entry-featured" name="featured" type="checkbox" defaultChecked={entry?.featured ?? false} className="mt-1 h-5 w-5 rounded border-deep/40" />
          <label htmlFor="entry-featured" className="font-sans text-base font-semibold">
            Featured
            <span className="block text-sm font-normal text-deep/75">May be highlighted on the home page.</span>
          </label>
        </div>
      </div>

      <fieldset className="space-y-5 rounded-xl border border-deep/15 p-4">
        <legend className="px-2 font-sans text-base font-semibold">Search and social (SEO)</legend>
        <div>
          <label htmlFor="entry-seo-title" className={labelClass}>
            SEO title
          </label>
          <input id="entry-seo-title" name="seo_title" type="text" maxLength={70} defaultValue={entry?.seo_title ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="entry-seo-desc" className={labelClass}>
            SEO description
          </label>
          <textarea id="entry-seo-desc" name="seo_description" rows={3} maxLength={170} defaultValue={entry?.seo_description ?? ""} className={inputClass} />
        </div>
      </fieldset>

      <div className="flex items-start gap-3 rounded-xl border border-deep/15 p-4">
        <input id="entry-published" name="is_published" type="checkbox" defaultChecked={entry?.is_published ?? false} className="mt-1 h-5 w-5 rounded border-deep/40" />
        <label htmlFor="entry-published" className="font-sans text-base">
          <span className="font-semibold">Published</span>
          <span className="block text-sm text-deep/75">Untick to keep it as a draft. Drafts are never visible on the website.</span>
        </label>
      </div>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap gap-2 border-t border-deep/15 bg-mist/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-4">
        <button type="submit" disabled={pending} className={btnGreen}>
          {pending ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
          Save
        </button>
        <a href="/admin/content" className={btnOutline}>
          Back to list
        </a>
      </div>
    </form>
  );
}

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

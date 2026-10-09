"use client";

import { useState } from "react";
import type { AdminMedia } from "@/lib/cms/admin";
import { MediaPickerPanel } from "./MediaPickerPanel";
import { btnOutline, inputClass, labelClass } from "./ui";

/** Image URL field with a "choose from library" picker. Submits as a normal form field. */
export function ImageField({
  name,
  label,
  help,
  initial,
  media,
}: {
  name: string;
  label: string;
  help?: string;
  initial: string;
  media: AdminMedia[];
}) {
  const [value, setValue] = useState(initial);
  const [open, setOpen] = useState(false);
  const id = `img-${name}`;

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input id={id} name={name} type="url" inputMode="url" value={value} onChange={(e) => setValue(e.target.value)} placeholder="https://…" maxLength={600} className={inputClass} />
      {help ? <p className="mt-1 font-sans text-xs text-deep/70">{help}</p> : null}
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className={btnOutline}>
          {open ? "Close library" : "Choose from library"}
        </button>
        {value ? (
          <button type="button" onClick={() => setValue("")} className={btnOutline}>
            Remove
          </button>
        ) : null}
      </div>
      {open ? (
        <div className="mt-3">
          <MediaPickerPanel
            media={media}
            onPick={(m) => {
              setValue(m.url);
              setOpen(false);
            }}
          />
        </div>
      ) : null}
      {value && /^https:\/\//i.test(value) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Selected preview" className="mt-3 max-h-40 rounded-lg border border-deep/15" />
      ) : null}
    </div>
  );
}

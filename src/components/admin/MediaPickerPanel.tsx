"use client";

import type { AdminMedia } from "@/lib/cms/admin";

/** A grid of library images. Choosing one calls onPick. Shared by the editor and the image fields. */
export function MediaPickerPanel({ media, onPick }: { media: AdminMedia[]; onPick: (m: AdminMedia) => void }) {
  if (!media.length) {
    return (
      <p className="rounded-lg border border-dashed border-deep/30 p-4 font-sans text-sm text-deep/75">
        The media library is empty. Upload an image in <a href="/admin/media" target="_blank" className="font-semibold underline">Media</a>, then come back.
      </p>
    );
  }
  return (
    <ul className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-4">
      {media.map((m) => (
        <li key={m.id}>
          <button
            type="button"
            onClick={() => onPick(m)}
            className="block w-full overflow-hidden rounded-lg border border-deep/20 bg-white text-left hover:border-field-700 focus-visible:outline-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.url} alt={m.alt_text || ""} loading="lazy" className="aspect-square w-full object-cover" />
            <span className="block truncate px-2 py-1.5 font-sans text-xs">{m.filename}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

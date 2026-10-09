"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { deleteMediaAction } from "@/app/admin/actions";
import type { AdminMedia } from "@/lib/cms/admin";
import { ConfirmButton } from "./ConfirmButton";
import { btnDanger, btnOutline } from "./ui";

/** Search, preview, select (copy link) and delete. Search is instant and runs in the browser. */
export function MediaGrid({ media }: { media: AdminMedia[] }) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? media.filter((m) => m.filename.toLowerCase().includes(term) || (m.alt_text ?? "").toLowerCase().includes(term)) : media;
  }, [media, q]);

  async function copy(url: string, id: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <div>
      <label htmlFor="media-search" className="sr-only">
        Search images
      </label>
      <input
        id="media-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search images"
        className="mb-4 min-h-11 w-full max-w-md rounded-lg border border-deep/30 bg-white px-3.5 font-sans text-base focus-visible:outline-2"
      />
      {shown.length === 0 ? (
        <p className="rounded-xl border border-dashed border-deep/30 p-8 text-center font-sans text-deep/75">
          {media.length ? "No images match your search." : "No images uploaded yet."}
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {shown.map((m) => {
            const isSel = selected === m.id;
            return (
              <li key={m.id} className={`overflow-hidden rounded-xl border bg-paper ${isSel ? "border-field-700 ring-2 ring-field-700" : "border-deep/15"}`}>
                <button type="button" onClick={() => setSelected(isSel ? null : m.id)} aria-pressed={isSel} className="block w-full text-left">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt={m.alt_text || m.filename} loading="lazy" className="aspect-square w-full object-cover" />
                  <span className="block truncate px-3 pt-2 font-sans text-sm font-medium">{m.filename}</span>
                  <span className="block px-3 pb-2 font-sans text-xs text-deep/70">{Math.round(m.size_bytes / 1024)} KB</span>
                </button>
                {isSel ? (
                  <div className="flex flex-col gap-2 border-t border-deep/10 p-3">
                    <button type="button" onClick={() => copy(m.url, m.id)} className={btnOutline}>
                      {copied === m.id ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
                      {copied === m.id ? "Copied" : "Copy link"}
                    </button>
                    <form action={deleteMediaAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <ConfirmButton
                        confirm="Delete this image? Articles that use it will show a broken image."
                        className={`${btnDanger} w-full`}
                      >
                        Delete
                      </ConfirmButton>
                    </form>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

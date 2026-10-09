"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bold, Heading2, Heading3, ImageIcon, Italic, Link2, List, ListOrdered, Quote, Redo2, RemoveFormatting, Table, Undo2 } from "lucide-react";
import type { AdminMedia } from "@/lib/cms/admin";
import { MediaPickerPanel } from "./MediaPickerPanel";
import { inputClass } from "./ui";

/**
 * A small, dependency-free rich-text editor built on contentEditable. It produces simple HTML;
 * the server sanitises that HTML again (allow-list) before saving and before public rendering.
 */

const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const toolBtn =
  "grid h-11 min-w-11 shrink-0 place-items-center rounded-md border border-deep/20 bg-white px-2 font-sans text-sm font-semibold text-deep hover:bg-deep/5 focus-visible:outline-2";

export function RichEditor({
  initialHtml,
  onChange,
  media,
}: {
  initialHtml: string;
  onChange: (html: string) => void;
  media: AdminMedia[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const saved = useRef<Range | null>(null);
  const [picker, setPicker] = useState(false);
  const [caption, setCaption] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [linkError, setLinkError] = useState("");

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = initialHtml;
    // Set once on mount; the editor owns the content afterwards.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = useCallback(() => onChange(ref.current?.innerHTML ?? ""), [onChange]);

  const rememberSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount && ref.current?.contains(sel.anchorNode)) saved.current = sel.getRangeAt(0).cloneRange();
  }, []);

  const restoreSelection = useCallback(() => {
    ref.current?.focus();
    const sel = window.getSelection();
    if (sel && saved.current) {
      sel.removeAllRanges();
      sel.addRange(saved.current);
    }
  }, []);

  const exec = useCallback(
    (command: string, value?: string) => {
      ref.current?.focus();
      document.execCommand(command, false, value);
      emit();
    },
    [emit],
  );

  // Keeps the text selection when a toolbar button is pressed.
  const keep = (e: React.MouseEvent) => e.preventDefault();

  function insertHtml(html: string) {
    restoreSelection();
    document.execCommand("insertHTML", false, html);
    emit();
  }

  function applyLink() {
    const url = linkUrl.trim();
    if (!/^(https?:\/\/|mailto:|tel:)/i.test(url)) {
      setLinkError("Use a link that starts with https://, mailto: or tel:");
      return;
    }
    restoreSelection();
    document.execCommand("createLink", false, url);
    emit();
    setLinkOpen(false);
    setLinkError("");
  }

  return (
    <div className="rounded-xl border border-deep/30 bg-white">
      <div role="toolbar" aria-label="Formatting" className="flex gap-1.5 overflow-x-auto border-b border-deep/15 p-2">
        <button type="button" className={toolBtn} onMouseDown={keep} onClick={() => exec("formatBlock", "h2")} aria-label="Heading">
          <Heading2 aria-hidden="true" className="h-5 w-5" />
        </button>
        <button type="button" className={toolBtn} onMouseDown={keep} onClick={() => exec("formatBlock", "h3")} aria-label="Subheading">
          <Heading3 aria-hidden="true" className="h-5 w-5" />
        </button>
        <button type="button" className={toolBtn} onMouseDown={keep} onClick={() => exec("formatBlock", "p")} aria-label="Paragraph">
          P
        </button>
        <button type="button" className={toolBtn} onMouseDown={keep} onClick={() => exec("bold")} aria-label="Bold">
          <Bold aria-hidden="true" className="h-5 w-5" />
        </button>
        <button type="button" className={toolBtn} onMouseDown={keep} onClick={() => exec("italic")} aria-label="Italic">
          <Italic aria-hidden="true" className="h-5 w-5" />
        </button>
        <button
          type="button"
          className={toolBtn}
          onMouseDown={keep}
          onClick={() => {
            rememberSelection();
            setLinkOpen((v) => !v);
            setPicker(false);
          }}
          aria-label="Link"
          aria-expanded={linkOpen}
        >
          <Link2 aria-hidden="true" className="h-5 w-5" />
        </button>
        <button type="button" className={toolBtn} onMouseDown={keep} onClick={() => exec("insertUnorderedList")} aria-label="Bullet list">
          <List aria-hidden="true" className="h-5 w-5" />
        </button>
        <button type="button" className={toolBtn} onMouseDown={keep} onClick={() => exec("insertOrderedList")} aria-label="Numbered list">
          <ListOrdered aria-hidden="true" className="h-5 w-5" />
        </button>
        <button type="button" className={toolBtn} onMouseDown={keep} onClick={() => exec("formatBlock", "blockquote")} aria-label="Quote">
          <Quote aria-hidden="true" className="h-5 w-5" />
        </button>
        <button
          type="button"
          className={toolBtn}
          onMouseDown={keep}
          onClick={() => {
            rememberSelection();
            setPicker((v) => !v);
            setLinkOpen(false);
          }}
          aria-label="Insert image"
          aria-expanded={picker}
        >
          <ImageIcon aria-hidden="true" className="h-5 w-5" />
        </button>
        <button
          type="button"
          className={toolBtn}
          onMouseDown={keep}
          onClick={() =>
            insertHtml(
              "<table><thead><tr><th>Heading</th><th>Heading</th></tr></thead><tbody><tr><td>Text</td><td>Text</td></tr><tr><td>Text</td><td>Text</td></tr></tbody></table><p><br></p>",
            )
          }
          aria-label="Insert table"
        >
          <Table aria-hidden="true" className="h-5 w-5" />
        </button>
        <button type="button" className={toolBtn} onMouseDown={keep} onClick={() => exec("removeFormat")} aria-label="Clear formatting">
          <RemoveFormatting aria-hidden="true" className="h-5 w-5" />
        </button>
        <button type="button" className={toolBtn} onMouseDown={keep} onClick={() => exec("undo")} aria-label="Undo">
          <Undo2 aria-hidden="true" className="h-5 w-5" />
        </button>
        <button type="button" className={toolBtn} onMouseDown={keep} onClick={() => exec("redo")} aria-label="Redo">
          <Redo2 aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      {linkOpen ? (
        <div className="space-y-2 border-b border-deep/15 bg-paper p-3">
          <label htmlFor="editor-link" className="block font-sans text-sm font-semibold">
            Link address
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input id="editor-link" type="url" inputMode="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className={inputClass} />
            <button type="button" onClick={applyLink} className="min-h-11 rounded-lg bg-deep px-4 font-sans text-sm font-semibold text-white">
              Add link
            </button>
          </div>
          {linkError ? <p role="alert" className="font-sans text-sm text-red-800">{linkError}</p> : null}
          <p className="font-sans text-xs text-deep/70">Select some text first, then add the link.</p>
        </div>
      ) : null}

      {picker ? (
        <div className="space-y-3 border-b border-deep/15 bg-paper p-3">
          <div>
            <label htmlFor="editor-caption" className="block font-sans text-sm font-semibold">
              Caption (optional)
            </label>
            <input id="editor-caption" type="text" maxLength={200} value={caption} onChange={(e) => setCaption(e.target.value)} className={`${inputClass} mt-1.5`} />
          </div>
          <MediaPickerPanel
            media={media}
            onPick={(m) => {
              const alt = escapeHtml(m.alt_text || m.filename);
              const cap = caption.trim() ? `<figcaption>${escapeHtml(caption.trim())}</figcaption>` : "";
              insertHtml(`<figure><img src="${escapeHtml(m.url)}" alt="${alt}">${cap}</figure><p><br></p>`);
              setCaption("");
              setPicker(false);
            }}
          />
        </div>
      ) : null}

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Article content"
        data-placeholder="Write your article here…"
        onInput={emit}
        onBlur={() => {
          rememberSelection();
          emit();
        }}
        onPaste={(e) => {
          // Paste as plain text so nothing unexpected comes in from other apps or web pages.
          e.preventDefault();
          const text = e.clipboardData.getData("text/plain");
          document.execCommand("insertText", false, text);
        }}
        className="article-prose editor-surface min-h-[22rem] max-w-none px-4 py-4 focus-visible:outline-none"
      />
    </div>
  );
}

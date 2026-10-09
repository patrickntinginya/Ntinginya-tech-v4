"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Loader2, Upload } from "lucide-react";
import { MAX_MEDIA_BYTES } from "@/lib/cms/media-validation";
import { btnDark, inputClass, labelClass } from "./ui";

export function MediaUploader() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setDone("");
    const form = new FormData(event.currentTarget);
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) return setError("Choose an image first.");
    if (file.size > MAX_MEDIA_BYTES) return setError("The file is larger than 5 MB.");

    setBusy(true);
    try {
      const response = await fetch("/api/admin/media", { method: "POST", body: form });
      const body = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!response.ok || !body.ok) {
        setError(body.error ?? "The upload failed. Please try again.");
      } else {
        setDone("Uploaded.");
        formRef.current?.reset();
        router.refresh();
      }
    } catch {
      setError("The upload failed. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="media-file" className={labelClass}>
          Image (JPEG, PNG or WebP, up to 5 MB)
        </label>
        <input
          id="media-file"
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="block w-full rounded-lg border border-deep/30 bg-white p-2.5 font-sans text-sm file:mr-3 file:min-h-10 file:rounded-md file:border-0 file:bg-deep file:px-4 file:font-semibold file:text-white"
        />
      </div>
      <div>
        <label htmlFor="media-alt" className={labelClass}>
          Description for screen readers (alt text)
        </label>
        <input id="media-alt" name="alt" type="text" maxLength={200} className={inputClass} />
      </div>
      <div aria-live="polite">
        {error ? <p role="alert" className="font-sans text-sm text-red-800">{error}</p> : null}
        {done ? <p role="status" className="font-sans text-sm text-field-800">{done}</p> : null}
      </div>
      <button type="submit" disabled={busy} className={btnDark}>
        {busy ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Upload aria-hidden="true" className="h-4 w-4" />}
        {busy ? "Uploading" : "Upload"}
      </button>
    </form>
  );
}

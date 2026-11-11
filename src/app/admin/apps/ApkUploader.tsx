"use client";

import { useState } from "react";
import { Upload, FileCheck2 } from "lucide-react";
import { Upload as TusUpload } from "tus-js-client";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { createReleaseAction } from "./actions";
import { btnDark, inputClass, labelClass } from "@/components/admin/ui";

const MAX_SIZE = 157286400;
const APK_MIME = "application/vnd.android.package-archive";

export function ApkUploader({ appId }: { appId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [version, setVersion] = useState("");
  const [versionCode, setVersionCode] = useState("");
  const [notes, setNotes] = useState("");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!file) {
      setError("Choose an APK file first.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".apk") || file.size > MAX_SIZE || file.size < 1) {
      setError("Choose a valid APK file smaller than 150 MB.");
      return;
    }

    if (!/^[0-9A-Za-z][0-9A-Za-z.+_-]{0,49}$/.test(version)) {
      setError("Enter a valid version, for example 1.0.0.");
      return;
    }

    const code = Number(versionCode);
    if (!Number.isSafeInteger(code) || code < 1) {
      setError("Version code must be a positive integer.");
      return;
    }

    setBusy(true);
    let storagePath = "";

    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error("Your session has expired. Sign in again.");
      }

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!url) throw new Error("Supabase URL is missing.");

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      storagePath = `${appId}/${crypto.randomUUID()}-${safeName}`;

      await new Promise<void>((resolve, reject) => {
        const upload = new TusUpload(file, {
          endpoint: `${url}/storage/v1/upload/resumable`,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          chunkSize: 6 * 1024 * 1024,
          headers: {
            authorization: `Bearer ${session.access_token}`,
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
          metadata: {
            bucketName: "apks",
            objectName: storagePath,
            contentType: APK_MIME,
            cacheControl: "3600",
          },
          onError: reject,
          onProgress: (uploaded, total) => {
            setProgress(Math.round((uploaded / total) * 100));
          },
          onSuccess: () => resolve(),
        });

        upload.start();
      });

      const result = await createReleaseAction({
        appId,
        version,
        versionCode: code,
        releaseNotes: notes,
        storagePath,
        fileName: file.name,
        sizeBytes: file.size,
      });

      if (result?.error) {
        await supabase.storage.from("apks").remove([storagePath]);
        storagePath = "";
        throw new Error(result.error);
      }

      setMessage("APK uploaded successfully and saved as DRAFT.");
      setFile(null);
      setVersion("");
      setVersionCode("");
      setNotes("");
      setProgress(0);
      const input = document.getElementById("apk-file") as HTMLInputElement | null;
      if (input) input.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      if (storagePath) {
        try {
          const supabase = createSupabaseBrowserClient();
          await supabase.storage.from("apks").remove([storagePath]);
        } catch {}
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-5 space-y-4">
      <div>
        <label className={labelClass} htmlFor={`version-${appId}`}>Version</label>
        <input id={`version-${appId}`} className={inputClass} value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.0.0" required />
      </div>

      <div>
        <label className={labelClass} htmlFor={`code-${appId}`}>Version code</label>
        <input id={`code-${appId}`} className={inputClass} type="number" min="1" step="1" value={versionCode} onChange={(e) => setVersionCode(e.target.value)} required />
      </div>

      <div>
        <label className={labelClass} htmlFor={`notes-${appId}`}>Release notes</label>
        <textarea id={`notes-${appId}`} className={inputClass} rows={3} maxLength={10000} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <div>
        <label className={labelClass} htmlFor="apk-file">APK file (max 150 MB)</label>
        <input id="apk-file" className={inputClass} type="file" accept=".apk,application/vnd.android.package-archive" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
        {file ? <p className="mt-1 flex items-center gap-2 text-sm"><FileCheck2 className="h-4 w-4" />{file.name} · {(file.size / 1048576).toFixed(1)} MB</p> : null}
      </div>

      {busy ? (
        <div>
          <div className="mb-1 flex justify-between text-sm"><span>Uploading APK…</span><span>{progress}%</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-deep/10"><div className="h-full bg-field-700 transition-all" style={{ width: `${progress}%` }} /></div>
        </div>
      ) : null}

      {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
      {message ? <p role="status" className="text-sm text-field-800">{message}</p> : null}

      <button className={btnDark} type="submit" disabled={busy}>
        <Upload className="h-4 w-4" /> {busy ? "Uploading…" : "Upload APK"}
      </button>
    </form>
  );
}

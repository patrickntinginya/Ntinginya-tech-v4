"use client";

import { useState, useTransition } from "react";
import { setReleaseStatusAction } from "./actions";
import { btnOutline } from "@/components/admin/ui";

export function ReleaseActions({
  releaseId,
  status,
}: {
  releaseId: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function change(next: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
    if (next === "PUBLISHED" && !window.confirm("Publish this APK release?")) return;

    setError("");
    startTransition(async () => {
      const result = await setReleaseStatusAction(releaseId, next);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "PUBLISHED" ? (
        <button disabled={pending} onClick={() => change("PUBLISHED")} className={btnOutline}>
          Publish
        </button>
      ) : (
        <button disabled={pending} onClick={() => change("DRAFT")} className={btnOutline}>
          Unpublish
        </button>
      )}
      {status !== "ARCHIVED" ? (
        <button disabled={pending} onClick={() => change("ARCHIVED")} className={btnOutline}>
          Archive
        </button>
      ) : null}
      {error ? <span role="alert" className="w-full text-xs text-red-700">{error}</span> : null}
    </div>
  );
}

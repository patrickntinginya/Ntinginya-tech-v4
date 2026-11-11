"use client";

import { useState, useTransition } from "react";
import { setAppPublishedAction } from "./actions";
import { btnOutline } from "@/components/admin/ui";

export function AppPublishAction({
  appId,
  published,
}: {
  appId: string;
  published: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function toggle() {
    const next = !published;

    if (
      next &&
      !window.confirm("Publish this app to the public apps catalog?")
    ) return;

    setError("");

    startTransition(async () => {
      const result = await setAppPublishedAction(appId, next);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={toggle}
        className={btnOutline}
      >
        {pending ? "Saving..." : published ? "Hide app" : "Publish app"}
      </button>
      {error ? (
        <span role="alert" className="text-xs text-red-700">{error}</span>
      ) : null}
    </div>
  );
}

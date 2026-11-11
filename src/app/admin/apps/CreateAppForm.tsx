"use client";

import { useState, useTransition } from "react";
import { createAppAction } from "./actions";
import { inputClass, labelClass, btnDark } from "@/components/admin/ui";

export function CreateAppForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function submit(formData: FormData) {
    setMessage("");
    startTransition(async () => {
      const result = await createAppAction(formData);
      setMessage(result.error ?? "App created successfully.");
      if (result.success) {
        const form = document.getElementById("create-app-form") as HTMLFormElement;
        form?.reset();
      }
    });
  }

  return (
    <form id="create-app-form" action={submit} className="mt-4 grid gap-4 sm:grid-cols-2">
      <div>
        <label className={labelClass}>App name</label>
        <input className={inputClass} name="name" maxLength={120} required placeholder="Ntinginya Life OS" />
      </div>
      <div>
        <label className={labelClass}>URL slug</label>
        <input className={inputClass} name="slug" maxLength={100} required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="ntinginya-life-os" />
      </div>
      <div className="sm:col-span-2">
        <label className={labelClass}>Description</label>
        <textarea className={inputClass} name="description" maxLength={5000} rows={3} />
      </div>
      <div className="sm:col-span-2">
        <label className={labelClass}>Icon URL (optional)</label>
        <input className={inputClass} name="icon_url" type="url" placeholder="https://example.com/icon.png" />
      </div>
      {message ? <p role="status" className="text-sm sm:col-span-2">{message}</p> : null}
      <div className="sm:col-span-2">
        <button className={btnDark} disabled={pending}>{pending ? "Creating…" : "Create app"}</button>
      </div>
    </form>
  );
}

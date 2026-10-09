"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { contactInfo } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/FormField";
import { cn } from "@/lib/cn";

type Fields = {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
};
type FieldName = keyof Fields;
type Status = "idle" | "sending" | "success" | "unconfigured" | "rate_limited" | "error";

const emptyFields: Fields = { name: "", email: "", phone: "", company: "", subject: "", message: "" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[\d\s().-]{7,25}$/;

function validate(values: Fields): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!emailPattern.test(values.email.trim())) errors.email = "Enter a valid email address, like name@example.com.";
  if (values.phone.trim() && !phonePattern.test(values.phone.trim())) errors.phone = "Enter a phone number using digits, like +255 784 000 000.";
  if (!values.message.trim()) errors.message = "Tell us how we can help.";
  return errors;
}

/** Services people can pick. The chosen text is stored as the message subject, exactly as before. */
const serviceOptions = [
  "Software or a custom solution",
  "Web application",
  "Mobile application",
  "AI solution",
  "Business system",
  "Digital transformation",
  "Ntinginya Business Manager",
  "Agriculture and livestock technology",
  "Ntinginya Masterclass",
  "Research or partnership",
  "General enquiry",
];

export function ContactForm({ defaultSubject = "" }: { defaultSubject?: string }) {
  const [values, setValues] = useState<Fields>({ ...emptyFields, subject: defaultSubject });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  function onChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as FieldName]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const found = validate(values);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as FieldName[])[0];
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus();
      return;
    }

    const honeypot = (new FormData(event.currentTarget).get("website") as string | null) ?? "";
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot }),
      });
      if (response.ok) {
        setStatus("success");
        setValues(emptyFields);
      } else if (response.status === 501) {
        setStatus("unconfigured");
      } else if (response.status === 429) {
        setStatus("rate_limited");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const mailto = `mailto:${contactInfo.email}?subject=${encodeURIComponent(values.subject || "Enquiry from website")}&body=${encodeURIComponent(
    `${values.message}\n\n${values.name}${values.company ? `, ${values.company}` : ""}${values.phone ? `\n${values.phone}` : ""}`,
  )}`;

  if (status === "success") {
    return (
      <div role="status" className="rounded-2xl border border-field-700/40 bg-field-100 p-8">
        <CheckCircle2 aria-hidden="true" className="h-8 w-8 text-field-700" />
        <h3 className="mt-4 font-sans text-2xl font-semibold tracking-tight">Message received</h3>
        <p className="mt-2 text-base leading-relaxed text-deep/85">Thank you for contacting Ntinginya Tech. We will reply to the email address you gave us.</p>
        <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" aria-describedby="form-status">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Name" required error={errors.name}>
          <input
            id="field-name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={onChange}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "error-name" : undefined}
            className={inputClass}
          />
        </Field>
        <Field name="email" label="Email" required error={errors.email}>
          <input
            id="field-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={onChange}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "error-email" : undefined}
            className={inputClass}
          />
        </Field>
        <Field name="phone" label="Phone" error={errors.phone}>
          <input
            id="field-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            onChange={onChange}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "error-phone" : undefined}
            className={inputClass}
          />
        </Field>
        <Field name="company" label="Company">
          <input id="field-company" name="company" type="text" autoComplete="organization" value={values.company} onChange={onChange} className={inputClass} />
        </Field>
      </div>

      <Field name="subject" label="Service">
        <select id="field-subject" name="subject" value={values.subject} onChange={onChange} className={inputClass}>
          <option value="">Choose a service</option>
          {/* A service passed in the link (for example from the Solutions page) is kept even if it is not in the list. */}
          {values.subject && !serviceOptions.includes(values.subject) ? (
            <option value={values.subject}>{values.subject}</option>
          ) : null}
          {serviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>

      <Field name="message" label="Message" required error={errors.message}>
        <textarea
          id="field-message"
          name="message"
          rows={6}
          maxLength={5000}
          value={values.message}
          onChange={onChange}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "error-message" : undefined}
          className={cn(inputClass, "resize-y")}
        />
      </Field>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="field-website">Website</label>
        <input id="field-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div id="form-status" aria-live="polite">
        {status === "unconfigured" ? (
          <p className="rounded-lg border border-maize-700/50 bg-maize-300/40 p-4 font-sans text-[0.9375rem] leading-relaxed">
            Online sending is not switched on yet, so your message was not sent.{" "}
            <a href={mailto} className="font-semibold underline underline-offset-4">
              Send it by email instead
            </a>{" "}
            using {contactInfo.email}.
          </p>
        ) : null}
        {status === "rate_limited" ? (
          <p role="alert" className="rounded-lg border border-maize-700/50 bg-maize-300/40 p-4 font-sans text-[0.9375rem] leading-relaxed">
            You have sent several messages in a short time. Please wait a few minutes and try again, or{" "}
            <a href={mailto} className="font-semibold underline underline-offset-4">
              email us directly
            </a>
            .
          </p>
        ) : null}
        {status === "error" ? (
          <p role="alert" className="rounded-lg border border-red-700/40 bg-red-50 p-4 font-sans text-[0.9375rem] leading-relaxed text-red-900">
            Something went wrong and your message was not sent. Please try again, or{" "}
            <a href={mailto} className="font-semibold underline underline-offset-4">
              email us directly
            </a>
            .
          </p>
        ) : null}
      </div>

      <Button type="submit" variant="dark" size="lg" disabled={status === "sending"} className="w-full sm:w-auto">
        {status === "sending" ? (
          <>
            <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />
            Sending
          </>
        ) : (
          "Talk to Ntinginya Tech"
        )}
      </Button>
    </form>
  );
}

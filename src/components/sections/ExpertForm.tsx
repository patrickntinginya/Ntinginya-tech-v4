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
  profession: string;
  skills: string;
  experience: string;
  linkedin: string;
  portfolio: string;
  interest: string;
};
type FieldName = keyof Fields;
type Status = "idle" | "sending" | "success" | "unconfigured" | "rate_limited" | "error";

const emptyFields: Fields = {
  name: "",
  email: "",
  profession: "",
  skills: "",
  experience: "",
  linkedin: "",
  portfolio: "",
  interest: "",
};

const interestOptions = [
  "Software and web development",
  "Mobile applications",
  "AI and data",
  "Design and user experience",
  "Agriculture and livestock expertise",
  "Research and innovation",
  "Marketing and communication",
  "Other",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function validate(values: Fields): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!emailPattern.test(values.email.trim())) errors.email = "Enter a valid email address, like name@example.com.";
  if (!values.profession.trim()) errors.profession = "Tell us your profession.";
  if (!values.skills.trim()) errors.skills = "List a few of your main skills.";
  if (!values.interest) errors.interest = "Choose the area you are most interested in.";
  if (values.linkedin.trim() && !isHttpUrl(values.linkedin.trim())) errors.linkedin = "Enter a full link starting with https://";
  if (values.portfolio.trim() && !isHttpUrl(values.portfolio.trim())) errors.portfolio = "Enter a full link starting with https://";
  return errors;
}

/**
 * The application travels through the existing /api/contact pipeline: it is validated on the server,
 * stored in the existing `messages` table (visible in /admin/messages) and emailed through Resend.
 * The structured answers are written into the message text so no database change is needed.
 */
function buildMessage(v: Fields): string {
  return [
    "Expert Network application",
    "",
    `Profession: ${v.profession.trim()}`,
    `Area of interest: ${v.interest}`,
    `Skills: ${v.skills.trim()}`,
    `Experience: ${v.experience.trim() || "-"}`,
    `LinkedIn: ${v.linkedin.trim() || "-"}`,
    `Portfolio: ${v.portfolio.trim() || "-"}`,
  ].join("\n");
}

export function ExpertForm() {
  const [values, setValues] = useState<Fields>(emptyFields);
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
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          subject: `Expert Network: ${values.profession}`.slice(0, 200),
          message: buildMessage(values),
          website: honeypot,
        }),
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

  const mailto = `mailto:${contactInfo.email}?subject=${encodeURIComponent("Expert Network application")}&body=${encodeURIComponent(
    buildMessage(values) + `\n\n${values.name}`,
  )}`;

  if (status === "success") {
    return (
      <div role="status" className="rounded-card border border-field-700/40 bg-field-100 p-8">
        <CheckCircle2 aria-hidden="true" className="h-8 w-8 text-field-700" />
        <h3 className="mt-4 font-sans text-2xl font-semibold tracking-tight">Thank you for your interest</h3>
        <p className="mt-2 text-base leading-relaxed text-deep/85">
          We have received your details. We will contact you at the email address you gave us if there is a fit with
          our work.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
          Submit another application
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" aria-describedby="expert-form-status">
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
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="profession" label="Profession" required error={errors.profession}>
          <input
            id="field-profession"
            name="profession"
            type="text"
            autoComplete="organization-title"
            maxLength={120}
            value={values.profession}
            onChange={onChange}
            aria-invalid={errors.profession ? true : undefined}
            aria-describedby={errors.profession ? "error-profession" : undefined}
            className={inputClass}
          />
        </Field>
        <Field name="interest" label="Area of interest" required error={errors.interest}>
          <select
            id="field-interest"
            name="interest"
            value={values.interest}
            onChange={onChange}
            aria-invalid={errors.interest ? true : undefined}
            aria-describedby={errors.interest ? "error-interest" : undefined}
            className={inputClass}
          >
            <option value="">Choose an area</option>
            {interestOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field name="skills" label="Skills" required error={errors.skills} hint="For example: React, farm management, data analysis.">
        <textarea
          id="field-skills"
          name="skills"
          rows={3}
          maxLength={600}
          value={values.skills}
          onChange={onChange}
          aria-invalid={errors.skills ? true : undefined}
          aria-describedby={errors.skills ? "error-skills" : "hint-skills"}
          className={cn(inputClass, "resize-y")}
        />
      </Field>

      <Field name="experience" label="Experience" hint="Years of experience and the kind of work you have done." error={errors.experience}>
        <textarea
          id="field-experience"
          name="experience"
          rows={3}
          maxLength={1200}
          value={values.experience}
          onChange={onChange}
          aria-describedby="hint-experience"
          className={cn(inputClass, "resize-y")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="linkedin" label="LinkedIn" error={errors.linkedin}>
          <input
            id="field-linkedin"
            name="linkedin"
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="https://"
            value={values.linkedin}
            onChange={onChange}
            aria-invalid={errors.linkedin ? true : undefined}
            aria-describedby={errors.linkedin ? "error-linkedin" : undefined}
            className={inputClass}
          />
        </Field>
        <Field name="portfolio" label="Portfolio" error={errors.portfolio}>
          <input
            id="field-portfolio"
            name="portfolio"
            type="url"
            inputMode="url"
            placeholder="https://"
            value={values.portfolio}
            onChange={onChange}
            aria-invalid={errors.portfolio ? true : undefined}
            aria-describedby={errors.portfolio ? "error-portfolio" : undefined}
            className={inputClass}
          />
        </Field>
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="field-website">Website</label>
        <input id="field-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div id="expert-form-status" aria-live="polite">
        {status === "unconfigured" ? (
          <p className="rounded-control border border-maize-700/50 bg-maize-300/40 p-4 font-sans text-[0.9375rem] leading-relaxed">
            Online sending is not switched on yet, so your details were not sent.{" "}
            <a href={mailto} className="font-semibold underline underline-offset-4">
              Send them by email instead
            </a>{" "}
            using {contactInfo.email}.
          </p>
        ) : null}
        {status === "rate_limited" ? (
          <p role="alert" className="rounded-control border border-maize-700/50 bg-maize-300/40 p-4 font-sans text-[0.9375rem] leading-relaxed">
            You have sent several messages in a short time. Please wait a few minutes and try again, or{" "}
            <a href={mailto} className="font-semibold underline underline-offset-4">
              email us directly
            </a>
            .
          </p>
        ) : null}
        {status === "error" ? (
          <p role="alert" className="rounded-control border border-red-700/40 bg-red-50 p-4 font-sans text-[0.9375rem] leading-relaxed text-red-900">
            Something went wrong and your details were not sent. Please try again, or{" "}
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
          "Join the network"
        )}
      </Button>
    </form>
  );
}

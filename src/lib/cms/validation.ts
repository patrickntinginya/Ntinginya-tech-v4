import { STATUS_KEYS, isEntryKind, kindMeta, type EntryKind } from "@/content/entry-kinds";
import { isValidSlug, slugify } from "./slug";

export const POST_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export const LIMITS = {
  title: 200,
  slug: 100,
  excerpt: 400,
  content: 200_000,
  seoTitle: 70,
  seoDescription: 170,
  url: 600,
  authorName: 120,
  tag: 40,
  tags: 12,
} as const;

/** "AI, Irrigation , ai" -> ["ai", "irrigation"]. Lowercase, de-duplicated, length-limited. */
export function parseTags(value: unknown): string[] {
  if (typeof value !== "string") return [];
  const out: string[] = [];
  for (const raw of value.split(",")) {
    const tag = raw
      .toLowerCase()
      .replace(/[^\p{L}\p{N}&+ -]+/gu, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, LIMITS.tag);
    if (tag && !out.includes(tag)) out.push(tag);
    if (out.length >= LIMITS.tags) break;
  }
  return out;
}

/** Accepts an ISO date string; returns it normalised, or null. */
export function parseDate(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const d = new Date(value.trim());
  if (Number.isNaN(d.getTime())) return null;
  const year = d.getUTCFullYear();
  return year >= 2000 && year <= 2100 ? d.toISOString() : null;
}

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Only https URLs (or site-relative paths) are accepted for images. */
export function cleanImageUrl(value: unknown): string | null {
  const v = str(value, LIMITS.url);
  if (!v) return null;
  try {
    const u = new URL(v);
    return u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category_id: string | null;
  status: PostStatus;
  seo_title: string | null;
  seo_description: string | null;
  social_image: string | null;
  tags: string[];
  author_name: string | null;
  published_at: string | null;
  featured: boolean;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (v: unknown): v is string => typeof v === "string" && UUID.test(v);

export function parsePostForm(form: FormData): { ok: true; value: PostInput } | { ok: false; error: string } {
  const title = str(form.get("title"), LIMITS.title);
  if (!title) return { ok: false, error: "Enter a title." };

  const rawSlug = str(form.get("slug"), LIMITS.slug);
  const slug = slugify(rawSlug || title);
  if (!slug || !isValidSlug(slug)) return { ok: false, error: "The slug needs letters or numbers." };

  const statusRaw = str(form.get("status"), 20).toUpperCase();
  const status = (POST_STATUSES as readonly string[]).includes(statusRaw) ? (statusRaw as PostStatus) : "DRAFT";

  const categoryRaw = str(form.get("category_id"), 60);
  if (categoryRaw && !isUuid(categoryRaw)) return { ok: false, error: "Choose a valid category." };

  const content = typeof form.get("content") === "string" ? (form.get("content") as string).slice(0, LIMITS.content) : "";

  return {
    ok: true,
    value: {
      title,
      slug,
      excerpt: str(form.get("excerpt"), LIMITS.excerpt) || null,
      content,
      featured_image: cleanImageUrl(form.get("featured_image")),
      category_id: categoryRaw || null,
      status,
      seo_title: str(form.get("seo_title"), LIMITS.seoTitle) || null,
      seo_description: str(form.get("seo_description"), LIMITS.seoDescription) || null,
      social_image: cleanImageUrl(form.get("social_image")),
      tags: parseTags(form.get("tags")),
      author_name: str(form.get("author_name"), LIMITS.authorName) || null,
      published_at: parseDate(form.get("published_at")),
      featured: form.get("featured") === "on",
    },
  };
}

// ---- Contact form -----------------------------------------------------------------------

export const CONTACT_LIMITS = { name: 120, email: 200, phone: 40, company: 160, subject: 200, message: 5000 } as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ContactInput = { name: string; email: string; phone: string; company: string; subject: string; message: string };

function cleanLine(value: unknown, max: number): string {
  // Strip control characters and collapse newlines so nothing can inject email headers.
  return typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max) : "";
}

export function parseContact(body: Record<string, unknown>): { ok: true; value: ContactInput } | { ok: false } {
  const message =
    typeof body.message === "string" ? body.message.replace(/\u0000/g, "").trim().slice(0, CONTACT_LIMITS.message) : "";
  const value: ContactInput = {
    name: cleanLine(body.name, CONTACT_LIMITS.name),
    email: cleanLine(body.email, CONTACT_LIMITS.email),
    phone: cleanLine(body.phone, CONTACT_LIMITS.phone),
    company: cleanLine(body.company, CONTACT_LIMITS.company),
    subject: cleanLine(body.subject, CONTACT_LIMITS.subject),
    message,
  };
  if (!value.name || !value.message || value.message.length < 5 || !EMAIL_PATTERN.test(value.email)) return { ok: false };
  return { ok: true, value };
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ---- Content entries (products, solutions, masterclass sessions, R&D items) -------------------

export const ENTRY_LIMITS = {
  title: 200,
  slug: 100,
  summary: 400,
  body: 8000,
  category: 80,
  feature: 120,
  features: 20,
  cta: 80,
  location: 160,
  byline: 160,
} as const;

export type EntryInput = {
  kind: EntryKind;
  slug: string;
  title: string;
  summary: string | null;
  body: string | null;
  image: string | null;
  category: string | null;
  status_label: string;
  features: string[];
  cta_label: string | null;
  cta_url: string | null;
  event_at: string | null;
  location: string | null;
  byline: string | null;
  seo_title: string | null;
  seo_description: string | null;
  featured: boolean;
  is_published: boolean;
  sort_order: number;
};

/** https links and site-relative paths ("/contact?subject=...") only. Anything else is dropped. */
export function cleanLink(value: unknown): string | null {
  const v = str(value, LIMITS.url);
  if (!v) return null;
  if (v.startsWith("/") && !v.startsWith("//") && !/[\u0000-\u001f\s]/.test(v)) return v;
  try {
    const u = new URL(v);
    return u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}

/** One feature per line. Control characters are stripped, duplicates dropped. */
export function parseLines(value: unknown, max: number, each: number): string[] {
  if (typeof value !== "string") return [];
  const out: string[] = [];
  for (const raw of value.split(/\r?\n/)) {
    const line = raw.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, each);
    if (line && !out.includes(line)) out.push(line);
    if (out.length >= max) break;
  }
  return out;
}

export function parseEntryForm(form: FormData): { ok: true; value: EntryInput } | { ok: false; error: string } {
  const kindRaw = form.get("kind");
  if (!isEntryKind(kindRaw)) return { ok: false, error: "Choose what kind of content this is." };
  const kind = kindRaw;

  const title = str(form.get("title"), ENTRY_LIMITS.title);
  if (!title) return { ok: false, error: "Enter a title." };

  const slug = slugify(str(form.get("slug"), ENTRY_LIMITS.slug) || title);
  if (!slug || !isValidSlug(slug)) return { ok: false, error: "The slug needs letters or numbers." };

  const statusRaw = str(form.get("status_label"), 30);
  if (!(STATUS_KEYS as string[]).includes(statusRaw)) return { ok: false, error: "Choose a status." };

  const categoryRaw = str(form.get("category"), ENTRY_LIMITS.category);
  const allowed = kindMeta[kind].categories;
  if (allowed.length > 0 && categoryRaw && !allowed.includes(categoryRaw)) return { ok: false, error: "Choose a valid type." };
  if (kind === "research" && !categoryRaw) return { ok: false, error: "Choose the type of R&D item." };

  const ctaUrlRaw = str(form.get("cta_url"), LIMITS.url);
  const ctaUrl = cleanLink(ctaUrlRaw);
  if (ctaUrlRaw && !ctaUrl) return { ok: false, error: "The link must start with https:// or be a path such as /contact." };

  const sortRaw = Number.parseInt(str(form.get("sort_order"), 6) || "0", 10);

  return {
    ok: true,
    value: {
      kind,
      slug,
      title,
      summary: str(form.get("summary"), ENTRY_LIMITS.summary) || null,
      body: str(form.get("body"), ENTRY_LIMITS.body) || null,
      image: cleanImageUrl(form.get("image")),
      category: categoryRaw || null,
      status_label: statusRaw,
      features: parseLines(form.get("features"), ENTRY_LIMITS.features, ENTRY_LIMITS.feature),
      cta_label: str(form.get("cta_label"), ENTRY_LIMITS.cta) || null,
      cta_url: ctaUrl,
      event_at: parseDate(form.get("event_at")),
      location: str(form.get("location"), ENTRY_LIMITS.location) || null,
      byline: str(form.get("byline"), ENTRY_LIMITS.byline) || null,
      seo_title: str(form.get("seo_title"), LIMITS.seoTitle) || null,
      seo_description: str(form.get("seo_description"), LIMITS.seoDescription) || null,
      featured: form.get("featured") === "on",
      is_published: form.get("is_published") === "on",
      sort_order: Number.isFinite(sortRaw) ? Math.max(-1000, Math.min(1000, sortRaw)) : 0,
    },
  };
}

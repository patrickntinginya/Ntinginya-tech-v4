import "server-only";
import { cache } from "react";
import { Box } from "lucide-react";
import type { Product } from "@/content/products";
import type { StatusKey } from "@/content/types";
import { STATUS_KEYS, type EntryKind } from "@/content/entry-kinds";
import { createSupabasePublicClient } from "@/lib/supabase/server";

/** A published, editor-managed entry (product, solution, masterclass session or R&D item). */
export type PublicEntry = {
  id: string;
  kind: EntryKind;
  slug: string;
  title: string;
  summary: string | null;
  body: string | null;
  image: string | null;
  category: string | null;
  status: StatusKey;
  features: string[];
  cta_label: string | null;
  cta_url: string | null;
  event_at: string | null;
  location: string | null;
  byline: string | null;
  seo_title: string | null;
  seo_description: string | null;
  featured: boolean;
  sort_order: number;
  updated_at: string;
};

const COLUMNS =
  "id, kind, slug, title, summary, body, image, category, status_label, features, cta_label, cta_url, event_at, location, byline, seo_title, seo_description, featured, sort_order, updated_at";

type Row = Record<string, unknown> & { id: string; kind: EntryKind; slug: string; title: string; updated_at: string };

function toEntry(r: Row): PublicEntry {
  const status = (STATUS_KEYS as string[]).includes(r.status_label as string) ? (r.status_label as StatusKey) : "proposed";
  const str = (v: unknown) => (typeof v === "string" && v ? v : null);
  return {
    id: r.id,
    kind: r.kind,
    slug: r.slug,
    title: r.title,
    summary: str(r.summary),
    body: str(r.body),
    image: str(r.image),
    category: str(r.category),
    status,
    features: Array.isArray(r.features) ? (r.features as string[]) : [],
    cta_label: str(r.cta_label),
    cta_url: str(r.cta_url),
    event_at: str(r.event_at),
    location: str(r.location),
    byline: str(r.byline),
    seo_title: str(r.seo_title),
    seo_description: str(r.seo_description),
    featured: r.featured === true,
    sort_order: typeof r.sort_order === "number" ? r.sort_order : 0,
    updated_at: r.updated_at,
  };
}

/**
 * Published entries of one kind. Never throws: if Supabase is missing or the query fails, the page
 * simply shows its built-in content. `cache` removes duplicate queries within one render.
 */
export const listEntries = cache(async (kind: EntryKind, limit = 50, featuredOnly = false): Promise<PublicEntry[]> => {
  const client = createSupabasePublicClient();
  if (!client) return [];
  let query = client
    .from("content_entries")
    .select(COLUMNS)
    .eq("kind", kind)
    .eq("is_published", true) // RLS enforces this too; kept explicit on purpose.
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(Math.max(1, Math.min(limit, 100)));
  if (featuredOnly) query = query.eq("featured", true);
  const { data, error } = await query;
  if (error || !data) return [];
  return (data as unknown as Row[]).map(toEntry);
});

export const getEntry = cache(async (kind: EntryKind, slug: string): Promise<PublicEntry | null> => {
  const client = createSupabasePublicClient();
  if (!client) return null;
  const { data, error } = await client
    .from("content_entries")
    .select(COLUMNS)
    .eq("kind", kind)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error || !data) return null;
  return toEntry(data as unknown as Row);
});

/** Slug + last-modified for the sitemap. */
export async function listEntrySlugs(kind: EntryKind): Promise<Array<{ slug: string; updated_at: string }>> {
  const client = createSupabasePublicClient();
  if (!client) return [];
  const { data } = await client
    .from("content_entries")
    .select("slug, updated_at")
    .eq("kind", kind)
    .eq("is_published", true)
    .limit(500);
  return (data as Array<{ slug: string; updated_at: string }> | null) ?? [];
}

/** Database search over titles and summaries. Term is cleaned of PostgREST filter characters first. */
export async function searchEntries(term: string, limit = 12): Promise<PublicEntry[]> {
  const client = createSupabasePublicClient();
  const clean = term.replace(/[%*,()\\:"'`;{}]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
  if (!client || !clean) return [];
  const { data, error } = await client
    .from("content_entries")
    .select(COLUMNS)
    .eq("is_published", true)
    .or(`title.ilike.%${clean}%,summary.ilike.%${clean}%`)
    .limit(Math.max(1, Math.min(limit, 30)));
  if (error || !data) return [];
  return (data as unknown as Row[]).map(toEntry);
}

function statusNote(status: StatusKey): string {
  switch (status) {
    case "live":
      return "This product is available now.";
    case "mvp":
      return "This is an early version (MVP). It is not yet publicly available, and its features may change.";
    case "in-development":
      return "This is in development and is not yet publicly available.";
    case "proposed":
      return "Proposed. This has not launched, and plans may change as we learn.";
    default:
      return "Future. This has not launched and is not available yet.";
  }
}

/** Adapts a database product to the shape the existing product cards and detail page already use. */
export function entryToProduct(e: PublicEntry): Product {
  const group = e.status === "live" ? "live" : e.status === "mvp" || e.status === "in-development" ? "mvp" : "future";
  return {
    slug: e.slug,
    name: e.title,
    category: e.category ?? "Product",
    group,
    badges: [e.status],
    icon: Box,
    summary: e.summary ?? "",
    problem: e.body ?? "",
    users: [],
    scope: e.features,
    statusNote: statusNote(e.status),
    interestSubject: e.title,
    url: e.cta_url && /^https:\/\//i.test(e.cta_url) ? e.cta_url : undefined,
    image: e.image ?? undefined,
    featured: e.featured,
  };
}

/** Built-in products plus published database products. A database product with the same slug wins. */
export async function getAllProducts(builtIn: Product[]): Promise<Product[]> {
  const extra = (await listEntries("product", 50)).map(entryToProduct);
  const slugs = new Set(extra.map((p) => p.slug));
  return [...builtIn.filter((p) => !slugs.has(p.slug)), ...extra];
}

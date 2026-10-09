import "server-only";
import { createSupabasePublicClient } from "@/lib/supabase/server";
import { innovationTags } from "@/lib/innovation";

export type PublicCategory = { id: string; name: string; slug: string };

export type PublicPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  social_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string;
  updated_at: string;
  category: { name: string; slug: string } | null;
  author_name: string | null;
  tags: string[];
};

export const PAGE_SIZE = 9;

const LIST_COLUMNS =
  "id, title, slug, excerpt, featured_image, social_image, seo_title, seo_description, published_at, updated_at, author_id, author_name, tags, categories(name, slug)";

type Row = Record<string, unknown> & {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  updated_at: string;
  author_id: string | null;
  categories: { name: string; slug: string } | { name: string; slug: string }[] | null;
};

/** Removes characters that have a meaning inside PostgREST filter strings. */
export function cleanSearchTerm(input: string): string {
  return input.replace(/[%*,()\\:"'`;{}]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

async function withAuthors(rows: Row[]): Promise<PublicPost[]> {
  const client = createSupabasePublicClient();
  const ids = Array.from(new Set(rows.map((r) => r.author_id).filter((v): v is string => Boolean(v))));
  const names = new Map<string, string>();
  if (client && ids.length) {
    const { data } = await client.from("authors_public").select("id, full_name").in("id", ids);
    (data ?? []).forEach((a: { id: string; full_name: string | null }) => {
      if (a.full_name) names.set(a.id, a.full_name);
    });
  }
  return rows.map((r) => {
    const cat = Array.isArray(r.categories) ? r.categories[0] ?? null : r.categories;
    return {
      id: r.id,
      title: r.title,
      slug: r.slug,
      excerpt: (r.excerpt as string | null) ?? null,
      content: (r.content as string | undefined) ?? "",
      featured_image: (r.featured_image as string | null) ?? null,
      social_image: (r.social_image as string | null) ?? null,
      seo_title: (r.seo_title as string | null) ?? null,
      seo_description: (r.seo_description as string | null) ?? null,
      published_at: r.published_at,
      updated_at: r.updated_at,
      category: cat,
      author_name: (r.author_name as string | null) || (r.author_id ? names.get(r.author_id) ?? null : null),
      tags: Array.isArray(r.tags) ? (r.tags as string[]) : [],
    };
  });
}

export async function getPublicCategories(): Promise<PublicCategory[]> {
  const client = createSupabasePublicClient();
  if (!client) return [];
  const { data } = await client.from("categories").select("id, name, slug").order("name");
  return (data as PublicCategory[] | null) ?? [];
}

export async function listPublishedPosts(opts: {
  q?: string;
  categorySlug?: string;
  page?: number;
}): Promise<{ posts: PublicPost[]; total: number; page: number; pageCount: number }> {
  const client = createSupabasePublicClient();
  const page = Math.max(1, Math.floor(opts.page ?? 1));
  if (!client) return { posts: [], total: 0, page, pageCount: 1 };

  let categoryId: string | null = null;
  if (opts.categorySlug) {
    const { data } = await client.from("categories").select("id").eq("slug", opts.categorySlug).maybeSingle();
    if (!data) return { posts: [], total: 0, page, pageCount: 1 };
    categoryId = (data as { id: string }).id;
  }

  const from = (page - 1) * PAGE_SIZE;
  let query = client
    .from("posts")
    .select(LIST_COLUMNS, { count: "exact" })
    .eq("status", "PUBLISHED") // RLS already enforces this; kept explicit on purpose.
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (categoryId) query = query.eq("category_id", categoryId);
  const term = opts.q ? cleanSearchTerm(opts.q) : "";
  if (term) query = query.or(`title.ilike.%${term}%,excerpt.ilike.%${term}%,tags.cs.{"${term.toLowerCase()}"}`);

  const { data, count, error } = await query;
  if (error) return { posts: [], total: 0, page, pageCount: 1 };
  const total = count ?? 0;
  return {
    posts: await withAuthors((data as unknown as Row[]) ?? []),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getPublishedPost(slug: string): Promise<PublicPost | null> {
  const client = createSupabasePublicClient();
  if (!client) return null;
  const { data } = await client
    .from("posts")
    .select(`${LIST_COLUMNS}, content`)
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  if (!data) return null;
  const [post] = await withAuthors([data as unknown as Row]);
  return post ?? null;
}

/** Slug + last-modified for every published post. Used by the sitemap. */
export async function listPublishedSlugs(): Promise<Array<{ slug: string; updated_at: string }>> {
  const client = createSupabasePublicClient();
  if (!client) return [];
  const { data } = await client
    .from("posts")
    .select("slug, updated_at")
    .eq("status", "PUBLISHED")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(1000);
  return (data as Array<{ slug: string; updated_at: string }> | null) ?? [];
}

export async function getRelatedPosts(post: PublicPost, limit = 3): Promise<PublicPost[]> {
  const { posts } = await listPublishedPosts({ categorySlug: post.category?.slug, page: 1 });
  return posts.filter((p) => p.id !== post.id).slice(0, limit);
}

/**
 * Published articles for the Innovation Hub: any article tagged with one of the Innovation topics,
 * or with a single topic when `topicTag` is given. Same table, same RLS, no new schema.
 * Tag values come from the fixed list in lib/innovation.ts, never from visitor input.
 */
export async function listInnovationPosts(opts: {
  topicTag?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ posts: PublicPost[]; total: number; page: number; pageCount: number }> {
  const client = createSupabasePublicClient();
  const page = Math.max(1, Math.floor(opts.page ?? 1));
  const pageSize = Math.max(1, Math.min(opts.pageSize ?? PAGE_SIZE, 24));
  if (!client) return { posts: [], total: 0, page, pageCount: 1 };

  const from = (page - 1) * pageSize;
  let query = client
    .from("posts")
    .select(LIST_COLUMNS, { count: "exact" })
    .eq("status", "PUBLISHED")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (opts.topicTag && innovationTags.includes(opts.topicTag)) {
    query = query.filter("tags", "cs", `{"${opts.topicTag}"}`);
  } else {
    query = query.filter("tags", "ov", `{${innovationTags.map((t) => `"${t}"`).join(",")}}`);
  }

  const { data, count, error } = await query;
  if (error) return { posts: [], total: 0, page, pageCount: 1 };
  const total = count ?? 0;
  return {
    posts: await withAuthors((data as unknown as Row[]) ?? []),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/**
 * Featured published articles (flag set in the admin), newest first. Returns [] on any error,
 * for example before the Phase 2 migration has been run, so the site never breaks.
 */
export async function getFeaturedPosts(limit = 1): Promise<PublicPost[]> {
  const client = createSupabasePublicClient();
  if (!client) return [];
  const { data, error } = await client
    .from("posts")
    .select(LIST_COLUMNS)
    .eq("status", "PUBLISHED")
    .eq("featured", true)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(Math.max(1, Math.min(limit, 6)));
  if (error || !data) return [];
  return withAuthors(data as unknown as Row[]);
}

/** Database search over published articles: title, excerpt and tags. Paginated; never loads everything. */
export async function searchPublishedPosts(term: string, limit = 12): Promise<PublicPost[]> {
  const clean = cleanSearchTerm(term);
  if (!clean) return [];
  const { posts } = await listPublishedPosts({ q: clean, page: 1 });
  return posts.slice(0, limit);
}

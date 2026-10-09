import "server-only";
import type { EntryKind } from "@/content/entry-kinds";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Read helpers for the admin area. They use the signed-in user's session, so RLS still applies. */

export type AdminPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category_id: string | null;
  author_id: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  seo_title: string | null;
  seo_description: string | null;
  social_image: string | null;
  tags: string[] | null;
  author_name: string | null;
  published_at: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminEntry = {
  id: string;
  kind: EntryKind;
  slug: string;
  title: string;
  summary: string | null;
  body: string | null;
  image: string | null;
  category: string | null;
  status_label: string;
  features: string[] | null;
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
  updated_at: string;
};

export type AdminCategory = { id: string; name: string; slug: string; description: string | null };
export type AdminMedia = {
  id: string;
  storage_path: string;
  url: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  alt_text: string | null;
  created_at: string;
};
export type AdminMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  email_status: string;
  created_at: string;
};
export type ActivityRow = {
  id: string;
  user_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  created_at: string;
  user_name?: string | null;
};

const count = async (q: PromiseLike<{ count: number | null }>) => (await q).count ?? 0;

export async function getDashboard() {
  const sb = await createSupabaseServerClient();
  const head = { count: "exact" as const, head: true };
  const [total, published, drafts, categories, media, unread, entries, scheduled, recentPosts, recentMessages, recentActivity] = await Promise.all([
    count(sb.from("posts").select("id", head)),
    count(sb.from("posts").select("id", head).eq("status", "PUBLISHED")),
    count(sb.from("posts").select("id", head).eq("status", "DRAFT")),
    count(sb.from("categories").select("id", head)),
    count(sb.from("media").select("id", head)),
    count(sb.from("messages").select("id", head).eq("is_read", false).eq("is_archived", false)),
    count(sb.from("content_entries").select("id", head)),
    count(sb.from("posts").select("id", head).eq("status", "PUBLISHED").gt("published_at", new Date().toISOString())),
    sb.from("posts").select("id, title, status, updated_at").order("updated_at", { ascending: false }).limit(5),
    sb.from("messages").select("id, name, subject, is_read, created_at").eq("is_archived", false).order("created_at", { ascending: false }).limit(5),
    sb.from("activity_log").select("id, user_id, action, target_type, created_at").order("created_at", { ascending: false }).limit(8),
  ]);
  return {
    stats: { total, published, drafts, categories, media, unread, entries, scheduled },
    recentPosts: (recentPosts.data ?? []) as Array<Pick<AdminPost, "id" | "title" | "status" | "updated_at">>,
    recentMessages: (recentMessages.data ?? []) as Array<Pick<AdminMessage, "id" | "name" | "subject" | "is_read" | "created_at">>,
    recentActivity: await attachNames((recentActivity.data ?? []) as ActivityRow[]),
  };
}

async function attachNames(rows: ActivityRow[]): Promise<ActivityRow[]> {
  const ids = Array.from(new Set(rows.map((r) => r.user_id).filter((v): v is string => Boolean(v))));
  if (!ids.length) return rows;
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("profiles").select("id, full_name, email").in("id", ids);
  const names = new Map<string, string>();
  (data ?? []).forEach((p: { id: string; full_name: string | null; email: string | null }) =>
    names.set(p.id, p.full_name || p.email || "Unknown"),
  );
  return rows.map((r) => ({ ...r, user_name: r.user_id ? names.get(r.user_id) ?? "Unknown" : "Removed user" }));
}

export async function listAdminPosts(opts: { status?: string; q?: string }) {
  const sb = await createSupabaseServerClient();
  let query = sb
    .from("posts")
    .select("id, title, slug, status, featured, published_at, updated_at, category_id, categories(name)")
    .order("updated_at", { ascending: false })
    .limit(200);
  if (opts.status && ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(opts.status)) query = query.eq("status", opts.status);
  const term = (opts.q ?? "").replace(/[%*,()\\:"'`;]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
  if (term) query = query.ilike("title", `%${term}%`);
  const { data } = await query;
  return (data ?? []) as unknown as Array<{
    id: string;
    title: string;
    slug: string;
    status: AdminPost["status"];
    featured: boolean;
    published_at: string | null;
    updated_at: string;
    categories: { name: string } | { name: string }[] | null;
  }>;
}

export async function getAdminPost(id: string): Promise<AdminPost | null> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("posts").select("*").eq("id", id).maybeSingle();
  return (data as AdminPost | null) ?? null;
}

export async function listAdminCategories(): Promise<Array<AdminCategory & { post_count: number }>> {
  const sb = await createSupabaseServerClient();
  const [{ data: cats }, { data: posts }] = await Promise.all([
    sb.from("categories").select("id, name, slug, description").order("name"),
    sb.from("posts").select("category_id").not("category_id", "is", null).limit(5000),
  ]);
  const counts = new Map<string, number>();
  (posts ?? []).forEach((p: { category_id: string | null }) => {
    if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
  });
  return ((cats ?? []) as AdminCategory[]).map((c) => ({ ...c, post_count: counts.get(c.id) ?? 0 }));
}

export async function listAdminMedia(q?: string, limit = 100): Promise<AdminMedia[]> {
  const sb = await createSupabaseServerClient();
  let query = sb
    .from("media")
    .select("id, storage_path, url, filename, mime_type, size_bytes, alt_text, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  const term = (q ?? "").replace(/[%*,()\\:"'`;]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
  if (term) query = query.ilike("filename", `%${term}%`);
  const { data } = await query;
  return (data ?? []) as AdminMedia[];
}

export async function listAdminMessages(filter?: string): Promise<AdminMessage[]> {
  const sb = await createSupabaseServerClient();
  let query = sb.from("messages").select("*").order("created_at", { ascending: false }).limit(200);
  if (filter === "unread") query = query.eq("is_read", false).eq("is_archived", false);
  else if (filter === "archived") query = query.eq("is_archived", true);
  else query = query.eq("is_archived", false);
  const { data } = await query;
  return (data ?? []) as AdminMessage[];
}

export async function listActivity(limit = 100): Promise<ActivityRow[]> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("activity_log")
    .select("id, user_id, action, target_type, target_id, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  return attachNames((data ?? []) as ActivityRow[]);
}

export async function getUnreadCount(): Promise<number> {
  const sb = await createSupabaseServerClient();
  return count(sb.from("messages").select("id", { count: "exact", head: true }).eq("is_read", false).eq("is_archived", false));
}

export async function getSettingsRow() {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return data as
    | {
        site_name: string | null;
        site_description: string | null;
        contact_email: string | null;
        contact_phone: string | null;
        whatsapp: string | null;
        default_seo_title: string | null;
        default_seo_description: string | null;
        social_links: Record<string, string> | null;
      }
    | null;
}

export async function listAdminEntries(kind?: string): Promise<AdminEntry[]> {
  const sb = await createSupabaseServerClient();
  let query = sb
    .from("content_entries")
    .select("*")
    .order("kind", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false })
    .limit(300);
  if (kind) query = query.eq("kind", kind);
  const { data } = await query;
  return (data ?? []) as AdminEntry[];
}

export async function getAdminEntry(id: string): Promise<AdminEntry | null> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("content_entries").select("*").eq("id", id).maybeSingle();
  return (data as AdminEntry | null) ?? null;
}

export function actionLabel(action: string): string {
  const map: Record<string, string> = {
    login: "Signed in",
    logout: "Signed out",
    post_created: "Created a post",
    post_updated: "Updated a post",
    post_published: "Published a post",
    post_unpublished: "Unpublished a post",
    post_archived: "Archived a post",
    post_deleted: "Deleted a post",
    category_created: "Created a category",
    category_updated: "Updated a category",
    category_deleted: "Deleted a category",
    media_uploaded: "Uploaded an image",
    media_deleted: "Deleted an image",
    message_marked_read: "Marked a message as read",
    message_marked_unread: "Marked a message as unread",
    message_deleted: "Deleted a message",
    message_archived: "Archived a message",
    message_unarchived: "Restored a message from the archive",
    entry_created: "Created a content entry",
    entry_updated: "Updated a content entry",
    entry_published: "Published a content entry",
    entry_unpublished: "Unpublished a content entry",
    entry_deleted: "Deleted a content entry",
    settings_updated: "Updated site settings",
  };
  return map[action] ?? action.replace(/_/g, " ");
}

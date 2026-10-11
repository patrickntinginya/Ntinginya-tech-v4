"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaffOrNull } from "@/lib/auth";
import { logActivity, type ActivityAction } from "@/lib/cms/activity";
import type { FormState } from "@/lib/cms/action-types";
import { htmlToText, sanitizeArticleHtml } from "@/lib/cms/sanitize";
import { isValidSlug, slugify } from "@/lib/cms/slug";
import { isUuid, parseEntryForm, parsePostForm } from "@/lib/cms/validation";
import { SOCIAL_KEYS } from "@/lib/settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Every action below re-checks the caller's role on the server, then talks to Supabase with the
 * caller's own session, so Row Level Security is a second, independent gate.
 */
async function context() {
  const staff = await getStaffOrNull();
  if (!staff) return null;
  return { staff, sb: await createSupabaseServerClient() };
}

function refreshPublic(...slugs: Array<string | null | undefined>) {
  // Pages that list or feature articles: new or changed content shows up without a rebuild.
  ["/", "/news", "/innovation", "/agriculture", "/search", "/sitemap.xml"].forEach((path) => revalidatePath(path));
  slugs.forEach((slug) => slug && revalidatePath(`/news/${slug}`));
}

const DUPLICATE = "23505";

// ---------------------------------------------------------------- posts

type ExistingPost = { status: string; published_at: string | null; slug: string };
type Intent = "draft" | "update" | "publish" | "unpublish" | "archive";
const INTENTS: Intent[] = ["draft", "update", "publish", "unpublish", "archive"];

export async function savePostAction(_prev: FormState, form: FormData): Promise<FormState> {
  const ctx = await context();
  if (!ctx) return { error: "You do not have permission to do that. Please sign in again." };
  const { staff, sb } = ctx;

  const rawId = form.get("id");
  const id = typeof rawId === "string" && rawId ? rawId : null;
  if (id && !isUuid(id)) return { error: "That post could not be found." };

  const intentRaw = typeof form.get("intent") === "string" ? (form.get("intent") as string) : "draft";
  const intent = (INTENTS as string[]).includes(intentRaw) ? (intentRaw as Intent) : "draft";

  const parsed = parsePostForm(form);
  if (!parsed.ok) return { error: parsed.error };
  const value = parsed.value;
  value.content = sanitizeArticleHtml(value.content);

  let existing: ExistingPost | null = null;
  if (id) {
    const { data } = await sb.from("posts").select("status, published_at, slug").eq("id", id).maybeSingle();
    if (!data) return { error: "That post no longer exists." };
    existing = data as ExistingPost;
  }

  const status =
    intent === "publish" ? "PUBLISHED" : intent === "archive" ? "ARCHIVED" : intent === "unpublish" || intent === "draft" ? "DRAFT" : ((existing?.status as "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined) ?? "DRAFT");

  if (status === "PUBLISHED" && !htmlToText(value.content)) {
    return { error: "Add some content before publishing.", fieldErrors: { content: "Content is empty." } };
  }

  // Friendly duplicate-slug check (the database unique constraint is the real guarantee).
  {
    let q = sb.from("posts").select("id", { count: "exact", head: true }).eq("slug", value.slug);
    if (id) q = q.neq("id", id);
    const { count } = await q;
    if ((count ?? 0) > 0) {
      return { error: "Another post already uses that slug. Change the slug and try again.", fieldErrors: { slug: "Already used." } };
    }
  }

  // An explicit date from the form wins; a future date schedules the post (RLS hides it until then).
  const chosenDate = value.published_at ?? existing?.published_at ?? null;
  const publishedAt = status === "PUBLISHED" ? chosenDate ?? new Date().toISOString() : chosenDate;
  const row = { ...value, status, published_at: publishedAt };

  let savedId = id;
  if (id) {
    const { error } = await sb.from("posts").update(row).eq("id", id);
    if (error) {
      console.error("[savePostAction UPDATE]", error.code, error.message);
      return { error: error.code === DUPLICATE ? "Another post already uses that slug." : "The post could not be saved. Nothing was changed." };
    }
  } else {
    const { data, error } = await sb.from("posts").insert({ ...row, author_id: staff.id }).select("id").single();
    if (error || !data) {
      console.error("[savePostAction INSERT]", error?.code, error?.message);
      return { error: error?.code === DUPLICATE ? "Another post already uses that slug." : "The post could not be saved. Nothing was changed." };
    }
    savedId = (data as { id: string }).id;
  }

  const target = { type: "post", id: savedId ?? undefined };
  await logActivity(sb, staff.id, id ? "post_updated" : "post_created", target);
  if (existing?.status !== status) {
    const change: Record<string, ActivityAction> = { PUBLISHED: "post_published", ARCHIVED: "post_archived" };
    if (change[status]) await logActivity(sb, staff.id, change[status]!, target);
    else if (existing?.status === "PUBLISHED") await logActivity(sb, staff.id, "post_unpublished", target);
  }

  refreshPublic(value.slug, existing?.slug);
  const notice = intent === "publish" ? "published" : intent === "archive" ? "archived" : intent === "unpublish" ? "unpublished" : "saved";
  redirect(`/admin/posts/${savedId}/edit?notice=${notice}`);
}

export async function setPostStatusAction(form: FormData): Promise<void> {
  const ctx = await context();
  if (!ctx) redirect("/admin/posts?notice=forbidden");
  const { staff, sb } = ctx;
  const id = form.get("id");
  const to = form.get("to");
  if (!isUuid(id) || (to !== "PUBLISHED" && to !== "DRAFT" && to !== "ARCHIVED")) redirect("/admin/posts?notice=failed");

  const { data } = await sb.from("posts").select("status, published_at, slug, content").eq("id", id).maybeSingle();
  if (!data) redirect("/admin/posts?notice=not_found");
  const post = data as { status: string; published_at: string | null; slug: string; content: string };
  if (to === "PUBLISHED" && !htmlToText(post.content)) redirect("/admin/posts?notice=failed");

  const { error } = await sb
    .from("posts")
    .update({ status: to, published_at: to === "PUBLISHED" ? post.published_at ?? new Date().toISOString() : post.published_at })
    .eq("id", id);
  if (error) redirect("/admin/posts?notice=failed");

  await logActivity(sb, staff.id, to === "PUBLISHED" ? "post_published" : to === "ARCHIVED" ? "post_archived" : "post_unpublished", { type: "post", id });
  refreshPublic(post.slug);
  redirect(`/admin/posts?notice=${to === "PUBLISHED" ? "published" : to === "ARCHIVED" ? "archived" : "unpublished"}`);
}

export async function deletePostAction(form: FormData): Promise<void> {
  const ctx = await context();
  if (!ctx) redirect("/admin/posts?notice=forbidden");
  const { staff, sb } = ctx;
  const id = form.get("id");
  if (!isUuid(id)) redirect("/admin/posts?notice=failed");
  const { data } = await sb.from("posts").select("slug").eq("id", id).maybeSingle();
  const { error } = await sb.from("posts").delete().eq("id", id);
  if (error) redirect("/admin/posts?notice=failed");
  await logActivity(sb, staff.id, "post_deleted", { type: "post", id });
  refreshPublic((data as { slug: string } | null)?.slug);
  redirect("/admin/posts?notice=deleted");
}

// ----------------------------------------------------------- categories

function parseCategory(form: FormData): { ok: true; name: string; slug: string; description: string | null } | { ok: false; error: string } {
  const name = typeof form.get("name") === "string" ? (form.get("name") as string).trim().slice(0, 80) : "";
  if (!name) return { ok: false, error: "Enter a category name." };
  const rawSlug = typeof form.get("slug") === "string" ? (form.get("slug") as string).trim() : "";
  const slug = slugify(rawSlug || name).slice(0, 80);
  if (!slug || !isValidSlug(slug)) return { ok: false, error: "The slug needs letters or numbers." };
  const description = typeof form.get("description") === "string" ? (form.get("description") as string).trim().slice(0, 200) : "";
  return { ok: true, name, slug, description: description || null };
}

export async function createCategoryAction(_prev: FormState, form: FormData): Promise<FormState> {
  const ctx = await context();
  if (!ctx) return { error: "You do not have permission to do that." };
  const parsed = parseCategory(form);
  if (!parsed.ok) return { error: parsed.error };
  const { data, error } = await ctx.sb
    .from("categories")
    .insert({ name: parsed.name, slug: parsed.slug, description: parsed.description })
    .select("id")
    .single();
  if (error || !data) return { error: error?.code === DUPLICATE ? "A category with that name or slug already exists." : "The category could not be created." };
  await logActivity(ctx.sb, ctx.staff.id, "category_created", { type: "category", id: (data as { id: string }).id });
  revalidatePath("/news");
  revalidatePath("/admin/categories");
  return { ok: true, message: "Category created." };
}

export async function updateCategoryAction(form: FormData): Promise<void> {
  const ctx = await context();
  if (!ctx) redirect("/admin/categories?notice=forbidden");
  const id = form.get("id");
  const parsed = parseCategory(form);
  if (!isUuid(id) || !parsed.ok) redirect("/admin/categories?notice=failed");
  const { error } = await ctx.sb
    .from("categories")
    .update({ name: parsed.name, slug: parsed.slug, description: parsed.description })
    .eq("id", id);
  if (error) redirect(`/admin/categories?notice=${error.code === DUPLICATE ? "duplicate" : "failed"}`);
  await logActivity(ctx.sb, ctx.staff.id, "category_updated", { type: "category", id });
  revalidatePath("/news");
  redirect("/admin/categories?notice=updated");
}

export async function deleteCategoryAction(form: FormData): Promise<void> {
  const ctx = await context();
  if (!ctx) redirect("/admin/categories?notice=forbidden");
  const { staff, sb } = ctx;
  const id = form.get("id");
  const target = form.get("reassign_to");
  if (!isUuid(id)) redirect("/admin/categories?notice=failed");

  const { count } = await sb.from("posts").select("id", { count: "exact", head: true }).eq("category_id", id);
  if ((count ?? 0) > 0) {
    // A category that posts still use is only removed after those posts are safely moved.
    let newCategory: string | null;
    if (target === "none") newCategory = null;
    else if (isUuid(target) && target !== id) {
      const { data: exists } = await sb.from("categories").select("id").eq("id", target).maybeSingle();
      if (!exists) redirect("/admin/categories?notice=failed");
      newCategory = target;
    } else redirect("/admin/categories?notice=category_in_use");

    const { error: moveError } = await sb.from("posts").update({ category_id: newCategory }).eq("category_id", id);
    if (moveError) redirect("/admin/categories?notice=failed");
  }

  const { error } = await sb.from("categories").delete().eq("id", id);
  if (error) redirect("/admin/categories?notice=failed");
  await logActivity(sb, staff.id, "category_deleted", { type: "category", id });
  revalidatePath("/news");
  redirect("/admin/categories?notice=deleted");
}

// ---------------------------------------------------------------- media

export async function deleteMediaAction(form: FormData): Promise<void> {
  const ctx = await context();
  if (!ctx) redirect("/admin/media?notice=forbidden");
  const { staff, sb } = ctx;
  const id = form.get("id");
  if (!isUuid(id)) redirect("/admin/media?notice=failed");
  const { data } = await sb.from("media").select("storage_path").eq("id", id).maybeSingle();
  if (!data) redirect("/admin/media?notice=not_found");
  const { error: storageError } = await sb.storage.from("media").remove([(data as { storage_path: string }).storage_path]);
  if (storageError) redirect("/admin/media?notice=failed");
  const { error } = await sb.from("media").delete().eq("id", id);
  if (error) redirect("/admin/media?notice=failed");
  await logActivity(sb, staff.id, "media_deleted", { type: "media", id });
  redirect("/admin/media?notice=deleted");
}

// ------------------------------------------------------------- messages

export async function setMessageReadAction(form: FormData): Promise<void> {
  const ctx = await context();
  if (!ctx) redirect("/admin/messages?notice=forbidden");
  const id = form.get("id");
  const read = form.get("read") === "1";
  if (!isUuid(id)) redirect("/admin/messages?notice=failed");
  const { error } = await ctx.sb.from("messages").update({ is_read: read }).eq("id", id);
  if (error) redirect("/admin/messages?notice=failed");
  await logActivity(ctx.sb, ctx.staff.id, read ? "message_marked_read" : "message_marked_unread", { type: "message", id });
  revalidatePath("/admin", "layout");
  redirect(`/admin/messages?notice=${read ? "read" : "unread"}`);
}

export async function deleteMessageAction(form: FormData): Promise<void> {
  const ctx = await context();
  if (!ctx) redirect("/admin/messages?notice=forbidden");
  const id = form.get("id");
  if (!isUuid(id)) redirect("/admin/messages?notice=failed");
  const { error } = await ctx.sb.from("messages").delete().eq("id", id);
  if (error) redirect("/admin/messages?notice=failed");
  await logActivity(ctx.sb, ctx.staff.id, "message_deleted", { type: "message", id });
  revalidatePath("/admin", "layout");
  redirect("/admin/messages?notice=deleted");
}

// ------------------------------------------------------------- settings

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9\s()-]{6,30}$/;
const text = (form: FormData, key: string, max: number) =>
  typeof form.get(key) === "string" ? (form.get(key) as string).replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max) : "";

export async function saveSettingsAction(_prev: FormState, form: FormData): Promise<FormState> {
  const ctx = await context();
  if (!ctx) return { error: "You do not have permission to do that." };

  const contact_email = text(form, "contact_email", 200);
  const contact_phone = text(form, "contact_phone", 30);
  const whatsapp = text(form, "whatsapp", 30);
  const site_name = text(form, "site_name", 80);
  if (!site_name) return { error: "Enter the site name.", fieldErrors: { site_name: "Required." } };
  if (contact_email && !EMAIL.test(contact_email)) return { error: "Enter a valid contact email.", fieldErrors: { contact_email: "Invalid email." } };
  if (contact_phone && !PHONE.test(contact_phone)) return { error: "Enter a valid phone number.", fieldErrors: { contact_phone: "Invalid phone." } };
  if (whatsapp && !PHONE.test(whatsapp)) return { error: "Enter a valid WhatsApp number.", fieldErrors: { whatsapp: "Invalid number." } };

  const social: Record<string, string> = {};
  for (const key of SOCIAL_KEYS) {
    const v = text(form, `social_${key}`, 300);
    if (!v) continue;
    try {
      const u = new URL(v);
      if (u.protocol !== "https:") throw new Error("not https");
      social[key] = u.toString();
    } catch {
      return { error: `${key}: enter a full https:// link.`, fieldErrors: { [`social_${key}`]: "Invalid link." } };
    }
  }

  const { error } = await ctx.sb.from("site_settings").upsert({
    id: 1,
    site_name,
    site_description: text(form, "site_description", 300) || null,
    contact_email: contact_email || null,
    contact_phone: contact_phone || null,
    whatsapp: whatsapp || null,
    default_seo_title: text(form, "default_seo_title", 70) || null,
    default_seo_description: text(form, "default_seo_description", 170) || null,
    social_links: social,
    updated_by: ctx.staff.id,
  });
  if (error) return { error: "Settings could not be saved. Nothing was changed." };

  await logActivity(ctx.sb, ctx.staff.id, "settings_updated", { type: "settings", id: "1" });
  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}

export async function saveProfileNameAction(_prev: FormState, form: FormData): Promise<FormState> {
  const ctx = await context();
  if (!ctx) return { error: "You do not have permission to do that." };
  const name = text(form, "full_name", 80);
  if (!name) return { error: "Enter your name.", fieldErrors: { full_name: "Required." } };
  // Only full_name is sent. Role changes are impossible from here (and blocked by a database trigger).
  const { error } = await ctx.sb.from("profiles").update({ full_name: name }).eq("id", ctx.staff.id);
  if (error) return { error: "Your name could not be saved." };
  revalidatePath("/news");
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Name saved. It appears as the author on your posts." };
}

// ------------------------------------------------- messages: archive

export async function setMessageArchivedAction(form: FormData): Promise<void> {
  const ctx = await context();
  if (!ctx) redirect("/admin/messages?notice=forbidden");
  const id = form.get("id");
  const archived = form.get("archived") === "1";
  if (!isUuid(id)) redirect("/admin/messages?notice=failed");
  const { error } = await ctx.sb.from("messages").update({ is_archived: archived }).eq("id", id);
  if (error) redirect("/admin/messages?notice=failed");
  await logActivity(ctx.sb, ctx.staff.id, archived ? "message_archived" : "message_unarchived", { type: "message", id });
  revalidatePath("/admin", "layout");
  redirect(`/admin/messages?notice=${archived ? "archived_msg" : "restored_msg"}`);
}

// ------------------------------------------- content entries (products etc.)

/** Public pages that show each kind of entry, so a change is visible straight away. */
function refreshEntries(kind: string, slug?: string | null) {
  ["/", "/sitemap.xml", "/search", "/products", "/solutions", "/masterclass", "/r-and-d", "/agriculture"].forEach((p) => revalidatePath(p));
  if (kind === "product" && slug) revalidatePath(`/products/${slug}`);
}

export async function saveEntryAction(_prev: FormState, form: FormData): Promise<FormState> {
  const ctx = await context();
  if (!ctx) return { error: "You do not have permission to do that. Please sign in again." };
  const { staff, sb } = ctx;

  const rawId = form.get("id");
  const id = typeof rawId === "string" && rawId ? rawId : null;
  if (id && !isUuid(id)) return { error: "That item could not be found." };

  const parsed = parseEntryForm(form);
  if (!parsed.ok) return { error: parsed.error };
  const value = parsed.value;

  if (value.is_published && !value.summary && !value.body) {
    return { error: "Add a short description before publishing.", fieldErrors: { summary: "Required to publish." } };
  }
  if (value.kind === "masterclass" && value.is_published && !value.event_at && !value.cta_url) {
    // A session needs either a date or a way to ask about it; otherwise visitors cannot act on it.
    return { error: "Add a date, or a contact link, before publishing a session.", fieldErrors: { event_at: "Add a date or a link." } };
  }

  let previous: { is_published: boolean; slug: string; kind: string } | null = null;
  if (id) {
    const { data } = await sb.from("content_entries").select("is_published, slug, kind").eq("id", id).maybeSingle();
    if (!data) return { error: "That item no longer exists." };
    previous = data as { is_published: boolean; slug: string; kind: string };
  }

  {
    let q = sb.from("content_entries").select("id", { count: "exact", head: true }).eq("kind", value.kind).eq("slug", value.slug);
    if (id) q = q.neq("id", id);
    const { count } = await q;
    if ((count ?? 0) > 0) return { error: "Another item of this kind already uses that slug.", fieldErrors: { slug: "Already used." } };
  }

  let savedId = id;
  if (id) {
    const { error } = await sb.from("content_entries").update(value).eq("id", id);
    if (error) {
      console.error("[saveEntryAction UPDATE]", { code: error.code, message: error.message, details: error.details });
      return { error: error.code === DUPLICATE ? "Another item already uses that slug." : "The item could not be saved. Check that all required fields are filled and the slug is valid." };
    }
  } else {
    const { data, error } = await sb.from("content_entries").insert({ ...value, created_by: staff.id }).select("id").single();
    if (error || !data) {
      console.error("[saveEntryAction INSERT]", { code: error?.code, message: error?.message, details: error?.details });
      return { error: error?.code === DUPLICATE ? "Another item already uses that slug." : "The item could not be saved. Check that all required fields are filled and the slug is valid." };
    }
    savedId = (data as { id: string }).id;
  }

  const target = { type: "entry", id: savedId ?? undefined };
  await logActivity(sb, staff.id, id ? "entry_updated" : "entry_created", target);
  if ((previous?.is_published ?? false) !== value.is_published) {
    await logActivity(sb, staff.id, value.is_published ? "entry_published" : "entry_unpublished", target);
  }

  refreshEntries(value.kind, value.slug);
  if (previous?.slug && previous.slug !== value.slug) refreshEntries(value.kind, previous.slug);
  redirect(`/admin/content/${savedId}/edit?notice=saved`);
}

export async function setEntryPublishedAction(form: FormData): Promise<void> {
  const ctx = await context();
  if (!ctx) redirect("/admin/content?notice=forbidden");
  const id = form.get("id");
  const publish = form.get("publish") === "1";
  if (!isUuid(id)) redirect("/admin/content?notice=failed");
  const { data } = await ctx.sb.from("content_entries").select("kind, slug, summary, body, event_at, cta_url").eq("id", id).maybeSingle();
  if (!data) redirect("/admin/content?notice=not_found");
  const row = data as { kind: string; slug: string; summary: string | null; body: string | null; event_at: string | null; cta_url: string | null };
  if (publish && !row.summary && !row.body) redirect("/admin/content?notice=failed");
  if (publish && row.kind === "masterclass" && !row.event_at && !row.cta_url) redirect("/admin/content?notice=failed");
  const { error } = await ctx.sb.from("content_entries").update({ is_published: publish }).eq("id", id);
  if (error) redirect("/admin/content?notice=failed");
  await logActivity(ctx.sb, ctx.staff.id, publish ? "entry_published" : "entry_unpublished", { type: "entry", id });
  refreshEntries(row.kind, row.slug);
  redirect(`/admin/content?notice=${publish ? "published_entry" : "unpublished_entry"}`);
}

export async function deleteEntryAction(form: FormData): Promise<void> {
  const ctx = await context();
  if (!ctx) redirect("/admin/content?notice=forbidden");
  const id = form.get("id");
  if (!isUuid(id)) redirect("/admin/content?notice=failed");
  const { data } = await ctx.sb.from("content_entries").select("kind, slug").eq("id", id).maybeSingle();
  const { error } = await ctx.sb.from("content_entries").delete().eq("id", id);
  if (error) redirect("/admin/content?notice=failed");
  await logActivity(ctx.sb, ctx.staff.id, "entry_deleted", { type: "entry", id });
  const row = data as { kind: string; slug: string } | null;
  refreshEntries(row?.kind ?? "product", row?.slug);
  redirect("/admin/content?notice=deleted");
}

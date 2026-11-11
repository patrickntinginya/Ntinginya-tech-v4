"use server";

import { revalidatePath } from "next/cache";
import { getStaffOrNull } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function getContext() {
  const staff = await getStaffOrNull();
  if (!staff) return null;

  const supabase = await createSupabaseServerClient();
  return { staff, supabase };
}

export async function createAppAction(formData: FormData) {
  const context = await getContext();
  if (!context) return { error: "You are not authorized." };

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const description = String(formData.get("description") ?? "").trim();
  const iconUrl = String(formData.get("icon_url") ?? "").trim();

  if (name.length < 2 || name.length > 100) {
    return { error: "App name must be between 2 and 100 characters." };
  }

  if (!SLUG_REGEX.test(slug) || slug.length > 100) {
    return { error: "Use a valid URL slug, for example ntinginya-life-os." };
  }

  if (description.length > 5000) {
    return { error: "Description is too long." };
  }

  if (iconUrl && !/^https?:\/\//i.test(iconUrl)) {
    return { error: "Icon URL must start with http:// or https://." };
  }

  const { error } = await context.supabase.from("apps").insert({
    name,
    slug,
    description: description || null,
    icon_url: iconUrl || null,
    created_by: context.staff.id,
    is_published: false,
  });

  if (error) return { error: error.code === "23505" ? "This app slug already exists." : error.message };

  revalidatePath("/admin/apps");
  revalidatePath("/apps");
  return { success: true };
}

export async function createReleaseAction(input: {
  appId: string;
  version: string;
  versionCode: number;
  releaseNotes: string;
  storagePath: string;
  fileName: string;
  sizeBytes: number;
}) {
  const context = await getContext();
  if (!context) return { error: "You are not authorized." };

  const {
    appId,
    version,
    versionCode,
    releaseNotes,
    storagePath,
    fileName,
    sizeBytes,
  } = input;

  if (!/^[0-9A-Za-z][0-9A-Za-z.+_-]{0,49}$/.test(version)) {
    return { error: "Enter a valid version, for example 1.0.0." };
  }

  if (!Number.isSafeInteger(versionCode) || versionCode < 1) {
    return { error: "Version code must be a positive integer." };
  }

  if (!storagePath.startsWith(`${appId}/`) || storagePath.includes("..")) {
    return { error: "Invalid storage path." };
  }

  if (!fileName.toLowerCase().endsWith(".apk")) {
    return { error: "Only APK files are supported." };
  }

  if (!Number.isSafeInteger(sizeBytes) || sizeBytes < 1 || sizeBytes > 157286400) {
    return { error: "APK must be smaller than 150 MB." };
  }

  const { error } = await context.supabase.from("app_releases").insert({
    app_id: appId,
    version,
    version_code: versionCode,
    release_notes: releaseNotes.slice(0, 10000),
    storage_path: storagePath,
    file_name: fileName,
    mime_type: "application/vnd.android.package-archive",
    size_bytes: sizeBytes,
    status: "DRAFT",
    created_by: context.staff.id,
  });

  if (error) return { error: error.code === "23505" ? "This version code already exists for this app." : error.message };

  revalidatePath("/admin/apps");
  revalidatePath("/apps");
  return { success: true };
}

export async function setReleaseStatusAction(
  releaseId: string,
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED",
) {
  const context = await getContext();
  if (!context) return { error: "You are not authorized." };

  const update = {
    status,
    published_at: status === "PUBLISHED" ? new Date().toISOString() : null,
  };

  const { error } = await context.supabase
    .from("app_releases")
    .update(update)
    .eq("id", releaseId);

  if (error) return { error: error.message };

  revalidatePath("/admin/apps");
  revalidatePath("/apps");
  return { success: true };
}

export async function setAppPublishedAction(appId: string, published: boolean) {
  const context = await getContext();
  if (!context) return { error: "You are not authorized." };

  const { error } = await context.supabase
    .from("apps")
    .update({ is_published: published })
    .eq("id", appId);

  if (error) return { error: error.message };

  revalidatePath("/admin/apps");
  revalidatePath("/apps");
  return { success: true };
}

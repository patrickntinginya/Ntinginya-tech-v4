import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getStaffOrNull } from "@/lib/auth";
import { logActivity } from "@/lib/cms/activity";
import { MAX_MEDIA_BYTES, validateMediaFile } from "@/lib/cms/media-validation";
import { isSameOrigin } from "@/lib/security/request";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "image";
  return base.replace(/[^\w.\- ]+/g, "_").slice(0, 120) || "image";
}

/** Staff-only image upload. Validates size, extension, declared MIME type and the real file bytes. */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const staff = await getStaffOrNull();
  if (!staff) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_MEDIA_BYTES + 512 * 1024) {
    return NextResponse.json({ error: "The file is larger than 5 MB." }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "The upload could not be read." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const check = validateMediaFile({ name: file.name, size: bytes.byteLength, type: file.type }, bytes.slice(0, 16));
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: 400 });

  const alt = typeof form.get("alt") === "string" ? (form.get("alt") as string).trim().slice(0, 200) : "";
  const now = new Date();
  const path = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.${check.ext}`;

  const sb = await createSupabaseServerClient();
  const { error: uploadError } = await sb.storage.from("media").upload(path, bytes, {
    contentType: check.mime,
    upsert: false,
    cacheControl: "31536000",
  });
  if (uploadError) return NextResponse.json({ error: "The upload failed. Please try again." }, { status: 500 });

  const { data: pub } = sb.storage.from("media").getPublicUrl(path);
  const { data: row, error: dbError } = await sb
    .from("media")
    .insert({
      storage_path: path,
      url: pub.publicUrl,
      filename: cleanName(file.name),
      mime_type: check.mime,
      size_bytes: bytes.byteLength,
      alt_text: alt || null,
      uploaded_by: staff.id,
    })
    .select("id, url, filename")
    .single();

  if (dbError || !row) {
    await sb.storage.from("media").remove([path]); // do not leave an orphaned file behind
    return NextResponse.json({ error: "The image could not be saved. Please try again." }, { status: 500 });
  }

  await logActivity(sb, staff.id, "media_uploaded", { type: "media", id: (row as { id: string }).id });
  return NextResponse.json({ ok: true, media: row });
}

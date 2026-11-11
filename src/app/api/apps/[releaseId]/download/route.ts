import { NextResponse } from "next/server";
import { createSupabasePublicClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ releaseId: string }> },
) {
  const { releaseId } = await params;
  const publicClient = createSupabasePublicClient();

  if (!publicClient) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  const { data: release, error } = await publicClient
    .from("app_releases")
    .select("id,storage_path,file_name,apps!inner(is_published)")
    .eq("id", releaseId)
    .eq("status", "PUBLISHED")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .eq("apps.is_published", true)
    .maybeSingle();

  if (error || !release) {
    return NextResponse.json({ error: "Release not found." }, { status: 404 });
  }

  const admin = createSupabaseServiceClient();

  if (!admin) {
    return NextResponse.json({ error: "Download service unavailable." }, { status: 503 });
  }

  const { data, error: signingError } = await admin.storage
    .from("apks")
    .createSignedUrl(release.storage_path, 60, {
      download: release.file_name,
    });

  if (signingError || !data?.signedUrl) {
    return NextResponse.json({ error: "Could not prepare download." }, { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl, 302);
}

export const MAX_MEDIA_BYTES = 5 * 1024 * 1024;
export const ALLOWED_MEDIA: Record<string, { mime: string; ext: string }> = {
  jpg: { mime: "image/jpeg", ext: "jpg" },
  jpeg: { mime: "image/jpeg", ext: "jpg" },
  png: { mime: "image/png", ext: "png" },
  webp: { mime: "image/webp", ext: "webp" },
};

/** Detects the real image type from the first bytes, so a renamed file cannot slip through. */
export function detectImageMime(bytes: Uint8Array): "image/jpeg" | "image/png" | "image/webp" | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  )
    return "image/png";
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  )
    return "image/webp";
  return null;
}

export type MediaCheck = { ok: true; mime: string; ext: string } | { ok: false; error: string };

/** Checks size, extension, declared MIME type and real (magic-byte) type. All four must agree. */
export function validateMediaFile(file: { name: string; size: number; type: string }, head: Uint8Array): MediaCheck {
  if (file.size <= 0) return { ok: false, error: "The file is empty." };
  if (file.size > MAX_MEDIA_BYTES) return { ok: false, error: "The file is larger than 5 MB." };
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const rule = ALLOWED_MEDIA[ext];
  if (!rule) return { ok: false, error: "Only JPEG, PNG and WebP images are allowed." };
  if (file.type !== rule.mime) return { ok: false, error: "The file type does not match its extension." };
  const real = detectImageMime(head);
  if (real !== rule.mime) return { ok: false, error: "The file contents are not a valid JPEG, PNG or WebP image." };
  return { ok: true, mime: rule.mime, ext: rule.ext };
}

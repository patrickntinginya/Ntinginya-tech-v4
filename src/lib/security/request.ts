import "server-only";
import { createHmac } from "node:crypto";

/** Same-origin check for state-changing API calls (CSRF defence in depth on top of SameSite cookies). */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser callers (curl) have no Origin; browsers always send one on POST
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-nf-client-connection-ip") ?? request.headers.get("x-forwarded-for");
  return (forwarded ?? "unknown").split(",")[0]!.trim().slice(0, 64);
}

/** Keyed hash so raw IP addresses are never stored. Returns null if no server secret exists. */
export function hashIp(ip: string): string | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return createHmac("sha256", key).update(`ip:${ip}`).digest("hex").slice(0, 40);
}

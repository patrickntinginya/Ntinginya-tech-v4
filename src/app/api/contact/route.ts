import { NextResponse } from "next/server";
import { parseContact } from "@/lib/cms/validation";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import { clientIp, hashIp, isSameOrigin } from "@/lib/security/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 20_000;
const RATE_WINDOW_MINUTES = 10;
const RATE_MAX_MESSAGES = 5;

type EmailResult = "sent" | "failed" | "not_configured";

async function sendNotification(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
}): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || "ntinginyatech@gmail.com";
  if (!apiKey || !from) return "not_configured";

  // Plain text only: nothing the visitor typed is ever interpreted as HTML.
  const text = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "-"}`,
    `Company: ${data.company || "-"}`,
    `Subject: ${data.subject || "-"}`,
    "",
    data.message,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `[Website] ${data.subject || "New enquiry"} (${data.name})`.slice(0, 250),
        text,
      }),
    });
    return response.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return NextResponse.json({ error: "too_large" }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return NextResponse.json({ error: "too_large" }, { status: 413 });
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("bad body");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real visitors never fill this in. Pretend success so bots move on.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true, stored: false, emailed: false });
  }

  // Server-side validation. The browser check is only a convenience.
  const parsed = parseContact(body);
  if (!parsed.ok) return NextResponse.json({ error: "validation_failed" }, { status: 400 });
  const data = parsed.value;

  const supabase = createSupabaseServiceClient();
  const ipHash = hashIp(clientIp(request));

  // Rate limit per visitor (hashed IP), using the messages table itself.
  if (supabase && ipHash) {
    const since = new Date(Date.now() - RATE_WINDOW_MINUTES * 60_000).toISOString();
    const { count } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if ((count ?? 0) >= RATE_MAX_MESSAGES) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }
  }

  // 1) The database is the source of truth: store first.
  let messageId: string | null = null;
  if (supabase) {
    const { data: row, error } = await supabase
      .from("messages")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        subject: data.subject || null,
        message: data.message,
        ip_hash: ipHash,
        email_status: "pending",
      })
      .select("id")
      .single();
    if (!error && row) messageId = (row as { id: string }).id;
  }

  // 2) Then notify by email (only if Resend is really configured).
  const emailResult = await sendNotification(data);

  if (supabase && messageId) {
    await supabase.from("messages").update({ email_status: emailResult }).eq("id", messageId);
  }

  const stored = messageId !== null;
  const emailed = emailResult === "sent";

  if (!stored && !emailed) {
    const nothingConfigured = !supabase && emailResult === "not_configured";
    return NextResponse.json(
      { error: nothingConfigured ? "not_configured" : "delivery_failed" },
      { status: nothingConfigured ? 501 : 502 },
    );
  }
  return NextResponse.json({ ok: true, stored, emailed });
}

import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export type ActivityAction =
  | "login" | "logout"
  | "post_created" | "post_updated" | "post_published" | "post_unpublished" | "post_archived" | "post_deleted"
  | "category_created" | "category_updated" | "category_deleted"
  | "media_uploaded" | "media_deleted"
  | "message_marked_read" | "message_marked_unread" | "message_deleted"
  | "message_archived" | "message_unarchived"
  | "entry_created" | "entry_updated" | "entry_published" | "entry_unpublished" | "entry_deleted"
  | "settings_updated";

/**
 * Records who did what. Never pass passwords, tokens or message bodies here.
 * A logging failure must never break the action that triggered it.
 */
export async function logActivity(
  supabase: SupabaseClient,
  userId: string,
  action: ActivityAction,
  target?: { type: string; id?: string },
): Promise<void> {
  try {
    await supabase.from("activity_log").insert({
      user_id: userId,
      action,
      target_type: target?.type ?? null,
      target_id: target?.id ?? null,
    });
  } catch {
    // ignore
  }
}

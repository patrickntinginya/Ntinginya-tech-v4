/** Shared shapes for server-action results (kept out of "use server" files). */
export type FormState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
  ok?: boolean;
  message?: string;
};

export const NOTICES: Record<string, string> = {
  saved: "Saved.",
  published: "Post published.",
  unpublished: "Post moved back to drafts.",
  archived: "Post archived.",
  deleted: "Deleted.",
  created: "Created.",
  updated: "Updated.",
  read: "Marked as read.",
  unread: "Marked as unread.",
  category_in_use: "That category is used by posts. Choose where to move them first.",
  not_found: "That item no longer exists.",
  duplicate: "That name or slug is already used.",
  failed: "Something went wrong. Nothing was changed.",
  forbidden: "You do not have permission to do that.",
  archived_msg: "Message archived.",
  restored_msg: "Message restored to the inbox.",
  published_entry: "Published. It is now visible on the website.",
  unpublished_entry: "Unpublished. It is no longer visible on the website.",
};

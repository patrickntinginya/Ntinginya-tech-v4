import Link from "next/link";
import { deleteMessageAction, setMessageArchivedAction, setMessageReadAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Empty, Notice, PageHeader, btnDanger, btnOutline } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { listAdminMessages } from "@/lib/cms/admin";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";
export const metadata = { title: "Messages" };

const emailStatusText: Record<string, string> = {
  sent: "Email notification sent",
  failed: "Email notification failed (the message is saved here)",
  not_configured: "Email notifications are not configured",
  pending: "Email notification pending",
};

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ filter?: string; notice?: string }> }) {
  await requireStaff();
  const sp = await searchParams;
  const filter = sp.filter === "unread" ? "unread" : sp.filter === "archived" ? "archived" : "";
  const messages = await listAdminMessages(filter);

  return (
    <>
      <PageHeader title="Messages" description="Contact-form messages. They are stored here even if email delivery fails." />
      <Notice code={sp.notice} />
      <nav aria-label="Filter" className="mb-5 flex gap-2">
        {[["", "Inbox"], ["unread", "Unread"], ["archived", "Archived"]].map(([v, label]) => (
          <Link key={label} href={v ? `/admin/messages?filter=${v}` : "/admin/messages"} aria-current={filter === v ? "true" : undefined} className={cn("inline-flex min-h-10 items-center rounded-md border px-3 font-sans text-sm font-medium", filter === v ? "border-deep bg-deep text-white" : "border-deep/30 hover:bg-deep/5")}>
            {label}
          </Link>
        ))}
      </nav>

      {messages.length === 0 ? (
        <Empty>{filter === "unread" ? "No unread messages." : filter === "archived" ? "No archived messages." : "No messages yet."}</Empty>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id}>
              <details className={cn("rounded-xl border bg-paper", m.is_read ? "border-deep/15" : "border-maize-500 ring-1 ring-maize-400")}>
                <summary className="flex min-h-14 cursor-pointer list-none flex-col gap-0.5 px-4 py-3">
                  <span className="flex items-center gap-2 font-sans font-semibold">
                    {!m.is_read ? <span className="rounded bg-maize-400 px-1.5 py-0.5 text-xs text-deep">New</span> : null}
                    <span className="truncate">{m.name}</span>
                  </span>
                  <span className="truncate font-sans text-sm text-deep/80">{m.subject || "No subject"}</span>
                  <span className="font-sans text-xs text-deep/65">{formatDateTime(m.created_at)}</span>
                </summary>
                <div className="space-y-4 border-t border-deep/10 p-4">
                  <dl className="grid gap-2 font-sans text-sm sm:grid-cols-2">
                    <div><dt className="font-semibold">Email</dt><dd className="break-all"><a className="underline" href={`mailto:${m.email}`}>{m.email}</a></dd></div>
                    <div><dt className="font-semibold">Phone</dt><dd>{m.phone || "-"}</dd></div>
                    <div><dt className="font-semibold">Company</dt><dd>{m.company || "-"}</dd></div>
                    <div><dt className="font-semibold">Delivery</dt><dd>{emailStatusText[m.email_status] ?? m.email_status}</dd></div>
                  </dl>
                  {/* Rendered as text by React: never as HTML. */}
                  <p className="whitespace-pre-wrap break-words text-base leading-relaxed">{m.message}</p>
                  <div className="flex flex-wrap gap-2">
                    <form action={setMessageReadAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="read" value={m.is_read ? "0" : "1"} />
                      <button type="submit" className={btnOutline}>{m.is_read ? "Mark unread" : "Mark read"}</button>
                    </form>
                    <form action={setMessageArchivedAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="archived" value={m.is_archived ? "0" : "1"} />
                      <button type="submit" className={btnOutline}>{m.is_archived ? "Restore to inbox" : "Archive"}</button>
                    </form>
                    <form action={deleteMessageAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <ConfirmButton confirm="Delete this message permanently?" className={btnDanger}>Delete</ConfirmButton>
                    </form>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

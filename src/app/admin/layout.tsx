import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireStaff } from "@/lib/auth";
import { getUnreadCount } from "@/lib/cms/admin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // First gate. Every admin page and every server action checks the role again itself.
  const profile = await requireStaff();
  const unread = await getUnreadCount();
  return (
    <AdminShell name={profile.full_name || profile.email || "Administrator"} role={profile.role} unread={unread}>
      {children}
    </AdminShell>
  );
}

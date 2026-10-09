"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Activity, ExternalLink, FileText, FolderTree, LayoutGrid, Image as ImageIcon, LayoutDashboard, LogOut, Mail, Menu, Settings, X } from "lucide-react";
import { logoutAction } from "@/app/login/actions";
import { cn } from "@/lib/cn";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/content", label: "Content", icon: LayoutGrid },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/activity", label: "Activity", icon: Activity },
];

function Nav({ unread, pathname }: { unread: number; pathname: string }) {
  return (
    <nav aria-label="Admin">
      <ul className="space-y-1">
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-12 items-center gap-3 rounded-lg px-3 font-sans text-base font-medium",
                  active ? "bg-deep text-white" : "text-deep/85 hover:bg-deep/5",
                )}
              >
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                <span className="flex-1">{label}</span>
                {label === "Messages" && unread > 0 ? (
                  <span className="rounded-full bg-maize-400 px-2 py-0.5 text-xs font-semibold text-deep">{unread}</span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Account({ name, role }: { name: string; role: string }) {
  return (
    <div className="border-t border-deep/10 pt-4">
      <p className="truncate font-sans text-sm font-semibold">{name}</p>
      <p className="font-sans text-xs capitalize text-deep/70">{role}</p>
      <div className="mt-3 flex gap-2">
        <Link href="/" target="_blank" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-deep/25 font-sans text-sm font-medium hover:bg-deep/5">
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
          View site
        </Link>
        <form action={logoutAction} className="flex-1">
          <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-deep/25 font-sans text-sm font-medium hover:bg-deep/5">
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminShell({ name, role, unread, children }: { name: string; role: string; unread: number; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-mist lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      {/* Desktop sidebar */}
      <aside className="hidden border-r border-deep/10 bg-paper lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:p-4">
        <div>
          <Link href="/admin" className="mb-6 block px-3 pt-2 font-sans text-lg font-semibold tracking-tight">
            Ntinginya Tech <span className="block text-xs font-medium text-deep/65">Admin</span>
          </Link>
          <Nav unread={unread} pathname={pathname} />
        </div>
        <Account name={name} role={role} />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-deep/10 bg-paper px-4 lg:hidden">
        <Link href="/admin" className="font-sans text-base font-semibold">
          Ntinginya Admin
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="admin-drawer"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-lg border border-deep/25"
        >
          {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
        </button>
      </header>
      {open ? (
        <div id="admin-drawer" className="fixed inset-x-0 bottom-0 top-14 z-30 flex flex-col justify-between overflow-y-auto bg-paper p-4 lg:hidden">
          <Nav unread={unread} pathname={pathname} />
          <div className="mt-6">
            <Account name={name} role={role} />
          </div>
        </div>
      ) : null}

      <div className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</div>
    </div>
  );
}

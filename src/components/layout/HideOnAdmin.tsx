"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** The admin area has its own navigation, so the public header/footer are not drawn there. */
export function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return <>{children}</>;
}

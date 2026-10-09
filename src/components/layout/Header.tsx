"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { navItems } from "@/config/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";

// The logo already links home, so the desktop bar leaves "Home" out and keeps every other link on one line.
const desktopNavItems = navItems.filter((item) => item.href !== "/");

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the menu after navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While the mobile menu is open: Escape closes it and the page behind does not scroll.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-deep/10 bg-mist/90 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {desktopNavItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-md px-2.5 py-2 font-sans text-[0.9375rem] font-medium transition-colors",
                        active ? "bg-deep text-white" : "text-deep/80 hover:bg-deep/5 hover:text-deep",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              aria-label="Search the site"
              className="grid h-11 w-11 place-items-center rounded-lg border border-deep/25 text-deep transition-colors hover:bg-deep/5"
            >
              <Search aria-hidden="true" className="h-5 w-5" />
            </Link>
            <ButtonLink href="/contact" variant="dark" className="hidden sm:inline-flex">
              Work With Us
            </ButtonLink>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-lg border border-deep/25 text-deep transition-colors hover:bg-deep/5 xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
            </button>
          </div>
        </Container>
      </div>

      {/* Sits outside the blurred bar so `fixed` positioning is relative to the viewport. */}
      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-mist xl:hidden"
        >
          <Container className="py-6">
            <nav aria-label="Mobile">
              <ul className="divide-y divide-deep/10 border-y border-deep/10">
                {navItems.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex min-h-14 items-center justify-between font-sans text-xl font-semibold",
                          active ? "text-field-700" : "text-deep",
                        )}
                      >
                        {item.label}
                        {active ? <span className="h-2 w-2 rounded-full bg-maize-500" aria-hidden="true" /> : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <ButtonLink href="/contact" variant="dark" size="lg" className="mt-8 w-full">
              Work With Us
            </ButtonLink>
          </Container>
        </div>
      ) : null}
    </header>
  );
}

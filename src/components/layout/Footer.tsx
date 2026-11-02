import Link from "next/link";
import { contactInfo, footerLinks, siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="surface-dark bg-deep text-white">
      <Container className="grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Logo dark />
          <p className="mt-6 max-w-sm font-sans text-xl font-semibold leading-snug text-balance">{siteConfig.tagline}</p>
          <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-white/70">
            Practical reporting and guides on technology, business, finance and digital opportunities, with perspectives
            rooted in Tanzania and relevant across Africa and beyond.
          </p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-7">
          <h2 className="font-sans text-base font-semibold">Explore</h2>
          <ul className="mt-4 space-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-base font-semibold">Contact</h2>
          <a href={`mailto:${contactInfo.email}`} className="mt-4 inline-block text-white/80 underline-offset-4 hover:text-white hover:underline">
            {contactInfo.email}
          </a>
          <p className="mt-2 text-sm text-white/70">{contactInfo.location}</p>
          <SocialLinks dark className="mt-4" />
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>{siteConfig.copyright}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link href="/privacy" className="underline-offset-4 hover:text-white hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="underline-offset-4 hover:text-white hover:underline">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/disclaimer" className="underline-offset-4 hover:text-white hover:underline">
                Disclaimer
              </Link>
            </li>
            <li>
              <Link href="/editorial-standards" className="underline-offset-4 hover:text-white hover:underline">
                Editorial standards
              </Link>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}

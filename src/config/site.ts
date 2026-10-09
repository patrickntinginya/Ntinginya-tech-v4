/**
 * Central place for company information.
 */
export const siteConfig = {
  name: "Ntinginya Tech",
  tagline: "Building Technology. Empowering People. Transforming Agriculture.",
  title: "Ntinginya Tech | Technology & Innovation Solutions",
  description:
    "Ntinginya Tech builds software, digital platforms and technology solutions while advancing innovation across business, agriculture and livestock.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  copyright: "© 2026 Ntinginya Tech. All rights reserved.",
} as const;

/** Company contact details (defaults; the admin can override them in Settings). */
export const contactInfo = {
  email: "ntinginyatech@gmail.com",
  phone: "+255784949095",
  location: "Tanzania",
} as const;

/**
 * PLACEHOLDER social links. Leave `href` empty until a real profile exists;
 * empty entries render as inactive labels instead of broken links.
 */
export const socialLinks: ReadonlyArray<{ label: string; href: string }> = [
  { label: "LinkedIn", href: "" },
  { label: "X", href: "" },
  { label: "Instagram", href: "" },
  { label: "Facebook", href: "" },
  { label: "YouTube", href: "" },
];

export const navItems: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Solutions", href: "/solutions" },
  { label: "Products", href: "/products" },
  { label: "Agriculture", href: "/agriculture" },
  { label: "Innovation", href: "/innovation" },
  { label: "Masterclass", href: "/masterclass" },
  { label: "R&D", href: "/r-and-d" },
  { label: "Network", href: "/network" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export const footerLinks: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Solutions", href: "/solutions" },
  { label: "Products", href: "/products" },
  { label: "Agriculture", href: "/agriculture" },
  { label: "Innovation", href: "/innovation" },
  { label: "Masterclass", href: "/masterclass" },
  { label: "R&D", href: "/r-and-d" },
  { label: "Expert Network", href: "/network" },
  { label: "News & Insights", href: "/news" },
  { label: "Contact", href: "/contact" },
];

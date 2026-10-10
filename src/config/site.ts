const defaultSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://ntinginya.tech");

export const siteConfig = {
  name: "Ntinginya Tech",
  tagline: "Building Technology. Empowering People. Transforming Agriculture.",
  title: "Ntinginya Tech | Technology & Innovation Solutions",
  description:
    "Ntinginya Tech builds software, digital platforms and technology solutions while advancing innovation across business, agriculture and livestock.",
  url: defaultSiteUrl.replace(/\/$/, ""),
  copyright: "© 2026 Ntinginya Tech. All rights reserved.",
} as const;

export const contactInfo = {
  email: "ntinginyatech@gmail.com",
  phone: "+255784949095",
  location: "Tanzania",
} as const;

export const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Solutions", href: "/solutions" },
  { label: "Products", href: "/products" },
  { label: "Agriculture", href: "/agriculture" },
  { label: "Innovation", href: "/innovation" },
  { label: "Masterclass", href: "/masterclass" },
  { label: "R&D", href: "/r-and-d" },
  { label: "News", href: "/news" },
  { label: "Network", href: "/network" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "News", href: "/news" },
  { label: "Network", href: "/network" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

// Keep these blank until official profiles are configured; empty hrefs render as inactive labels.
export const socialLinks = [
  { label: "LinkedIn", href: "" },
  { label: "X", href: "" },
  { label: "Instagram", href: "" },
  { label: "Facebook", href: "" },
  { label: "YouTube", href: "" },
] as const;

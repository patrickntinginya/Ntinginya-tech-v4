const defaultSiteUrl = "https://ntinginya-tech-v4.vercel.app";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl;

export const siteConfig = {
  name: "Ntinginya Tech",
  tagline: "Practical technology, business and finance insights from Tanzania.",
  title: "Ntinginya Tech | Technology, Business & Finance Insights",
  description:
    "Ntinginya Tech builds software, digital platforms and technology solutions while sharing practical insights on technology, AI, business and digital innovation across Tanzania and Africa.",
  url: configuredSiteUrl.replace(/\/$/, ""),
  copyright: "© 2026 Ntinginya Tech. All rights reserved.",
} as const;

export const contactInfo = {
  email: "ntinginyatech@gmail.com",
  phone: "+255784949095",
  location: "Tanzania",
} as const;

export const publicationTopics = [
  {
    label: "Technology",
    slug: "technology",
    description: "Technology news, software, cybersecurity and digital change.",
    href: "/news?category=technology",
  },
  {
    label: "AI & Innovation",
    slug: "ai-innovation",
    description: "Useful AI tools, emerging ideas and responsible innovation.",
    href: "/innovation",
  },
  {
    label: "Business",
    slug: "business",
    description: "Entrepreneurship, small business and African startups.",
    href: "/news?category=business",
  },
  {
    label: "Finance",
    slug: "finance",
    description: "Financial education, saving and digital financial services.",
    href: "/news?category=finance",
  },
  {
    label: "Digital Opportunities",
    slug: "digital-opportunities",
    description: "Freelancing, remote work and responsible digital careers.",
    href: "/news?category=digital-opportunities",
  },
  {
    label: "Tutorials & Guides",
    slug: "tutorials-guides",
    description: "Step-by-step help for practical digital skills and tools.",
    href: "/news?category=tutorials-guides",
  },
  {
    label: "Reviews",
    slug: "reviews",
    description: "Considered reviews of useful digital products and services.",
    href: "/news?category=reviews",
  },
] as const;

export const navItems = [
  { label: "Home", href: "/" },
  ...publicationTopics.map(({ label, href }) => ({ label, href })),
  { label: "About Us", href: "/about" },
  { label: "Solutions", href: "/solutions" },
  { label: "Products", href: "/products" },
  { label: "Apps", href: "/apps" },
  { label: "Agriculture", href: "/agriculture" },
  { label: "Masterclass", href: "/masterclass" },
  { label: "Research & Development", href: "/r-and-d" },
  { label: "Network", href: "/network" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerLinks = [
  { label: "Home", href: "/" },
  { label: "All articles", href: "/news" },
  ...publicationTopics.map(({ label, href }) => ({ label, href })),
  { label: "About Us", href: "/about" },
  { label: "Solutions", href: "/solutions" },
  { label: "Products", href: "/products" },
  { label: "Apps", href: "/apps" },
  { label: "Agriculture", href: "/agriculture" },
  { label: "Masterclass", href: "/masterclass" },
  { label: "Research & Development", href: "/r-and-d" },
  { label: "Network", href: "/network" },
  { label: "Contact Us", href: "/contact" },
] as const;

// Keep these blank until official profiles are configured.
export const socialLinks = [
  { label: "LinkedIn", href: "" },
  { label: "X", href: "" },
  { label: "Instagram", href: "" },
  { label: "Facebook", href: "" },
  { label: "YouTube", href: "" },
] as const;

export const siteConfig = {
  name: "Ntinginya Tech",
  tagline: "Building Technology. Empowering People. Transforming Agriculture.",
  title: "Ntinginya Tech | Technology & Innovation Solutions",
  description:
    "Ntinginya Tech builds software, digital platforms and technology solutions while advancing innovation across business, agriculture and livestock.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://ntinginya-tech-v4.vercel.app").replace(/\/$/, ""),
  copyright: "© 2026 Ntinginya Tech. All rights reserved.",
} as const;

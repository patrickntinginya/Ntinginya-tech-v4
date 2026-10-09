import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";
import { contactInfo, siteConfig } from "@/config/site";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HideOnAdmin } from "@/components/layout/HideOnAdmin";
import "./globals.css";

// Public pages refresh from the CMS at most every 5 minutes (admin pages are always dynamic).
export const revalidate = 300;

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  verification: {
  google: "j-j6DDkmdm0ggGmpsVjjsYYXgo0iqbEdfBr8PWmGScY",
},
  applicationName: siteConfig.name,
  keywords: [
    "Ntinginya Tech",
    "Tanzania technology company",
    "software development Tanzania",
    "agriculture technology",
    "livestock technology",
    "AgriTech innovation",
    "business software",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#EAF0E9",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  slogan: siteConfig.tagline,
  email: contactInfo.email,
  areaServed: "TZ",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  inLanguage: "en",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <HideOnAdmin>
          <Header />
        </HideOnAdmin>
        <main id="main">{children}</main>
        <HideOnAdmin>
          <Footer />
        </HideOnAdmin>
        <script
          type="application/ld+json"
          // JSON.stringify of static site config: safe to inline.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}

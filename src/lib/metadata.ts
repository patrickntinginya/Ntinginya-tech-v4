import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type PageMeta = {
  title: string;
  description: string;
  path: string;
};

/** Builds consistent page metadata (title, description, canonical, Open Graph, Twitter). */
export function buildMetadata({ title, description, path }: PageMeta): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

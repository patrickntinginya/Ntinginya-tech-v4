import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { products } from "@/content/products";
import { listEntrySlugs } from "@/lib/cms/entries";
import { listPublishedSlugs } from "@/lib/cms/public";

export const revalidate = 3600;

const staticRoutes = [
  "/",
  "/about",
  "/solutions",
  "/products",
  "/agriculture",
  "/innovation",
  "/masterclass",
  "/r-and-d",
  "/network",
  "/news",
  "/contact",
  "/privacy",
  "/terms",
];

/** Public pages plus PUBLISHED articles only. Drafts and archived posts are never listed. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const pages = [...staticRoutes, ...products.map((p) => `/products/${p.slug}`)].map(
    (path): MetadataRoute.Sitemap[number] => ({
      url: `${siteConfig.url}${path === "/" ? "" : path}`,
      lastModified,
      changeFrequency: path === "/" || path === "/news" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : path.startsWith("/products/") ? 0.6 : path === "/privacy" || path === "/terms" ? 0.2 : 0.8,
    }),
  );

  let articles: MetadataRoute.Sitemap = [];
  try {
    const posts = await listPublishedSlugs();
    articles = posts.map((p) => ({
      url: `${siteConfig.url}/news/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Supabase unavailable at build time: ship the static pages only.
  }
  let dbProducts: MetadataRoute.Sitemap = [];
  try {
    const rows = await listEntrySlugs("product");
    const builtIn = new Set(products.map((p) => p.slug));
    dbProducts = rows
      .filter((r) => !builtIn.has(r.slug))
      .map((r) => ({
        url: `${siteConfig.url}/products/${r.slug}`,
        lastModified: new Date(r.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
  } catch {
    // Database unavailable: skip.
  }
  return [...pages, ...articles, ...dbProducts];
}

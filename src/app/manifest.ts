import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Web app manifest: lets people add the site to their home screen. There is deliberately NO service
 * worker, so the site does not work offline and does not claim to.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Ntinginya",
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#EAF0E9",
    theme_color: "#0A2A30",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

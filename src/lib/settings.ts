import "server-only";
import { cache } from "react";
import { contactInfo, siteConfig, socialLinks as defaultSocialLinks } from "@/config/site";
import { createSupabasePublicClient } from "@/lib/supabase/server";

export type SiteSettings = {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  socialLinks: Array<{ label: string; href: string }>;
};

export const SOCIAL_KEYS = ["LinkedIn", "X", "Instagram", "Facebook", "YouTube"] as const;

const defaults: SiteSettings = {
  siteName: siteConfig.name,
  siteDescription: siteConfig.description,
  contactEmail: contactInfo.email,
  contactPhone: contactInfo.phone,
  whatsapp: "",
  defaultSeoTitle: siteConfig.title,
  defaultSeoDescription: siteConfig.description,
  socialLinks: [...defaultSocialLinks],
};

/** Settings from Supabase, falling back to the values in src/config/site.ts. Never throws. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const client = createSupabasePublicClient();
    if (!client) return defaults;
    const { data } = await client.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (!data) return defaults;
    const social = (data.social_links ?? {}) as Record<string, string>;
    return {
      siteName: data.site_name || defaults.siteName,
      siteDescription: data.site_description || defaults.siteDescription,
      contactEmail: data.contact_email || defaults.contactEmail,
      contactPhone: data.contact_phone || defaults.contactPhone,
      whatsapp: data.whatsapp || "",
      defaultSeoTitle: data.default_seo_title || defaults.defaultSeoTitle,
      defaultSeoDescription: data.default_seo_description || defaults.defaultSeoDescription,
      socialLinks: SOCIAL_KEYS.map((label) => ({ label, href: typeof social[label] === "string" ? social[label] : "" })),
    };
  } catch {
    return defaults;
  }
});

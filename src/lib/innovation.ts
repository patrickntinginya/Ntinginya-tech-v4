import { countries } from "@/content/countries";

/**
 * Innovation Hub topics. Editors tag an article in the existing CMS with the tag shown here
 * (tags are stored lowercase), and it appears under that topic. No database change is needed.
 */
export const innovationTopics = [
  { slug: "global-innovation", label: "Global Innovation", tag: "global innovation" },
  { slug: "tanzania-innovation", label: "Tanzania Innovation", tag: "tanzania innovation" },
  { slug: "smart-farming", label: "Smart Farming", tag: "smart farming" },
  { slug: "livestock-technology", label: "Livestock Technology", tag: "livestock technology" },
  { slug: "ai-agriculture", label: "AI & Agriculture", tag: "ai & agriculture" },
  { slug: "modern-machinery", label: "Modern Machinery", tag: "modern machinery" },
  { slug: "digital-agriculture", label: "Digital Agriculture", tag: "digital agriculture" },
] as const;

export type InnovationTopic = (typeof innovationTopics)[number];

export const innovationTags: string[] = innovationTopics.map((t) => t.tag);

export function getInnovationTopic(slug: string | undefined): InnovationTopic | undefined {
  return innovationTopics.find((t) => t.slug === slug);
}

/** The first country name found among an article's tags, e.g. tag "japan" gives "Japan". */
export function countryFromTags(tags: string[]): string | null {
  const lower = tags.map((t) => t.toLowerCase());
  const match = countries.find((c) => lower.includes(c.name.toLowerCase()));
  return match ? match.name : null;
}

/** The innovation topic labels an article belongs to (for display). */
export function topicsFromTags(tags: string[]): string[] {
  const lower = tags.map((t) => t.toLowerCase());
  return innovationTopics.filter((t) => lower.includes(t.tag)).map((t) => t.label);
}

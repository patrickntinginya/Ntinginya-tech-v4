import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "h2", "h3", "h4", "p", "br", "hr", "strong", "b", "em", "i", "u", "a",
  "ul", "ol", "li", "blockquote", "code", "pre",
  "img", "figure", "figcaption",
  "table", "thead", "tbody", "tr", "th", "td",
];

/**
 * Cleans article HTML before it is saved AND again before it is rendered.
 * No scripts, no event handlers, no inline styles, only http(s)/mailto/tel links and https images.
 */
export function sanitizeArticleHtml(dirty: string): string {
  return sanitizeHtml(dirty ?? "", {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https"] },
    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
    transformTags: {
      a: (tagName, attribs) => {
        const external = /^https?:/i.test(attribs.href ?? "");
        return {
          tagName,
          attribs: {
            ...attribs,
            ...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {}),
          },
        };
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
    },
  }).trim();
}

/** Plain text for excerpts / SEO fallbacks. */
export function htmlToText(html: string): string {
  return sanitizeHtml(html ?? "", { allowedTags: [], allowedAttributes: {} })
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

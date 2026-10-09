import type { StatusKey } from "./types";

/** Structured content that staff manage in /admin/content. Articles live in posts instead. */
export const ENTRY_KINDS = ["product", "solution", "masterclass", "research"] as const;
export type EntryKind = (typeof ENTRY_KINDS)[number];

export function isEntryKind(value: unknown): value is EntryKind {
  return typeof value === "string" && (ENTRY_KINDS as readonly string[]).includes(value);
}

export const STATUS_KEYS: StatusKey[] = ["live", "mvp", "in-development", "proposed", "future"];
export const STATUS_TEXT: Record<StatusKey, string> = {
  live: "LIVE",
  mvp: "MVP",
  "in-development": "IN DEVELOPMENT",
  proposed: "PROPOSED",
  future: "FUTURE",
};

export const kindMeta: Record<
  EntryKind,
  {
    label: string;
    plural: string;
    help: string;
    publicPath: string;
    categories: string[];
    usesDate: boolean;
  }
> = {
  product: {
    label: "Product",
    plural: "Products",
    help: "Appears on the Products page and the home page. Only mark LIVE when people can really use it.",
    publicPath: "/products",
    categories: [],
    usesDate: false,
  },
  solution: {
    label: "Solution",
    plural: "Solutions",
    help: "Appears as a card on the Solutions page.",
    publicPath: "/solutions",
    categories: [],
    usesDate: false,
  },
  masterclass: {
    label: "Masterclass session",
    plural: "Masterclass",
    help: "Appears under Upcoming sessions on the Masterclass page. Add the date, the instructor or expert, and how to ask about it.",
    publicPath: "/masterclass",
    categories: ["Session", "Course"],
    usesDate: true,
  },
  research: {
    label: "R&D item",
    plural: "R&D",
    help: "Appears on the R&D page. Choose the type so it lands in the right section. Do not publish results you do not have.",
    publicPath: "/r-and-d",
    categories: ["Research project", "Experiment", "Publication", "Innovation project"],
    usesDate: false,
  },
};

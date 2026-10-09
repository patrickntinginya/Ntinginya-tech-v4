export type Country = {
  name: string;
  region: string;
  themes: [string, string];
  home?: boolean;
};

/**
 * Themes are starting points for research, NOT conclusions about what works.
 * Do not turn these into performance or capability claims.
 */
export const countries: Country[] = [
  { name: "China", region: "Asia", themes: ["Digital agriculture", "Agri-tech platforms"] },
  { name: "Russia", region: "Europe and Asia", themes: ["Large-scale crop production", "Grain systems"] },
  { name: "Japan", region: "Asia", themes: ["Small-scale precision farming", "Farm automation"] },
  { name: "Israel", region: "Middle East", themes: ["Irrigation and water efficiency", "Dryland farming"] },
  { name: "Netherlands", region: "Europe", themes: ["Greenhouse horticulture", "Controlled environments"] },
  { name: "India", region: "Asia", themes: ["Smallholder digital services", "Low-cost innovation"] },
  { name: "South Korea", region: "Asia", themes: ["Smart farms", "Protected cultivation"] },
  { name: "Brazil", region: "South America", themes: ["Tropical agriculture", "Livestock systems"] },
  { name: "United States", region: "North America", themes: ["Precision agriculture", "Agricultural data"] },
  { name: "Tanzania", region: "Home context", themes: ["Local crops and livestock", "Farmer realities"], home: true },
];

/** What the AgriTech Innovation Hub is planned to showcase. */
export const hubShowcase = [
  "Modern farming",
  "Livestock technology",
  "Smart agriculture",
  "Automation",
  "Agricultural machinery",
  "Irrigation",
  "Digital agriculture",
  "AI in agriculture",
  "Global agricultural innovation",
];

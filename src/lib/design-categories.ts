/** Curated filter chips for /designs — general disciplines only. */
export const DESIGN_FILTER_CATEGORIES = [
  "Advertising",
  "Branding",
  "Packaging",
  "Photography",
  "Posters",
  "Graphic Design",
  "Motion",
] as const;

export type DesignFilterCategory = (typeof DESIGN_FILTER_CATEGORIES)[number];

const ALIAS: Record<string, DesignFilterCategory> = {
  advertising: "Advertising",
  "graphic design": "Graphic Design",
  photography: "Photography",
  packaging: "Packaging",
  "packaging design": "Packaging",
  branding: "Branding",
  brand: "Branding",
  artwork: "Graphic Design",
  illustration: "Graphic Design",
  cinema: "Posters",
  css: "Graphic Design",
  baher: "Photography",
};

const POSTER_HINT =
  /poster|fan\s*made|fanmade|unofficial|movie\s*poster|film\s*poster|fifa\s*\d|sherlock\s*holmes|harry\s*potter|pirates\s*of\s*the\s*caribbean|la\s*casa\s*de\s*papel|zaebak|paranormal|assassin'?s\s*creed/i;

const JUNK_CATEGORY =
  /fifa|sherlock|holmes|harry|potter|pirates|caribbean|la\s*casa|zaebak|ahmed\s*amin|curreny|el\s*zaebak/i;

function tagBlob(tags?: string[]): string {
  return (tags ?? []).join(" ").toLowerCase();
}

/** Map Behance-style category/tags/title to a single general discipline. */
export function normalizeDesignCategory(
  raw?: string,
  tags?: string[],
  title?: string
): DesignFilterCategory {
  const rawNorm = (raw ?? "").trim().toLowerCase();
  const tagsNorm = tagBlob(tags);
  const titleNorm = (title ?? "").toLowerCase();
  const combined = `${rawNorm} ${tagsNorm} ${titleNorm}`;

  if (POSTER_HINT.test(combined) || JUNK_CATEGORY.test(rawNorm)) return "Posters";
  if (/packaging|package design/.test(combined)) return "Packaging";
  if (/logo design|re-?branding|brand identity|restaurant.*logo/.test(combined) || rawNorm === "brand")
    return "Branding";
  if (/advertising|advertisement|manipulation ad|mcdonald|nescafe/.test(combined) || rawNorm.includes("advertising"))
    return "Advertising";
  if (/premiere|slo-?mo|videography|motion reel|short footage/.test(combined)) return "Motion";
  if (/photography|photograph|eos|canon|outdoor|hdr|nature session|flowers|roses/.test(combined) || rawNorm.includes("photography"))
    return "Photography";
  if (/website|web design|html|javascript|\bcss\b/.test(combined)) return "Graphic Design";

  if (ALIAS[rawNorm]) return ALIAS[rawNorm];

  return "Graphic Design";
}

export function designFilterCategoriesForPortfolio(
  items: { category?: string; tags?: string[]; title?: string }[]
): string[] {
  const used = new Set<DesignFilterCategory>();
  for (const item of items) {
    used.add(normalizeDesignCategory(item.category, item.tags, item.title));
  }
  return ["All", ...DESIGN_FILTER_CATEGORIES.filter((c) => used.has(c))];
}

import type { PortfolioItem } from "@/types";

export const NEW_PROJECT_SLUG = "new";

export function createEmptyPortfolioItem(overrides?: Partial<PortfolioItem>): PortfolioItem {
  const ts = Date.now();
  return {
    id: `item-${ts}`,
    slug: `work-${ts}`,
    title: "New project",
    category: "Brand identity",
    image: "/images/placeholders/gallery-1.svg",
    description: "",
    blocks: [],
    ...overrides,
  };
}

export function slugifyProjectTitle(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `work-${Date.now()}`;
}

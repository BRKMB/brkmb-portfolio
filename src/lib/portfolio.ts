import portfolioData from "@/data/portfolio.json";
import type { PortfolioItem } from "@/types";

const defaultPortfolio = portfolioData as PortfolioItem[];

export function resolvePortfolioSlug(item: PortfolioItem): string {
  if (item.slug) return item.slug;
  return item.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizePortfolioItem(item: PortfolioItem): PortfolioItem {
  const slug = resolvePortfolioSlug(item);
  return {
    ...item,
    slug,
    gallery: item.gallery?.length ? item.gallery : [item.image],
  };
}

export function normalizePortfolio(items: PortfolioItem[]): PortfolioItem[] {
  return items.map(normalizePortfolioItem);
}

export function getPortfolioBySlug(slug: string, items = defaultPortfolio): PortfolioItem | undefined {
  return normalizePortfolio(items).find((p) => p.slug === slug || p.id === slug);
}

export function getAllPortfolioSlugs(items = defaultPortfolio): string[] {
  return normalizePortfolio(items).map((p) => p.slug);
}

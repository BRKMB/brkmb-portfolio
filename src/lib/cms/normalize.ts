import type { CmsData, LegacyCmsData, LinkGroup, PortfolioItem } from "@/types";
import { normalizePortfolio } from "@/lib/portfolio";
import { ensureLinkGroupsComplete } from "@/lib/link-groups-order";
import { defaultCmsData } from "./defaults";

/** Legacy demo items use ids like p1, p2 — keep them hidden when defaults say so. */
function isLegacyPlaceholder(item: PortfolioItem) {
  return /^p\d+$/.test(item.id);
}

/**
 * Merges shipped portfolio.json with browser CMS so new imports appear without
 * resetting localStorage, while preserving admin edits for matching slugs.
 */
export function mergePortfolioWithDefaults(
  stored: PortfolioItem[],
  defaults: PortfolioItem[]
): PortfolioItem[] {
  const storedNorm = normalizePortfolio(stored);
  const defaultsNorm = normalizePortfolio(defaults);
  const storedBySlug = new Map(storedNorm.map((p) => [p.slug, p]));
  const merged: PortfolioItem[] = [];

  for (const def of defaultsNorm) {
    const fromStore = storedBySlug.get(def.slug);
    if (!fromStore) {
      merged.push(def);
      continue;
    }
    storedBySlug.delete(def.slug);
    const useDefaultHidden = isLegacyPlaceholder(def) && def.hidden === true;
    merged.push({
      ...def,
      ...fromStore,
      blocks: fromStore.blocks?.length ? fromStore.blocks : def.blocks,
      hidden: useDefaultHidden ? true : (fromStore.hidden ?? def.hidden),
    });
  }

  for (const extra of storedBySlug.values()) {
    merged.push(extra);
  }

  return normalizePortfolio(merged);
}

export function resolveLinkGroups(parsed: LegacyCmsData): LinkGroup[] {
  if (parsed.linkGroups?.length) {
    return ensureLinkGroupsComplete(parsed.linkGroups);
  }
  if (parsed.links?.length) {
    return ensureLinkGroupsComplete([
      {
        id: "personal",
        title: "Personal links",
        subtitle: "Imported from previous CMS",
        defaultOpen: false,
        links: parsed.links,
      },
    ]);
  }
  return defaultCmsData.linkGroups;
}

export function normalizeCmsData(parsed: LegacyCmsData): CmsData {
  const portfolio = parsed.portfolio?.length
    ? mergePortfolioWithDefaults(parsed.portfolio, defaultCmsData.portfolio)
    : defaultCmsData.portfolio;

  return {
    projects: parsed.projects?.length ? parsed.projects : defaultCmsData.projects,
    portfolio,
    linkGroups: resolveLinkGroups(parsed),
    resume: { ...defaultCmsData.resume, ...parsed.resume },
  };
}

import type { CmsData, LegacyCmsData, LinkGroup, PortfolioItem } from "@/types";
import { normalizePortfolio } from "@/lib/portfolio";
import { ensureLinkGroupsComplete } from "@/lib/link-groups-order";
import { CMS_PORTFOLIO_REVISION, defaultCmsData } from "./defaults";

/** Demo portfolio entries shipped before Behance import — never show again. */
export function isLegacyPlaceholder(item: PortfolioItem) {
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
    const storedUsesLegacyAssets = fromStore.blocks?.some(
      (b) => b.type === "image" && b.src?.includes("/behance/pre-tea/")
    );
    merged.push({
      ...def,
      ...fromStore,
      image: storedUsesLegacyAssets ? def.image : (fromStore.image || def.image),
      blocks:
        fromStore.blocks?.length && !storedUsesLegacyAssets ? fromStore.blocks : def.blocks,
      hidden: fromStore.hidden ?? def.hidden,
      behanceGalleryId: def.behanceGalleryId ?? fromStore.behanceGalleryId,
      engagement: def.engagement ?? fromStore.engagement ?? def.behanceEngagement ?? fromStore.behanceEngagement,
    });
  }

  for (const extra of storedBySlug.values()) {
    if (isLegacyPlaceholder(extra)) continue;
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
  const revision = parsed.portfolioRevision ?? 0;
  const storedPortfolio =
    revision >= CMS_PORTFOLIO_REVISION && parsed.portfolio?.length
      ? parsed.portfolio
      : [];
  const portfolio = storedPortfolio.length
    ? mergePortfolioWithDefaults(storedPortfolio, defaultCmsData.portfolio)
    : defaultCmsData.portfolio;

  return {
    projects: parsed.projects?.length ? parsed.projects : defaultCmsData.projects,
    portfolio,
    linkGroups: resolveLinkGroups(parsed),
    resume: { ...defaultCmsData.resume, ...parsed.resume },
    portfolioRevision: CMS_PORTFOLIO_REVISION,
  };
}

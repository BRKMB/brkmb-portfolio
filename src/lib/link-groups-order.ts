import type { LinkGroup } from "@/types";
import { defaultCmsData } from "@/lib/cms/defaults";

/** Canonical display order for /links dropdowns */
export const LINK_GROUP_ORDER = [
  "personal",
  "baryq",
  "benou",
  "blinkotp",
  "raby",
  "adzology",
] as const;

export function sortLinkGroups(groups: LinkGroup[]): LinkGroup[] {
  const rank = new Map<string, number>(LINK_GROUP_ORDER.map((id, i) => [id, i]));
  return [...groups].sort((a, b) => {
    const ai = rank.get(a.id) ?? 999;
    const bi = rank.get(b.id) ?? 999;
    if (ai !== bi) return ai - bi;
    return a.title.localeCompare(b.title);
  });
}

/** Re-order stored CMS groups and fill any missing groups from repo defaults */
export function mergeLinkGroupsWithDefaults(stored: LinkGroup[]): LinkGroup[] {
  const storedById = new Map(stored.map((g) => [g.id, g]));
  const defaultsById = new Map(defaultCmsData.linkGroups.map((g) => [g.id, g]));

  const ordered: LinkGroup[] = [];
  for (const id of LINK_GROUP_ORDER) {
    const group = storedById.get(id) ?? defaultsById.get(id);
    if (group) ordered.push(group);
  }

  for (const group of stored) {
    if (!LINK_GROUP_ORDER.includes(group.id as (typeof LINK_GROUP_ORDER)[number])) {
      ordered.push(group);
    }
  }

  return ordered;
}

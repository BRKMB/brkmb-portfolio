import type { LinkGroup } from "@/types";
import { defaultCmsData } from "@/lib/cms/defaults";

/** Fallback order when CMS has no custom order yet */
export const LINK_GROUP_ORDER = [
  "personal",
  "baryq",
  "benou",
  "blinkotp",
  "raby",
  "adzology",
] as const;

export function sortLinkGroupsByDefault(groups: LinkGroup[]): LinkGroup[] {
  const rank = new Map<string, number>(LINK_GROUP_ORDER.map((id, i) => [id, i]));
  return [...groups].sort((a, b) => {
    const ai = rank.get(a.id) ?? 999;
    const bi = rank.get(b.id) ?? 999;
    if (ai !== bi) return ai - bi;
    return a.title.localeCompare(b.title);
  });
}

/** Keep admin/CMS order; append any groups from defaults that are missing */
export function ensureLinkGroupsComplete(stored: LinkGroup[]): LinkGroup[] {
  if (!stored?.length) return defaultCmsData.linkGroups;

  const seen = new Set(stored.map((g) => g.id));
  const result = [...stored];

  for (const def of defaultCmsData.linkGroups) {
    if (!seen.has(def.id)) result.push(def);
  }

  return result;
}

/** @deprecated Use ensureLinkGroupsComplete — preserves stored order */
export function mergeLinkGroupsWithDefaults(stored: LinkGroup[]): LinkGroup[] {
  return ensureLinkGroupsComplete(stored);
}

export function reorderList<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
    return list;
  }
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

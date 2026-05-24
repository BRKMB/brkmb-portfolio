import type { LinkGroup } from "@/types";

export function isLinkVisible(link: { hidden?: boolean }) {
  return link.hidden !== true;
}

export function isGroupVisible(group: LinkGroup) {
  return group.hidden !== true;
}

/** Groups and links shown on the public /links page */
export function visibleLinkGroups(groups: LinkGroup[]): LinkGroup[] {
  return groups
    .filter(isGroupVisible)
    .map((group) => ({
      ...group,
      links: group.links.filter(isLinkVisible),
    }))
    .filter((group) => group.links.length > 0);
}

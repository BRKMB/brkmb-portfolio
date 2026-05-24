import type { CmsData, LegacyCmsData, LinkGroup } from "@/types";
import { ensureLinkGroupsComplete } from "@/lib/link-groups-order";
import { defaultCmsData } from "./defaults";

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
  return {
    projects: parsed.projects?.length ? parsed.projects : defaultCmsData.projects,
    portfolio: parsed.portfolio?.length ? parsed.portfolio : defaultCmsData.portfolio,
    linkGroups: resolveLinkGroups(parsed),
    resume: { ...defaultCmsData.resume, ...parsed.resume },
  };
}

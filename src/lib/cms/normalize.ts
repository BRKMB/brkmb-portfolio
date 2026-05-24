import type { CmsData, LegacyCmsData, LinkGroup } from "@/types";
import { defaultCmsData } from "./defaults";

export function resolveLinkGroups(parsed: LegacyCmsData): LinkGroup[] {
  if (parsed.linkGroups?.length) return parsed.linkGroups;
  if (parsed.links?.length) {
    return [
      {
        id: "personal",
        title: "Baher · Personal",
        subtitle: "Imported from previous CMS",
        defaultOpen: true,
        links: parsed.links,
      },
    ];
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

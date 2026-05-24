import projectsData from "@/data/projects.json";
import portfolioData from "@/data/portfolio.json";
import linkGroupsData from "@/data/link-groups.json";
import resumeData from "@/data/resume.json";
import type { CmsData, LinkGroup } from "@/types";

/** Bumped when default portfolio structure changes — invalidates stale browser CMS. */
export const CMS_STORAGE_KEY = "brkmb-cms-v4";
/** Must match `portfolioRevision` saved in localStorage; bump when portfolio.json changes. */
export const CMS_PORTFOLIO_REVISION = 4;
export const CMS_AUTH_KEY = "brkmb-cms-auth";
export const CMS_PREVIEW_KEY = "brkmb-cms-preview";

export const defaultCmsData: CmsData = {
  projects: projectsData as CmsData["projects"],
  portfolio: portfolioData as CmsData["portfolio"],
  linkGroups: linkGroupsData as LinkGroup[],
  resume: resumeData as CmsData["resume"],
};

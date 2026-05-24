import projectsData from "@/data/projects.json";
import portfolioData from "@/data/portfolio.json";
import linkGroupsData from "@/data/link-groups.json";
import resumeData from "@/data/resume.json";
import type { CmsData, LinkGroup } from "@/types";

export const CMS_STORAGE_KEY = "brkmb-cms-v1";
export const CMS_AUTH_KEY = "brkmb-cms-auth";
export const CMS_PREVIEW_KEY = "brkmb-cms-preview";

export const defaultCmsData: CmsData = {
  projects: projectsData as CmsData["projects"],
  portfolio: portfolioData as CmsData["portfolio"],
  linkGroups: linkGroupsData as LinkGroup[],
  resume: resumeData as CmsData["resume"],
};

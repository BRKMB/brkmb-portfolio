import projectsData from "@/data/projects.json";
import portfolioData from "@/data/portfolio.json";
import linksData from "@/data/links.json";
import resumeData from "@/data/resume.json";
import type { CmsData } from "@/types";

export const CMS_STORAGE_KEY = "brkmb-cms-v1";
export const CMS_AUTH_KEY = "brkmb-cms-auth";
export const CMS_PREVIEW_KEY = "brkmb-cms-preview";

export const defaultCmsData: CmsData = {
  projects: projectsData as CmsData["projects"],
  portfolio: portfolioData as CmsData["portfolio"],
  links: linksData as CmsData["links"],
  resume: resumeData as CmsData["resume"],
};

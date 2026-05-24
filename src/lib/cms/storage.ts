import type { CmsData } from "@/types";
import { CMS_STORAGE_KEY, defaultCmsData } from "./defaults";

export function loadCmsData(): CmsData {
  if (typeof window === "undefined") return defaultCmsData;
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return defaultCmsData;
    const parsed = JSON.parse(raw) as CmsData;
    return {
      projects: parsed.projects?.length ? parsed.projects : defaultCmsData.projects,
      portfolio: parsed.portfolio?.length ? parsed.portfolio : defaultCmsData.portfolio,
      links: parsed.links?.length ? parsed.links : defaultCmsData.links,
      resume: { ...defaultCmsData.resume, ...parsed.resume },
    };
  } catch {
    return defaultCmsData;
  }
}

export function saveCmsData(data: CmsData) {
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
}

export function resetCmsData() {
  localStorage.removeItem(CMS_STORAGE_KEY);
}

export function exportCmsJson(data: CmsData): string {
  return JSON.stringify(data, null, 2);
}

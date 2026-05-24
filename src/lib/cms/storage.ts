import type { CmsData, LegacyCmsData } from "@/types";
import { CMS_STORAGE_KEY, defaultCmsData } from "./defaults";
import { normalizeCmsData } from "./normalize";

export function loadCmsData(): CmsData {
  if (typeof window === "undefined") return defaultCmsData;
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return defaultCmsData;
    const parsed = JSON.parse(raw) as LegacyCmsData;
    return normalizeCmsData(parsed);
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

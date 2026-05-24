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

export function saveCmsData(data: CmsData): boolean {
  try {
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    const quota =
      err instanceof DOMException &&
      (err.name === "QuotaExceededError" || err.code === 22);
    if (quota && typeof window !== "undefined") {
      window.alert(
        "Could not save — browser storage is full. Export a JSON backup from Admin, use smaller images, or reset data."
      );
    }
    return false;
  }
}

export function resetCmsData() {
  localStorage.removeItem(CMS_STORAGE_KEY);
}

export function exportCmsJson(data: CmsData): string {
  return JSON.stringify(data, null, 2);
}

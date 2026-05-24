"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CmsData, LegacyCmsData, LinkGroup, PortfolioItem, Project, ResumeData } from "@/types";
import { normalizeCmsData } from "@/lib/cms/normalize";
import { ensureLinkGroupsComplete } from "@/lib/link-groups-order";
import { visibleLinkGroups } from "@/lib/link-groups-visible";
import {
  CMS_AUTH_KEY,
  CMS_PREVIEW_KEY,
  defaultCmsData,
} from "@/lib/cms/defaults";
import { exportCmsJson, loadCmsData, resetCmsData, saveCmsData } from "@/lib/cms/storage";

type CmsContextValue = {
  data: CmsData;
  previewAsVisitor: boolean;
  isAdminAuthed: boolean;
  setPreviewAsVisitor: (v: boolean) => void;
  login: (pin: string) => boolean;
  logout: () => void;
  updateData: (patch: Partial<CmsData>) => void;
  setProjects: (projects: Project[]) => void;
  setPortfolio: (portfolio: PortfolioItem[]) => void;
  setLinkGroups: (linkGroups: LinkGroup[]) => void;
  setResume: (resume: ResumeData) => void;
  resetToDefaults: () => void;
  exportJson: () => void;
  importJson: (json: string) => boolean;
};

const CmsContext = createContext<CmsContextValue | null>(null);

const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN ?? "brkmb2026";

export function CmsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CmsData>(defaultCmsData);
  const [hydrated, setHydrated] = useState(false);
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);
  const [previewAsVisitor, setPreviewAsVisitor] = useState(false);

  useEffect(() => {
    setData(loadCmsData());
    setIsAdminAuthed(sessionStorage.getItem(CMS_AUTH_KEY) === "1");
    setPreviewAsVisitor(sessionStorage.getItem(CMS_PREVIEW_KEY) === "1");
    setHydrated(true);
  }, []);

  const persist = useCallback((next: CmsData) => {
    setData(next);
    saveCmsData(next);
  }, []);

  const updateData = useCallback(
    (patch: Partial<CmsData>) => {
      persist({ ...data, ...patch });
    },
    [data, persist]
  );

  const value = useMemo<CmsContextValue>(
    () => ({
      data: hydrated ? data : defaultCmsData,
      previewAsVisitor,
      isAdminAuthed,
      setPreviewAsVisitor: (v) => {
        setPreviewAsVisitor(v);
        sessionStorage.setItem(CMS_PREVIEW_KEY, v ? "1" : "0");
      },
      login: (pin) => {
        if (pin !== ADMIN_PIN) return false;
        sessionStorage.setItem(CMS_AUTH_KEY, "1");
        setIsAdminAuthed(true);
        return true;
      },
      logout: () => {
        sessionStorage.removeItem(CMS_AUTH_KEY);
        setIsAdminAuthed(false);
      },
      updateData,
      setProjects: (projects) => updateData({ projects }),
      setPortfolio: (portfolio) => updateData({ portfolio }),
      setLinkGroups: (linkGroups) =>
        updateData({ linkGroups: ensureLinkGroupsComplete(linkGroups) }),
      setResume: (resume) => updateData({ resume }),
      resetToDefaults: () => {
        resetCmsData();
        setData(defaultCmsData);
      },
      exportJson: () => {
        const blob = new Blob([exportCmsJson(data)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "brkmb-cms-export.json";
        a.click();
        URL.revokeObjectURL(url);
      },
      importJson: (json) => {
        try {
          const parsed = JSON.parse(json) as LegacyCmsData;
          if (!parsed.projects || !parsed.portfolio) return false;
          if (!parsed.linkGroups?.length && !parsed.links?.length) return false;
          persist(normalizeCmsData(parsed));
          return true;
        } catch {
          return false;
        }
      },
    }),
    [data, hydrated, previewAsVisitor, isAdminAuthed, updateData, persist]
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used within CmsProvider");
  return ctx;
}

export function useProjects() {
  const { data } = useCms();
  return data.projects;
}

export function useProject(slug: string) {
  const { data } = useCms();
  return data.projects.find((p) => p.slug === slug);
}

export function usePortfolio() {
  const { data } = useCms();
  return data.portfolio;
}

export function useLinkGroups() {
  const { data } = useCms();
  return visibleLinkGroups(ensureLinkGroupsComplete(data.linkGroups));
}

export function useResume() {
  const { data } = useCms();
  return data.resume;
}

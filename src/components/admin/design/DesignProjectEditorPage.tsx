"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { DesignProjectStudio } from "@/components/admin/design/DesignProjectStudio";
import { useCms } from "@/components/providers/CmsProvider";
import {
  NEW_PROJECT_SLUG,
  createEmptyPortfolioItem,
  slugifyProjectTitle,
} from "@/lib/design-admin";
import { normalizePortfolio } from "@/lib/portfolio";

export function DesignProjectEditorPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { data, setPortfolio } = useCms();

  const portfolio = useMemo(() => normalizePortfolio(data.portfolio), [data.portfolio]);
  const index = portfolio.findIndex((p) => p.slug === slug);
  const item = index >= 0 ? portfolio[index] : null;

  useEffect(() => {
    if (slug !== NEW_PROJECT_SLUG) return;
    if (portfolio.some((p) => p.slug === NEW_PROJECT_SLUG)) return;
    setPortfolio([...portfolio, createEmptyPortfolioItem({ slug: NEW_PROJECT_SLUG, title: "New project" })]);
  }, [slug, portfolio, setPortfolio]);

  if (!slug) {
    router.replace("/admin/design/");
    return null;
  }

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f3f3f3]">
        <p className="text-sm text-[#666]">Project not found.</p>
        <button
          type="button"
          className="rounded-full bg-[#191919] px-5 py-2 text-sm text-white"
          onClick={() => router.push("/admin/design/")}
        >
          Back to projects
        </button>
      </div>
    );
  }

  const saveItem = (next: typeof item) => {
    const copy = [...portfolio];
    copy[index] = next;
    setPortfolio(copy);
  };

  const onContinue = () => {
    if (item.slug === NEW_PROJECT_SLUG) {
      const base = slugifyProjectTitle(item.title);
      let candidate = base;
      let n = 1;
      while (portfolio.some((p) => p.slug === candidate && p.id !== item.id)) {
        candidate = `${base}-${n++}`;
      }
      const copy = [...portfolio];
      copy[index] = { ...item, slug: candidate };
      setPortfolio(copy);
    }
    router.push("/admin/design/");
  };

  const onDelete = () => {
    if (!window.confirm(`Delete "${item.title}" permanently?`)) return;
    setPortfolio(portfolio.filter((_, i) => i !== index));
    router.push("/admin/design/");
  };

  return (
    <DesignProjectStudio
      item={item}
      projectIndex={index}
      onChange={saveItem}
      onClose={onContinue}
      onDelete={onDelete}
    />
  );
}

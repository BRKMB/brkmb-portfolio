"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { DesignAdminCard } from "@/components/admin/design/DesignAdminCard";
import { useCms } from "@/components/providers/CmsProvider";
import { fetchProjectStats, type ProjectStats } from "@/lib/design-engagement/api";
import { NEW_PROJECT_SLUG, createEmptyPortfolioItem } from "@/lib/design-admin";
import { normalizePortfolio } from "@/lib/portfolio";

export function DesignAdminListPage() {
  const router = useRouter();
  const { data, setPortfolio } = useCms();
  const portfolio = normalizePortfolio(data.portfolio);
  const categories = ["All", ...Array.from(new Set(portfolio.map((p) => p.category)))];
  const [filter, setFilter] = useState("All");
  const visible = portfolio.filter((p) => p.slug !== NEW_PROJECT_SLUG);
  const items = filter === "All" ? visible : visible.filter((p) => p.category === filter);
  const slugsKey = useMemo(() => items.map((p) => p.slug).join(","), [items]);
  const [statsMap, setStatsMap] = useState<Record<string, ProjectStats>>({});

  useEffect(() => {
    const slugs = items.map((p) => p.slug);
    if (!slugs.length) return;
    fetchProjectStats(slugs).then(setStatsMap);
  }, [slugsKey, items]);

  const addProject = () => {
    const withoutDraft = portfolio.filter((p) => p.slug !== NEW_PROJECT_SLUG);
    setPortfolio([
      ...withoutDraft,
      createEmptyPortfolioItem({ slug: NEW_PROJECT_SLUG, title: "New project" }),
    ]);
    router.push(`/admin/design/${NEW_PROJECT_SLUG}/`);
  };

  return (
    <div className="min-h-screen px-4 pt-28 pb-20 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link href="/admin/" className="chip-glass text-subheadline px-4 py-2">
            ← Admin
          </Link>
          <button type="button" className="btn-primary text-subheadline ml-auto px-4 py-2" onClick={addProject}>
            + New project
          </button>
          <Link href="/design/" className="chip-glass text-subheadline px-4 py-2" target="_blank">
            View public grid
          </Link>
        </div>

        <PageHeader
          title="Design projects"
          subtitle="Manage your portfolio — same grid as the public page, with a settings icon to edit each project."
        />

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={
                filter === cat
                  ? "chip-glass-active text-subheadline rounded-full px-4 py-2"
                  : "chip-glass text-subheadline v-secondary rounded-full px-4 py-2 transition hover:v-primary"
              }
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="behance-grid behance-grid--projects mt-8">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.3 }}
            >
              <DesignAdminCard item={item} stats={statsMap[item.slug]} />
            </motion.div>
          ))}
        </motion.div>

        {items.length === 0 ? (
          <p className="text-footnote mt-12 text-center v-tertiary">
            No projects yet — click <strong className="v-primary">+ New project</strong> to open the editor.
          </p>
        ) : null}
      </div>
    </div>
  );
}

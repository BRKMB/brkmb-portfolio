"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { DesignCard } from "@/components/design/DesignCard";
import { usePortfolio } from "@/components/providers/CmsProvider";
import { designFilterCategoriesForPortfolio } from "@/lib/design-categories";
import { getProjectStats } from "@/lib/portfolio-engagement";
import { normalizePortfolio } from "@/lib/portfolio";

export default function DesignPage() {
  const rawPortfolio = usePortfolio();
  const portfolio = useMemo(
    () => normalizePortfolio(rawPortfolio.filter((p) => p.hidden !== true)),
    [rawPortfolio]
  );
  const categories = useMemo(() => designFilterCategoriesForPortfolio(portfolio), [portfolio]);
  const [filter, setFilter] = useState("All");
  const items = useMemo(
    () => (filter === "All" ? portfolio : portfolio.filter((p) => p.category === filter)),
    [portfolio, filter]
  );

  return (
    <div className="min-h-screen px-4 pt-28 pb-20 md:px-8 md:pt-32">
      <div className="mx-auto max-w-[1400px]">
        <PageHeader
          title="Designs"
          subtitle="Identity, advertising, packaging, and motion."
        />

        <div className="mt-8 flex flex-wrap gap-2 sm:mt-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              data-cursor
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

        <div className="behance-grid behance-grid--projects mt-8">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.24), duration: 0.3 }}
            >
              <DesignCard item={item} stats={getProjectStats(item)} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

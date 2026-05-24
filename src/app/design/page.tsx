"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { DesignCard } from "@/components/design/DesignCard";
import { usePortfolio } from "@/components/providers/CmsProvider";
import { normalizePortfolio } from "@/lib/portfolio";

export default function DesignPage() {
  const portfolio = normalizePortfolio(usePortfolio().filter((p) => p.hidden !== true));
  const categories = ["All", ...Array.from(new Set(portfolio.map((p) => p.category)))];
  const [filter, setFilter] = useState("All");
  const items = filter === "All" ? portfolio : portfolio.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen px-4 pt-32 pb-20 md:px-8">
      <div className="mx-auto max-w-[1280px]">
        <PageHeader
          title="Design work"
          subtitle="Brand identity, UI, posters, packaging, and motion — curated like a Behance profile."
        />

        <div className="mt-10 flex flex-wrap gap-2">
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

        <motion.div
          layout
          className="behance-grid mt-10"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.025, duration: 0.35 }}
            >
              <DesignCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

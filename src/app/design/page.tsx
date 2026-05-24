"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { usePortfolio } from "@/components/providers/CmsProvider";

export default function DesignPage() {
  const portfolio = usePortfolio();
  const [lightbox, setLightbox] = useState<string | null>(null);
  const active = portfolio.find((p) => p.image === lightbox);

  const categories = ["All", ...Array.from(new Set(portfolio.map((p) => p.category)))];
  const [filter, setFilter] = useState("All");
  const items = filter === "All" ? portfolio : portfolio.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen px-4 pt-32 pb-20 md:px-8">
      <div className="mx-auto max-w-6xl">
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

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
              onClick={() => setLightbox(item.image)}
              data-cursor
              className="focus-ring mb-4 w-full break-inside-avoid overflow-hidden rounded-[20px] text-left"
            >
              <div className="glass-card group !overflow-hidden !p-0">
                <div
                  className={`relative overflow-hidden ${
                    item.aspect === "tall"
                      ? "min-h-[320px]"
                      : item.aspect === "wide"
                        ? "min-h-[200px]"
                        : "min-h-[260px]"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute right-0 bottom-0 left-0 p-5 translate-y-2 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-caption text-accent">{item.category}</p>
                    <p className="font-display text-headline mt-1 v-primary">{item.title}</p>
                    {item.description ? (
                      <p className="text-footnote mt-1 line-clamp-2 v-secondary">{item.description}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="glass-sheet max-h-[90vh] max-w-5xl overflow-hidden p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={active.image}
                alt={active.title}
                width={1200}
                height={900}
                className="max-h-[82vh] w-auto rounded-[20px] object-contain"
              />
              <div className="p-4">
                <p className="text-caption text-accent">{active.category}</p>
                <p className="font-display text-title-3 mt-1 v-primary">{active.title}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

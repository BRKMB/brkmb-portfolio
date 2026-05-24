"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { portfolio } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

const aspectClass = {
  tall: "md:row-span-2",
  wide: "md:col-span-2",
  square: "",
};

export function PortfolioGallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const active = portfolio.find((p) => p.id === lightbox);

  return (
    <section id="portfolio" className="scroll-mt-28 px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Design"
          title="Portfolio gallery"
          description="Brand identity, posters, social, packaging, UI — masonry layout."
        />

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {portfolio.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              data-cursor
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.05 }}
              onClick={() => setLightbox(item.id)}
              className={cn(
                "mb-4 w-full break-inside-avoid overflow-hidden rounded-2xl text-left",
                "group glass gradient-border"
              )}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-indigo-950/60 to-violet-950/40 sm:aspect-auto sm:min-h-[200px]">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={600}
                  height={800}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="absolute right-0 bottom-0 left-0 p-4 translate-y-2 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-xs text-indigo-300 uppercase tracking-wider">{item.category}</p>
                  <p className="font-medium text-white">{item.title}</p>
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
            className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={active.image}
                alt={active.title}
                width={1200}
                height={900}
                className="max-h-[85vh] w-auto object-contain"
              />
              <p className="absolute bottom-4 left-4 text-lg font-medium text-white">{active.title}</p>
              <button
                type="button"
                className="absolute top-4 right-4 rounded-full bg-white/10 px-4 py-2 text-sm text-white"
                onClick={() => setLightbox(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

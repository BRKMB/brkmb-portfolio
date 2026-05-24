"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { portfolio } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function PortfolioGallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const active = portfolio.find((p) => p.id === lightbox);

  return (
    <section id="portfolio" className="scroll-mt-28 px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Graphic design"
          title="Where the designer shows up"
          description="Brand identity, posters, social, packaging, UI — the visual craft behind everything I build."
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
              className="mb-4 w-full break-inside-avoid overflow-hidden rounded-2xl text-left glass gradient-border group"
            >
              <div className="relative min-h-[220px] overflow-hidden bg-gradient-to-br from-[#0a1008] to-[#142210]">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={600}
                  height={800}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040806]/90 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="absolute right-0 bottom-0 left-0 p-5 translate-y-2 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[10px] tracking-[0.2em] text-accent uppercase">{item.category}</p>
                  <p className="font-display mt-1 text-lg text-white">{item.title}</p>
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
            className="fixed inset-0 z-[10001] flex items-center justify-center bg-[#040806]/95 p-4 backdrop-blur-xl"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl border border-[#c9f31d]/20"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={active.image}
                alt={active.title}
                width={1200}
                height={900}
                className="max-h-[85vh] w-auto object-contain"
              />
              <p className="absolute bottom-4 left-4 font-display text-xl text-white">{active.title}</p>
              <button
                type="button"
                className="absolute top-4 right-4 rounded-full glass px-4 py-2 text-sm text-white"
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

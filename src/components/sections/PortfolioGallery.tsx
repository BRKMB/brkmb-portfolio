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
    <section id="portfolio" className="scroll-mt-36 px-4 py-24 md:px-8 md:py-32">
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
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.04, ease: [0.32, 0.72, 0, 1] }}
              onClick={() => setLightbox(item.id)}
              className="focus-ring mb-4 w-full break-inside-avoid overflow-hidden rounded-[20px] text-left"
            >
              <div className="glass-card group !overflow-hidden !p-0">
                <div className="relative min-h-[200px] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={800}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute right-0 bottom-0 left-0 p-5 translate-y-2 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-caption text-accent uppercase tracking-wider">{item.category}</p>
                    <p className="font-display text-title-3 mt-1 v-primary">{item.title}</p>
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
            className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/25 p-4 backdrop-blur-md"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ ease: [0.32, 0.72, 0, 1] }}
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
              <p className="absolute bottom-6 left-6 font-display text-title-3 v-primary">{active.title}</p>
              <button
                type="button"
                className="btn-glass focus-ring absolute top-4 right-4 !min-h-[44px]"
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

"use client";

import { motion } from "framer-motion";
import { timeline } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Building() {
  return (
    <section id="building" className="scroll-mt-28 px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Now"
          title="Currently building"
          description="Active ventures and where focus lives right now."
        />

        <div className="relative space-y-0 border-l border-white/10 pl-8 md:pl-12">
          {timeline.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative pb-12 last:pb-0"
            >
              <span className="absolute top-1 -left-[41px] flex h-5 w-5 items-center justify-center rounded-full border border-indigo-500/50 bg-[#030308] md:-left-[53px]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
              </span>

              <div className="glass gradient-border rounded-2xl p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{item.project}</h3>
                    <p className="mt-1 text-white/50">{item.task}</p>
                  </div>
                  <span className="text-2xl font-bold text-indigo-400">{item.progress}%</span>
                </div>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

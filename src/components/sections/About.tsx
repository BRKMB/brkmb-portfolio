"use client";

import { motion } from "framer-motion";
import { about } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function About() {
  return (
    <section id="about" className="scroll-mt-28 px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader label="Story" title="Founder first. Designer always." />

        <div className="grid gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-base leading-relaxed text-white/55 md:text-lg"
          >
            <p>
              <span className="font-display text-white">Who I am.</span> {about.who}
            </p>
            <p>
              <span className="font-display text-white">What I build.</span> {about.build}
            </p>
            <p>
              <span className="font-display text-white">What I believe.</span> {about.believe}
            </p>
            <p>
              <span className="font-display text-white">How I work.</span> {about.process}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {about.roles.map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className={cn(
                  "glass gradient-border rounded-2xl p-5 md:p-6",
                  role.title === "Graphic Designer" && "border-[#c9f31d]/20"
                )}
              >
                <span className="font-display text-2xl text-accent">◆</span>
                <h3 className="mt-3 font-display text-lg text-white">{role.title}</h3>
                <p className="mt-2 text-sm text-white/45">{role.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

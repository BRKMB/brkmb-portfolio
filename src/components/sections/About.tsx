"use client";

import { motion } from "framer-motion";
import { about } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

export function About() {
  return (
    <section id="about" className="scroll-mt-32 px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader label="Story" title="Founder first. Designer always." />

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ease: [0.32, 0.72, 0, 1] }}
            className="glass-sheet space-y-6 p-8"
          >
            {[
              { label: "Who I am", text: about.who },
              { label: "What I build", text: about.build },
              { label: "What I believe", text: about.believe },
              { label: "How I work", text: about.process },
            ].map((block) => (
              <p key={block.label} className="text-body v-secondary leading-relaxed">
                <span className="font-display text-headline v-primary">{block.label}. </span>
                {block.text}
              </p>
            ))}
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {about.roles.map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, ease: [0.32, 0.72, 0, 1] }}
                className={cn(
                  "glass-card p-5 md:p-6 !rounded-[16px]",
                  role.title === "Graphic Designer" && "ring-1 ring-[#c9f31d]/20"
                )}
              >
                <span className="text-title-2 text-accent">◆</span>
                <h3 className="font-display text-headline mt-3 v-primary">{role.title}</h3>
                <p className="text-subheadline mt-2 v-tertiary">{role.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

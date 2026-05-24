"use client";

import { motion } from "framer-motion";
import { contact } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";

const icons: Record<string, string> = {
  mail: "✉",
  linkedin: "in",
  github: "⌘",
  instagram: "◎",
  whatsapp: "W",
};

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-32 px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Contact"
          title="Build with me"
          description="Partnerships, ventures, or selective design collaborations — if it starts with a real idea."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contact.map((item, i) => (
            <motion.a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, ease: [0.32, 0.72, 0, 1] }}
              className="glass-card focus-ring flex min-h-[72px] items-center gap-4 p-5 !rounded-[20px]"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] text-headline font-semibold text-accent"
                style={{
                  background: "rgba(201, 243, 29, 0.12)",
                  boxShadow: "inset 0 1px 0.5px rgba(255,255,255,0.2)",
                }}
              >
                {icons[item.icon] || "→"}
              </span>
              <div>
                <p className="text-headline v-primary">{item.label}</p>
                <p className="text-footnote v-tertiary">Open →</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

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
    <section id="contact" className="scroll-mt-28 px-4 py-24 md:px-8 md:py-32">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass gradient-border group flex items-center gap-4 rounded-2xl p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c9f31d]/12 text-lg font-bold text-accent transition group-hover:bg-[#c9f31d]/20">
                {icons[item.icon] || "→"}
              </span>
              <div>
                <p className="font-medium text-white">{item.label}</p>
                <p className="text-sm text-white/40">Open →</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

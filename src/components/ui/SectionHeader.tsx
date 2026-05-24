"use client";

import { motion } from "framer-motion";

type Props = {
  label: string;
  title: string;
  description?: string;
};

export function SectionHeader({ label, title, description }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="mb-12 md:mb-16"
    >
      <span className="text-caption text-accent font-medium tracking-[0.2em] uppercase">
        {label}
      </span>
      <h2 className="font-display text-title-1 mt-4 v-primary [text-wrap:balance]">{title}</h2>
      {description && (
        <p className="text-body mt-5 max-w-2xl v-secondary leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
}

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
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mb-12 md:mb-16"
    >
      <span className="text-xs font-medium tracking-[0.25em] text-accent uppercase">
        {label}
      </span>
      <h2 className="font-display mt-4 text-3xl font-medium tracking-tight text-white md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/50 md:text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
}

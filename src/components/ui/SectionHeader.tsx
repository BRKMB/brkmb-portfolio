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
      <span className="text-xs font-medium tracking-[0.2em] text-indigo-400 uppercase">
        {label}
      </span>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-base text-white/50 md:text-lg">{description}</p>
      )}
    </motion.div>
  );
}

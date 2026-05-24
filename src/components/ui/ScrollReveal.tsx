"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const ease = [0.32, 0.72, 0, 1] as const;

/* Opacity-only: transform on sections breaks backdrop-filter on fixed nav (Chromium/Brave) */
const variants: Record<string, Variants> = {
  up: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scale: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  left: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  right: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: keyof typeof variants;
  as?: "div" | "section";
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.65,
  variant = "up",
  as = "div",
}: Props) {
  const Comp = as === "section" ? motion.section : motion.div;

  return (
    <Comp
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px", amount: 0.15 }}
      variants={variants[variant]}
      transition={{ duration, delay, ease }}
      className={cn(className)}
    >
      {children}
    </Comp>
  );
}

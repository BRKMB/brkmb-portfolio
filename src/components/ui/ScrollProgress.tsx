"use client";

import { useScroll, useSpring, useTransform, motion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 32 });
  const width = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <div
      className="pointer-events-none fixed top-0 right-0 left-0 z-[9997] h-[3px] overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="h-full rounded-full bg-[#c9f31d]/90"
        style={{ width, boxShadow: "0 0 12px rgba(201,243,29,0.5)" }}
      />
    </div>
  );
}

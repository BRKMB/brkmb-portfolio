"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 32 });

  return (
    <motion.div
      className="fixed top-0 right-0 left-0 z-[9997] h-[3px] origin-left rounded-full bg-[#c9f31d]/90"
      style={{ scaleX, boxShadow: "0 0 12px rgba(201,243,29,0.5)" }}
    />
  );
}

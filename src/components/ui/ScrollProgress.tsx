"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 right-0 left-0 z-[9997] h-[2px] origin-left bg-gradient-to-r from-[#d4ff4d] via-[#c9f31d] to-[#7cb342]"
      style={{ scaleX }}
    />
  );
}

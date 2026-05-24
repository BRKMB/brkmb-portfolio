"use client";

import { motion } from "framer-motion";

/** Ambient orbs — refract through glass layers above vibrant body mesh */
export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -top-20 left-[5%] h-[420px] w-[420px] rounded-full bg-[#c9f31d]/25 blur-[100px]"
        animate={{ opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[30%] right-[-5%] h-[360px] w-[360px] rounded-full bg-[#34C759]/20 blur-[90px]"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute bottom-0 left-[40%] h-[280px] w-[280px] rounded-full bg-[#0A84FF]/15 blur-[80px]"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}

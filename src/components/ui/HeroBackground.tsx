"use client";

import { motion } from "framer-motion";

/** Ambient orbs — refract through glass layers above vibrant body mesh */
export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -top-20 left-[5%] h-[420px] w-[420px] rounded-full bg-[#c9f31d]/18 blur-[100px]"
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[30%] right-[-5%] h-[360px] w-[360px] rounded-full bg-[#34C759]/14 blur-[90px]"
        animate={{ opacity: [0.25, 0.42, 0.25] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-[18%] left-[42%] h-[320px] w-[320px] rounded-full bg-[#9356dc]/20 blur-[95px]"
        animate={{ opacity: [0.22, 0.4, 0.22] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-0 left-[40%] h-[280px] w-[280px] rounded-full bg-[#7b2ff7]/14 blur-[80px]"
        animate={{ opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}

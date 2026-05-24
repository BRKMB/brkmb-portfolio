"use client";

import { motion } from "framer-motion";

export function Loader() {
  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center glass-thick"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
    >
      <motion.div
        className="glass-card flex h-[72px] w-[72px] items-center justify-center !rounded-[20px]"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="font-display text-title-2 gradient-text">B</span>
      </motion.div>
      <motion.p
        className="mt-6 text-footnote v-tertiary tracking-[0.35em] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Baher
      </motion.p>
      <div className="mt-5 h-1 w-28 overflow-hidden rounded-full glass-ultra-thin">
        <motion.div
          className="h-full rounded-full bg-[#c9f31d]/90"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: [0.32, 0.72, 0, 1] }}
        />
      </div>
    </motion.div>
  );
}

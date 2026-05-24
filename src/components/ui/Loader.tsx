"use client";

import { motion } from "framer-motion";

export function Loader() {
  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#030308]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <span className="text-xl font-bold gradient-text">B</span>
      </motion.div>
      <motion.p
        className="mt-6 text-sm tracking-[0.3em] text-white/40 uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        BRKMB
      </motion.p>
      <motion.div
        className="mt-4 h-0.5 w-32 overflow-hidden rounded-full bg-white/10"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { SiteLogo } from "@/components/ui/SiteLogo";

export function Loader() {
  return (
    <motion.div
      className="site-loader fixed inset-0 z-[10000] flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
    >
      <SiteLogo size="lg" showWordmark={false} priority />
      <div className="site-loader__bar mt-6 h-px w-24 overflow-hidden">
        <motion.div
          className="h-full"
          style={{ backgroundColor: "var(--color-accent)" }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        />
      </div>
    </motion.div>
  );
}

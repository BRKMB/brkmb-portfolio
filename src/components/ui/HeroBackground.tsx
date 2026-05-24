"use client";

import { motion } from "framer-motion";

export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(201,243,29,0.14),transparent_65%)]" />
      <div className="absolute top-1/4 -right-1/4 h-[480px] w-[480px] rounded-full bg-[#c9f31d]/10 blur-[130px]" />
      <div className="absolute bottom-1/4 -left-1/4 h-[360px] w-[360px] rounded-full bg-[#3d5c1a]/40 blur-[100px]" />

      <motion.div
        className="absolute top-[20%] left-[10%] h-64 w-64 rounded-full border border-[#c9f31d]/10"
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[15%] bottom-[25%] h-40 w-40 rounded-full border border-white/5"
        animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {Array.from({ length: 12 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-[#c9f31d]/50"
          style={{
            left: `${(i * 19) % 100}%`,
            top: `${(i * 27) % 100}%`,
          }}
          animate={{ opacity: [0.15, 0.6, 0.15] }}
          transition={{
            duration: 4 + (i % 4),
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

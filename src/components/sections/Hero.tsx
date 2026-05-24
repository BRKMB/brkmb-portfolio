"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { HeroBackground } from "@/components/ui/HeroBackground";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-4 pt-32 pb-20 md:px-8">
      <HeroBackground />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="chip-glass mx-auto inline-flex px-4 py-2 text-caption text-accent"
        >
          brkmb.com
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="font-display text-large-title mt-8 gradient-text"
        >
          {site.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.55, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="text-headline mt-5 v-secondary"
        >
          {site.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.65, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="text-body mx-auto mt-8 max-w-2xl v-primary leading-relaxed"
        >
          {site.heroLine}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="mt-11 flex flex-wrap items-center justify-center gap-3"
        >
          <Button href="#brands">My ventures</Button>
          <Button href="#portfolio" variant="ghost">
            Design work
          </Button>
          <Button href="#contact" variant="ghost">
            Contact
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-4"
        >
          {site.stats.map((stat) => (
            <div key={stat.label} className="glass-card p-5 text-center !rounded-[16px]">
              <p className="font-display text-title-2 v-primary">
                {stat.value}
                <span className="text-accent">{stat.suffix}</span>
              </p>
              <p className="text-caption mt-2 v-tertiary uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

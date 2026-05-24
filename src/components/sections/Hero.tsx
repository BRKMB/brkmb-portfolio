"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { HeroBackground } from "@/components/ui/HeroBackground";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-4 pt-28 pb-16 md:px-8">
      <HeroBackground />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.6 }}
          className="font-display text-sm italic tracking-wide text-accent/90"
        >
          brkmb.com
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.7 }}
          className="font-display mt-4 text-5xl leading-[1.05] font-medium tracking-tight md:text-7xl lg:text-[5.5rem]"
        >
          <span className="gradient-text">{site.name}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.65, duration: 0.6 }}
          className="mt-5 text-base tracking-wide text-white/55 md:text-lg"
        >
          {site.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.75, duration: 0.6 }}
          className="font-display mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-white/75 md:text-2xl"
        >
          {site.heroLine}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.9, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.05, duration: 0.7 }}
          className="mt-16 flex flex-wrap justify-center gap-8 md:gap-14"
        >
          {site.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl text-white md:text-4xl">
                {stat.value}
                <span className="text-accent">{stat.suffix}</span>
              </p>
              <p className="mt-1 text-xs tracking-wider text-white/40 uppercase">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

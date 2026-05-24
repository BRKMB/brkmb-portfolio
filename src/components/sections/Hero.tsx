"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { HeroBackground } from "@/components/ui/HeroBackground";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-28 pb-20 md:px-8">
      <HeroBackground />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.6 }}
          className="mb-4 text-sm tracking-[0.25em] text-indigo-400 uppercase"
        >
          Digital Headquarters
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.7 }}
          className="text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl"
        >
          <span className="gradient-text">{site.name}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.65, duration: 0.6 }}
          className="mt-4 text-lg text-white/70 md:text-xl"
        >
          {site.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.75, duration: 0.6 }}
          className="mx-auto mt-6 max-w-xl text-base text-white/45 md:text-lg"
        >
          I design brands, build products, and turn ideas into real experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.9, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button href="#projects">View Projects</Button>
          <Button href="#contact" variant="ghost">
            Contact Me
          </Button>
          <Button href="/resume/" variant="ghost">
            Resume
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.1, duration: 0.7 }}
          className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {site.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass gradient-border rounded-2xl p-5 text-left"
            >
              <p className="text-2xl font-bold text-white md:text-3xl">
                {stat.value}
                <span className="text-indigo-400">{stat.suffix}</span>
              </p>
              <p className="mt-1 text-xs text-white/40 md:text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { site } from "@/lib/data";
import { Button } from "@/components/ui/Button";

const ease = [0.16, 1, 0.3, 1] as const;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 34 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.95, ease },
});

export function Hero() {
  const [firstName, lastName] = site.name.split(" ");
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end px-5 pt-32 pb-14 md:px-10 md:pb-20"
    >
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-6xl"
      >
        <motion.div
          {...rise(0.05)}
          className="flex flex-wrap items-center gap-x-5 gap-y-2"
        >
          <span className="text-caption tracking-[0.3em] uppercase text-accent">
            {site.tagline}
          </span>
          <span className="text-caption hidden items-center gap-2 tracking-[0.2em] uppercase v-tertiary sm:inline-flex">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            Warsaw, Poland
          </span>
        </motion.div>

        <h1 className="font-display mt-6 uppercase leading-[0.9]">
          <motion.span {...rise(0.12)} className="text-mega block v-primary">
            {firstName}
          </motion.span>
          <motion.span {...rise(0.2)} className="text-mega text-outline block">
            {lastName}
          </motion.span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <motion.p
            {...rise(0.32)}
            className="text-body max-w-md v-secondary leading-relaxed md:text-lg"
          >
            {site.heroLine}
          </motion.p>

          <motion.div {...rise(0.4)} className="flex flex-wrap items-center gap-3">
            <Button href="/projects/">Ventures</Button>
            <Button href="/designs/" variant="ghost">
              Selected work
            </Button>
          </motion.div>
        </div>

        <motion.div
          {...rise(0.52)}
          className="mt-14 grid grid-cols-3 gap-3 border-t border-subtle pt-6 sm:gap-6 sm:pt-8 md:mt-20 md:gap-10"
        >
          {site.stats.map((stat) => (
            <div key={stat.label} className="min-w-0">
              <p className="font-display text-title-2 sm:text-title-1 v-primary">
                {stat.value}
                <span className="text-accent">{stat.suffix}</span>
              </p>
              <p className="text-caption mt-1.5 sm:mt-2 v-tertiary uppercase tracking-[0.12em] sm:tracking-[0.16em]">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        style={{ opacity: contentOpacity }}
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:block"
      >
        <span className="hero-scroll-hint" aria-hidden />
      </motion.div>
    </section>
  );
}

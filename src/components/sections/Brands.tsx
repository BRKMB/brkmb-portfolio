"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { brands } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { statusColor, cn } from "@/lib/utils";

function BrandCard({ brand }: { brand: (typeof brands)[0] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -6 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="group relative w-[300px] shrink-0 md:w-[340px]"
    >
      <Link
        href={brand.href || "#"}
        data-cursor
        className="glass gradient-border block rounded-3xl p-7"
        style={{ boxShadow: `0 0 80px ${brand.accent}12` }}
      >
        <p className="text-[10px] font-medium tracking-[0.2em] text-accent uppercase">
          {brand.ownership}
        </p>
        <div
          className="mt-4 mb-5 flex h-16 w-16 items-center justify-center rounded-2xl font-display text-2xl font-semibold"
          style={{ background: `${brand.accent}18`, color: brand.accent }}
        >
          {brand.logo}
        </div>
        <h3 className="font-display text-2xl text-white">{brand.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/55">{brand.description}</p>
        <span
          className={cn(
            "mt-5 inline-block rounded-full border px-3 py-1 text-xs font-medium",
            statusColor(brand.status)
          )}
        >
          {brand.status}
        </span>
      </Link>
    </motion.div>
  );
}

export function Brands() {
  const doubled = [...brands, ...brands];

  return (
    <section id="brands" className="scroll-mt-28 px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Founder"
          title="Brands I conceived & built"
          description="Not client work. Not a logo brief. These started in my head — strategy, name, visual world, product — then I built them."
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="-mt-6 mb-12 max-w-3xl text-sm leading-relaxed text-white/40 md:text-base"
        >
          BARYQ · BENOU · BlinkOTP · RABY — every venture below is mine from the first sketch.
        </motion.p>

        <div className="relative overflow-hidden rounded-3xl border border-[rgba(201,243,29,0.06)] py-2">
          <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-28 bg-gradient-to-r from-[#040806] to-transparent" />
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-28 bg-gradient-to-l from-[#040806] to-transparent" />

          <motion.div
            className="flex gap-6 py-4 pl-4"
            animate={{ x: [0, -(340 + 24) * brands.length] }}
            transition={{
              x: { repeat: Infinity, duration: 45, ease: "linear" },
            }}
          >
            {doubled.map((brand, i) => (
              <BrandCard key={`${brand.id}-${i}`} brand={brand} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

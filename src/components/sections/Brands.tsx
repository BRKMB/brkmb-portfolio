"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { brands } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { statusColor, cn } from "@/lib/utils";

function BrandCard({ brand }: { brand: (typeof brands)[0] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative w-[280px] shrink-0 md:w-[320px]"
    >
      <Link
        href={brand.href || "#projects"}
        data-cursor
        className="glass gradient-border block rounded-2xl p-6"
        style={{ boxShadow: `0 0 60px ${brand.accent}15` }}
      >
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold"
          style={{ background: `${brand.accent}22`, color: brand.accent }}
        >
          {brand.logo}
        </div>
        <h3 className="text-xl font-semibold text-white">{brand.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/50">{brand.description}</p>
        <span
          className={cn(
            "mt-4 inline-block rounded-full border px-3 py-1 text-xs font-medium",
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
          label="Foundership"
          title="Brands I build"
          description="Founder & co-founder ventures — from luxury fashion to enterprise software."
        />

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-24 bg-gradient-to-r from-[#030308] to-transparent" />
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-24 bg-gradient-to-l from-[#030308] to-transparent" />

          <motion.div
            className="flex gap-6"
            animate={{ x: [0, -50 * brands.length * 6.4] }}
            transition={{
              x: { repeat: Infinity, duration: 40, ease: "linear" },
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

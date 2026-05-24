"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { brands } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { statusColor, cn } from "@/lib/utils";

function BrandCard({ brand }: { brand: (typeof brands)[0] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      className="w-[300px] shrink-0 md:w-[320px]"
    >
      <Link
        href={brand.href || "#"}
        data-cursor
        className="glass-card block p-6 !rounded-[20px] focus-ring"
        style={{ boxShadow: `var(--shadow-glass-dark), 0 0 48px ${brand.accent}10` }}
      >
        <p className="text-caption text-accent font-medium tracking-[0.15em] uppercase">
          {brand.ownership}
        </p>
        <div
          className="mt-4 mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-[12px] text-title-2 font-semibold"
          style={{
            background: `${brand.accent}20`,
            boxShadow: `inset 0 1px 0.5px rgba(255,255,255,0.2)`,
          }}
        >
          {brand.logoImage ? (
            <Image src={brand.logoImage} alt={brand.name} width={56} height={56} className="h-full w-full object-cover" />
          ) : (
            <span style={{ color: brand.accent }}>{brand.logo}</span>
          )}
        </div>
        <h3 className="font-display text-title-3 v-primary">{brand.name}</h3>
        <p className="text-subheadline mt-3 leading-relaxed v-secondary">{brand.description}</p>
        <span
          className={cn(
            "text-caption mt-5 inline-block rounded-full border px-3 py-1 font-medium",
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
    <section id="brands" className="scroll-mt-36 px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Founder"
          title="Brands I conceived & built"
          description="Not client work. Not a logo brief. These started in my head — strategy, name, visual world, product — then I built them."
        />

        <p className="text-subheadline -mt-6 mb-10 max-w-3xl v-tertiary">
          BARYQ · BENOU · BlinkOTP · RABY — every venture below is mine from the first sketch.
        </p>

        <div className="glass-sheet relative overflow-hidden p-2">
          <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-20 bg-gradient-to-r from-[rgba(20,20,22,0.9)] to-transparent" />
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-20 bg-gradient-to-l from-[rgba(20,20,22,0.9)] to-transparent" />

          <motion.div
            className="flex gap-4 py-3 pl-2"
            animate={{ x: [0, -(320 + 16) * brands.length] }}
            transition={{ x: { repeat: Infinity, duration: 48, ease: "linear" } }}
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

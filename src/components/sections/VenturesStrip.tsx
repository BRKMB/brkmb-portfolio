"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { brands } from "@/lib/data";
import { statusColor, cn } from "@/lib/utils";

export function VenturesStrip() {
  const ventures = brands.filter((b) => b.id !== "future");

  return (
    <section className="px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-caption tracking-[0.2em] uppercase text-accent">Ventures</p>
            <h2 className="font-display text-title-1 mt-2 v-primary">Brands I built</h2>
          </div>
          <Link href="/projects/" data-cursor className="text-subheadline shrink-0 text-accent">
            All projects →
          </Link>
        </div>

        <div className="mt-8 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
          {ventures.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="w-[280px] shrink-0 snap-start"
            >
              <Link
                href={brand.href || `/projects/${brand.name}/`}
                data-cursor
                className="glass-card focus-ring block p-5 !rounded-[18px]"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[12px] text-title-2 font-semibold"
                  style={{
                    background: `${brand.accent}18`,
                    boxShadow: `inset 0 1px 0.5px rgba(255,255,255,0.15)`,
                  }}
                >
                  {brand.logoImage ? (
                    <Image
                      src={brand.logoImage}
                      alt={brand.name}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span style={{ color: brand.accent }}>{brand.logo}</span>
                  )}
                </div>
                <h3 className="font-display text-headline mt-4 v-primary">{brand.name}</h3>
                <p className="text-footnote mt-2 line-clamp-2 v-tertiary">{brand.description}</p>
                <span
                  className={cn(
                    "text-caption mt-4 inline-block rounded-full border px-2.5 py-0.5",
                    statusColor(brand.status)
                  )}
                >
                  {brand.status}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

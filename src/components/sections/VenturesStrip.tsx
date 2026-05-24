"use client";

import Image from "next/image";
import Link from "next/link";
import { brands } from "@/lib/data";

function BrandLogo({ brand }: { brand: (typeof brands)[0] }) {
  return (
    <Link
      href={brand.href || `/projects/${brand.name}/`}
      data-cursor
      className="brand-marquee__item focus-ring"
      aria-label={brand.name}
    >
      <span className="brand-marquee__logo-wrap">
        {brand.logoImage ? (
          <Image
            src={brand.logoImage}
            alt=""
            width={40}
            height={40}
            className="brand-marquee__logo-img"
          />
        ) : (
          <span className="brand-marquee__logo-text" style={{ color: brand.accent }}>
            {brand.logo}
          </span>
        )}
      </span>
      <span className="brand-marquee__name">{brand.name}</span>
    </Link>
  );
}

export function VenturesStrip() {
  const ventures = brands.filter((b) => b.id !== "future");

  return (
    <section className="px-4 py-14 md:px-8 md:py-18">
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

        <div className="brand-marquee mt-10" aria-label="Venture logos">
          <div className="brand-marquee__track">
            <div className="brand-marquee__group">
              {ventures.map((brand) => (
                <BrandLogo key={brand.id} brand={brand} />
              ))}
            </div>
            <div className="brand-marquee__group" aria-hidden>
              {ventures.map((brand) => (
                <BrandLogo key={`${brand.id}-dup`} brand={brand} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

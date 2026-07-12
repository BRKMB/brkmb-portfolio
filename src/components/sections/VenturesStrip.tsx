"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { brands } from "@/lib/data";
import { getBrandListThumb } from "@/lib/project-brand";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

const GROUP_GAP_PX = 56;

function BrandLogo({ brand }: { brand: (typeof brands)[0] }) {
  const thumb = getBrandListThumb(brand);
  const href = brand.href || `/projects/${brand.slug}/`;

  return (
    <Link
      href={href}
      data-cursor
      className="brand-marquee__item focus-ring"
      aria-label={brand.name}
      style={{ "--brand-accent": brand.accent } as CSSProperties}
    >
      <span className="brand-marquee__logo-wrap">
        {thumb.kind === "letter" ? (
          <span className="brand-marquee__logo-text font-display">{thumb.letter}</span>
        ) : (
          <Image
            src={thumb.src}
            alt=""
            width={40}
            height={40}
            className={cn("brand-marquee__logo-img", thumb.invert && "brand-marquee__logo-img--invert")}
          />
        )}
      </span>
      <span className="brand-marquee__name">{brand.name}</span>
    </Link>
  );
}

export function VenturesStrip() {
  const ventures = brands.filter((b) => b.id !== "future");
  const groupRef = useRef<HTMLDivElement>(null);
  const [loopWidth, setLoopWidth] = useState(0);
  const [repeat, setRepeat] = useState(2);

  const sequence = useMemo(() => {
    let seq: typeof ventures = [];
    for (let i = 0; i < repeat; i++) seq = [...seq, ...ventures];
    return seq;
  }, [ventures, repeat]);

  useEffect(() => {
    const measure = () => {
      const el = groupRef.current;
      if (!el) return;

      const width = el.getBoundingClientRect().width;
      if (width <= 0) return;

      const viewport = window.innerWidth;
      if (width < viewport * 1.35 && repeat < 20) {
        setRepeat((count) => count + 1);
        return;
      }

      setLoopWidth(Math.ceil(width + GROUP_GAP_PX));
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (groupRef.current) observer.observe(groupRef.current);
    window.addEventListener("resize", measure, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [sequence, repeat]);

  const trackStyle =
    loopWidth > 0
      ? ({
          ["--marquee-shift" as string]: `${loopWidth}px`,
          ["--marquee-duration" as string]: `${Math.max(28, loopWidth / 48)}s`,
        } as CSSProperties)
      : undefined;

  return (
    <section className="ventures-strip px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <div className="min-w-0">
            <p className="text-caption tracking-[0.3em] uppercase text-accent">Ventures</p>
            <h2 className="font-display text-title-1 mt-3 uppercase v-primary">
              Projects
            </h2>
          </div>
          <Link
            href="/projects/"
            data-cursor
            className="text-subheadline shrink-0 text-accent transition hover:opacity-80"
          >
            All projects →
          </Link>
        </ScrollReveal>
      </div>

      <div className="mx-auto mt-10 max-w-6xl">
        <div className="brand-marquee" aria-label="Venture logos">
          <div className="brand-marquee__track" style={trackStyle}>
            <div className="brand-marquee__group" ref={groupRef}>
              {sequence.map((brand, i) => (
                <BrandLogo key={`${brand.id}-a-${i}`} brand={brand} />
              ))}
            </div>
            <div className="brand-marquee__group" aria-hidden>
              {sequence.map((brand, i) => (
                <BrandLogo key={`${brand.id}-b-${i}`} brand={brand} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/sections/Hero";
import { VenturesStrip } from "@/components/sections/VenturesStrip";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { portfolio } from "@/lib/data";

const hubs = [
  {
    href: "/designs/",
    title: "Designs",
    desc: "Identity, advertising, packaging, and print.",
  },
  {
    href: "/projects/",
    title: "Projects",
    desc: "Six ventures — streetwear, extensions, and web tools.",
  },
  {
    href: "/resume/",
    title: "Resume & About",
    desc: "Background, experience, skills, and a PDF download.",
  },
  {
    href: "/certificates/",
    title: "Certificates",
    desc: "Design, marketing, and language — verified at source.",
  },
  {
    href: "/links/",
    title: "Links",
    desc: "Profiles and contact for me and my brands.",
  },
];

const featuredSlugs = [
  "gap-re-branding",
  "mcdonalds-advertisements",
  "nescafe-gold-blend-ad-design",
  "bit-airlines-logo-design",
  "sok-juice-logo-ad-design",
  "insurance-company-manipulation-ad",
];

function SelectedWork() {
  const items = featuredSlugs
    .map((slug) => portfolio.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p?.image));

  return (
    <section className="px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="flex items-end justify-between gap-4">
          <div>
            <p className="text-caption tracking-[0.3em] uppercase text-accent">Selected work</p>
            <h2 className="font-display text-title-1 mt-3 uppercase v-primary">
              Designs
            </h2>
          </div>
          <Link
            href="/designs/"
            data-cursor
            className="text-subheadline shrink-0 text-accent transition hover:opacity-80"
          >
            All work →
          </Link>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <ScrollReveal key={item.slug} variant="up" delay={(i % 3) * 0.1}>
              <Link
                href={`/designs/${item.slug}/`}
                data-cursor
                className="focus-ring group block"
              >
                <span className="relative block aspect-[4/3] overflow-hidden rounded-xl border border-subtle bg-surface-muted">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={i < 3}
                    className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                  <span className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="font-display text-headline block text-white">
                      {item.title}
                    </span>
                    <span className="text-footnote mt-0.5 block text-accent">Open →</span>
                  </span>
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <VenturesStrip />
      <SelectedWork />
      <section className="px-5 pb-28 md:px-10">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <p className="text-caption tracking-[0.3em] uppercase text-accent">Explore</p>
          </ScrollReveal>
          <div className="mt-8 border-t border-subtle">
            {hubs.map((hub, i) => (
              <ScrollReveal key={hub.href} variant="left" delay={i * 0.06}>
                <Link
                  href={hub.href}
                  data-cursor
                  className="hub-index-row focus-ring group flex items-center gap-5 border-b border-subtle py-7 md:gap-10 md:py-9"
                >
                  <span className="font-display text-footnote w-10 shrink-0 text-accent tabular-nums">
                    /0{i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-display text-title-1 block uppercase v-primary transition-colors duration-300 group-hover:text-accent">
                      {hub.title}
                    </span>
                    <span className="text-subheadline mt-1.5 block v-tertiary leading-relaxed transition-colors duration-300 group-hover:v-secondary">
                      {hub.desc}
                    </span>
                  </span>
                  <span className="font-display text-title-2 v-quaternary shrink-0 transition-all duration-300 group-hover:translate-x-2 group-hover:text-accent">
                    →
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

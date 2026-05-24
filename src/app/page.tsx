import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { VenturesStrip } from "@/components/sections/VenturesStrip";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const hubs = [
  {
    href: "/projects/",
    title: "Projects",
    desc: "BARYQ, BENOU, BlinkOTP, RABY — ventures I founded and built.",
    emoji: "◆",
  },
  {
    href: "/design/",
    title: "Design",
    desc: "Brand identity, UI, posters, packaging — Behance-style gallery.",
    emoji: "◎",
  },
  {
    href: "/links/",
    title: "Links",
    desc: "All my profiles and contact points in one place.",
    emoji: "↗",
  },
  {
    href: "/about/",
    title: "About",
    desc: "Story, process, and how I work as founder and designer.",
    emoji: "◇",
  },
  {
    href: "/resume/",
    title: "Resume",
    desc: "Experience, skills, and a downloadable PDF CV.",
    emoji: "▤",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <VenturesStrip />
      <ScrollReveal>
        <section className="px-4 pb-24 md:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-caption text-center tracking-[0.2em] uppercase text-accent">Explore</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {hubs.map((hub) => (
                <Link
                  key={hub.href}
                  href={hub.href}
                  data-cursor
                  className="hub-card focus-ring group block"
                >
                  <span className="text-title-2 text-accent">{hub.emoji}</span>
                  <h2 className="font-display text-title-3 mt-4 v-primary">{hub.title}</h2>
                  <p className="text-subheadline mt-2 v-secondary leading-relaxed">{hub.desc}</p>
                  <span className="text-footnote mt-5 inline-block text-accent transition group-hover:translate-x-0.5">
                    Open →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}

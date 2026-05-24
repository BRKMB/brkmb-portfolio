"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "#brands", label: "Ventures" },
  { href: "#portfolio", label: "Design" },
  { href: "#projects", label: "Work" },
  { href: "#about", label: "About" },
  { href: "/resume/", label: "Resume" },
  { href: "#contact", label: "Contact" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    const sections = ["brands", "portfolio", "projects", "about", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      className="pointer-events-none fixed top-5 right-4 left-4 z-[9990] mx-auto max-w-4xl md:top-6"
      aria-label="Site navigation"
    >
      {/* Glass bar on inner div — NO transform here (transform breaks backdrop-filter) */}
      <motion.div
        initial={false}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ delay: 2.1, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className={cn(
          "glass-nav pointer-events-auto w-full px-2 py-1.5",
          scrolled && "glass-nav-scrolled"
        )}
      >
        <nav className="flex items-center justify-between gap-3">
          <Link
            href="/"
            data-cursor
            className="focus-ring flex min-h-[44px] items-center gap-2.5 rounded-full px-2 v-primary"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full btn-primary !min-h-0 !px-0 !py-0 text-sm font-bold">
              B
            </span>
            <span className="font-display text-headline hidden sm:inline">Baher</span>
          </Link>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  data-cursor
                  className={cn(
                    "focus-ring flex min-h-[44px] items-center rounded-full px-3.5 text-subheadline transition-all duration-200",
                    active && link.href === `#${active}`
                      ? "chip-glass-active"
                      : "v-secondary hover:v-primary hover:bg-white/5"
                  )}
                  style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="#contact" data-cursor className="btn-primary text-subheadline shrink-0">
            Let&apos;s talk
          </Link>
        </nav>
      </motion.div>
    </header>
  );
}

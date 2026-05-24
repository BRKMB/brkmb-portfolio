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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

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

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 2.2, duration: 0.6 }}
      className={cn(
        "fixed top-4 right-4 left-4 z-[9990] mx-auto max-w-5xl rounded-full px-4 py-2.5 transition-all duration-300 md:top-6",
        scrolled ? "glass shadow-lg shadow-black/30" : "bg-transparent"
      )}
    >
      <nav className="flex items-center justify-between gap-4">
        <Link href="/" data-cursor className="flex items-center gap-2 font-medium text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#d4ff4d] to-[#7cb342] text-sm font-bold text-[#0a1008]">
            B
          </span>
          <span className="hidden font-display text-lg sm:inline">brkmb</span>
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                data-cursor
                className={cn(
                  "rounded-full px-3 py-2 text-sm transition-colors",
                  active && link.href === `#${active}`
                    ? "bg-[#c9f31d]/15 text-accent"
                    : "text-white/45 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="#contact"
          data-cursor
          className="btn-primary rounded-full px-4 py-2 text-sm font-semibold"
        >
          Let&apos;s talk
        </Link>
      </nav>
    </motion.header>
  );
}

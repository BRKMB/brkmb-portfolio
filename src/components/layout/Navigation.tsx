"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/projects/", label: "Projects" },
  { href: "/design/", label: "Design" },
  { href: "/links/", label: "Links" },
  { href: "/resume/", label: "Resume" },
];

export function Navigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const syncReady = () =>
      setReady(document.documentElement.classList.contains("site-ready"));
    syncReady();
    const obs = new MutationObserver(syncReady);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bar = (
    <header
      className={cn("nav-shell", ready && "nav-shell--visible")}
      aria-label="Site navigation"
    >
      <nav
        className={cn("nav-glass", scrolled && "nav-glass--scrolled")}
        aria-label="Primary"
      >
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
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  data-cursor
                  className={cn(
                    "focus-ring flex min-h-[44px] items-center rounded-full px-3.5 text-subheadline transition-all duration-200",
                    active
                      ? "chip-glass-active"
                      : "v-secondary hover:v-primary hover:bg-white/5"
                  )}
                  style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link href="/links/" data-cursor className="btn-primary text-subheadline shrink-0">
          Let&apos;s talk
        </Link>
      </nav>
    </header>
  );

  return mounted ? createPortal(bar, document.body) : null;
}

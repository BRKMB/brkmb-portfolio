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
  { href: "/about/", label: "About" },
  { href: "/resume/", label: "Resume" },
];

export function Navigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const bar = (
    <>
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

          <div className="flex items-center gap-2">
            <Link
              href="/links/"
              data-cursor
              className="btn-primary text-subheadline hidden shrink-0 sm:inline-flex"
            >
              Let&apos;s talk
            </Link>
            <button
              type="button"
              data-cursor
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="focus-ring flex h-11 w-11 items-center justify-center rounded-full bg-white/8 lg:hidden"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="relative block h-3.5 w-4">
                <span
                  className={cn(
                    "absolute left-0 h-0.5 w-4 rounded-full bg-white transition",
                    menuOpen ? "top-[7px] rotate-45" : "top-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[7px] h-0.5 w-4 rounded-full bg-white transition",
                    menuOpen && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-0.5 w-4 rounded-full bg-white transition",
                    menuOpen ? "top-[7px] -rotate-45" : "top-[14px]"
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {menuOpen ? (
        <div className="mobile-nav-root lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            className="mobile-nav-backdrop"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="mobile-nav-panel">
            <ul className="flex flex-col gap-1 p-4">
              {links.map((link) => {
                const active = pathname === link.href || pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex min-h-[52px] items-center rounded-2xl px-4 text-headline transition",
                        active ? "chip-glass-active" : "v-secondary hover:bg-white/5 hover:v-primary"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="mt-2 border-t border-white/10 pt-3">
                <Link href="/links/" className="btn-primary text-subheadline flex min-h-[52px] items-center justify-center">
                  Let&apos;s talk
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );

  return mounted ? createPortal(bar, document.body) : null;
}

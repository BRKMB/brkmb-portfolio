"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SiteLogo } from "@/components/ui/SiteLogo";

const links = [
  { href: "/projects/", label: "Projects" },
  { href: "/designs/", label: "Designs" },
  { href: "/certificates/", label: "Certificates" },
  { href: "/resume/", label: "Resume" },
  { href: "/links/", label: "Links" },
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
            className="nav-glass__brand focus-ring flex min-h-[44px] min-w-0 items-center rounded-full px-1.5 sm:px-2 v-primary"
          >
            <SiteLogo size="sm" priority />
          </Link>

          <ul className="nav-glass__links hidden items-center gap-0.5 lg:flex">
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
                        : "v-secondary hover:v-primary bg-glass-hover"
                    )}
                    style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="nav-glass__actions flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle compact className="nav-glass__theme hidden lg:inline-flex" />
            <Link
              href="/contact/"
              data-cursor
              className="btn-primary nav-glass__cta text-subheadline hidden shrink-0 lg:inline-flex"
            >
              Let&apos;s talk
            </Link>
            <button
              type="button"
              data-cursor
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="focus-ring nav-menu-btn flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="relative block h-3.5 w-4">
                <span
                  className={cn(
                    "nav-menu-line absolute left-0 h-0.5 w-4 rounded-full transition",
                    menuOpen ? "top-[7px] rotate-45" : "top-0"
                  )}
                />
                <span
                  className={cn(
                    "nav-menu-line absolute left-0 top-[7px] h-0.5 w-4 rounded-full transition",
                    menuOpen && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "nav-menu-line absolute left-0 h-0.5 w-4 rounded-full transition",
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
            <div className="mobile-nav-panel__head">
              <div>
                <p className="mobile-nav-panel__eyebrow">Navigate</p>
                <p className="mobile-nav-panel__title v-primary">Baher Magally</p>
              </div>
              <button
                type="button"
                className="mobile-nav-panel__close focus-ring"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <span aria-hidden>×</span>
              </button>
            </div>

            <ul className="mobile-nav-panel__links">
              {links.map((link) => {
                const active = pathname === link.href || pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "mobile-nav-panel__link",
                        active ? "mobile-nav-panel__link--active" : "v-secondary"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mobile-nav-panel__foot">
              <ThemeToggle />
              <Link
                href="/contact/"
                className="btn-primary text-subheadline mobile-nav-panel__cta"
                onClick={() => setMenuOpen(false)}
              >
                Let&apos;s talk
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );

  return mounted ? createPortal(bar, document.body) : null;
}

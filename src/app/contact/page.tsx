import type { Metadata } from "next";
import Link from "next/link";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { PhoneReveal } from "@/components/contact/PhoneReveal";

export const metadata: Metadata = {
  title: "Let's talk — Baher Magally",
  description:
    "Reach Baher Magally for brand, print, or product work. Email, LinkedIn, Behance, or Instagram.",
};

const EMAIL = "baherody@gmail.com";

const channels = [
  {
    platform: "email",
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    hint: "Projects & briefs",
    external: false,
    primary: true,
  },
  {
    platform: "linkedin",
    label: "LinkedIn",
    value: "in/baher-bottros",
    href: "https://www.linkedin.com/in/baher-bottros/",
    hint: "Professional network",
    external: true,
  },
  {
    platform: "behance",
    label: "Behance",
    value: "baher-bottros",
    href: "https://www.behance.net/baher-bottros",
    hint: "Full portfolio",
    external: true,
  },
  {
    platform: "instagram",
    label: "Instagram",
    value: "@baher.bottros",
    href: "https://www.instagram.com/BAHER.BOTTROS",
    hint: "Quick message",
    external: true,
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen px-5 pt-32 pb-24 md:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <p className="text-caption tracking-[0.3em] uppercase text-accent">Contact</p>
        <h1 className="font-display text-large-title mt-4 uppercase v-primary">
          Let&apos;s talk
        </h1>
        <p className="text-body md:text-lg mt-5 max-w-xl v-secondary leading-relaxed">
          New work, collabs, or brand projects — reach out directly. I read every
          message.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {channels.map((c) => {
            const Wrapper = c.external ? "a" : Link;
            const linkProps = c.external
              ? { href: c.href, target: "_blank", rel: "noopener noreferrer" }
              : { href: c.href };
            return (
              <Wrapper
                key={c.platform}
                {...(linkProps as { href: string })}
                data-cursor
                className={`contact-channel focus-ring group ${
                  c.primary ? "contact-channel--primary" : ""
                }`}
              >
                <PlatformIcon platform={c.platform} variant="badge" badgeSize="md" className="h-5 w-5" />
                <span className="min-w-0 flex-1">
                  <span className="text-headline block v-primary">{c.label}</span>
                  <span className="text-footnote block truncate v-tertiary">{c.value}</span>
                </span>
                <span className="contact-channel__meta text-footnote hidden shrink-0 v-quaternary sm:block">
                  {c.hint}
                </span>
                <span className="text-title-3 v-quaternary shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent">
                  →
                </span>
              </Wrapper>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <PhoneReveal />
          <div className="contact-phone-card contact-phone-card--muted">
            <p className="text-caption tracking-[0.2em] uppercase v-tertiary">Based in</p>
            <p className="font-display text-title-3 mt-2 v-primary">Warsaw, Poland</p>
            <p className="text-footnote mt-1 v-tertiary">Warsaw · EN / AR · Worldwide clients</p>
          </div>
        </div>
      </div>
    </div>
  );
}

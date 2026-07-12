import Link from "next/link";
import type { IconType } from "react-icons";
import {
  FaBehance,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPaypal,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { linkGroups, site } from "@/lib/data";
import { SiteSignature } from "@/components/ui/SiteLogo";

const exploreLinks = [
  { href: "/projects/", label: "Projects" },
  { href: "/designs/", label: "Designs" },
  { href: "/certificates/", label: "Certificates" },
  { href: "/resume/", label: "Resume" },
  { href: "/links/", label: "Links" },
];

const ventureLinks = [
  { href: "/projects/BARYQ/", label: "BARYQ" },
  { href: "/projects/BENOU/", label: "BENOU" },
  { href: "/projects/BlinkOTP/", label: "BlinkOTP" },
  { href: "/projects/RABY/", label: "RABY" },
  { href: "/projects/Boostify/", label: "Boostify" },
  { href: "/projects/lnki/", label: "lnki.to" },
];

const socialIcons: Record<string, IconType> = {
  email: HiOutlineEnvelope,
  behance: FaBehance,
  facebook: FaFacebookF,
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  paypal: FaPaypal,
};

function getSocialLinks() {
  const personal = linkGroups.find((g) => g.id === "personal");
  if (!personal) return [];
  const seen = new Set<string>();
  const ordered = [
    "email",
    "behance",
    "linkedin",
    "instagram",
    "facebook",
    "tiktok",
    "youtube",
    "paypal",
  ];
  const byPlatform = new Map<string, (typeof personal.links)[number]>();
  for (const link of personal.links) {
    if (!byPlatform.has(link.platform)) byPlatform.set(link.platform, link);
  }
  const result: { href: string; label: string; platform: string }[] = [];
  for (const platform of ordered) {
    const link = byPlatform.get(platform);
    if (link && !seen.has(platform)) {
      seen.add(platform);
      result.push({ href: link.href, label: link.label, platform });
    }
  }
  return result;
}

const emailHref = `mailto:${site.email}`;
const emailAddress = site.email;

export function Footer() {
  const socials = getSocialLinks();

  return (
    <footer className="site-footer">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr] md:gap-10">
          <div>
            <p className="font-display text-footer-name uppercase v-primary">{site.name}</p>
            <p className="text-subheadline mt-4 max-w-sm v-secondary leading-relaxed">
              Identity and print for brands that need to hold up in production.
              Founder of BARYQ · builder of Boostify, lnki.to, and more.
            </p>

            <a
              href={emailHref}
              className="footer-email group mt-7 inline-flex items-center gap-2"
              data-cursor
            >
              <HiOutlineEnvelope className="h-5 w-5 text-accent" aria-hidden />
              <span className="font-display text-title-3 v-primary transition group-hover:text-accent">
                {emailAddress}
              </span>
            </a>

            <p className="text-footnote mt-3 v-tertiary">Warsaw · Open to selective projects</p>

            <div className="footer-social mt-7">
              {socials.map((item) => {
                const Icon = socialIcons[item.platform] ?? HiOutlineEnvelope;
                const external = item.href.startsWith("http");
                return (
                  <a
                    key={item.platform}
                    href={item.href}
                    className={`footer-social-link footer-social-link--${item.platform}`}
                    aria-label={item.label}
                    data-cursor
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <Icon className="h-[1.05rem] w-[1.05rem]" aria-hidden />
                  </a>
                );
              })}
            </div>
          </div>

          <nav aria-label="Explore">
            <p className="footer-col-title">Explore</p>
            <ul className="mt-5 flex flex-col gap-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    data-cursor
                    className="footer-nav-link text-subheadline v-secondary transition hover:v-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Ventures">
            <p className="footer-col-title">Ventures</p>
            <ul className="mt-5 flex flex-col gap-3">
              {ventureLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    data-cursor
                    className="footer-nav-link text-subheadline v-secondary transition hover:v-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer-bottom mt-16 flex flex-col gap-4 border-t border-subtle pt-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-footnote v-quaternary">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <SiteSignature className="self-start sm:self-auto" />
        </div>
      </div>
    </footer>
  );
}

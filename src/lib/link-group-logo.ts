import type { LinkGroup } from "@/types";

export type LinkGroupLogoConfig =
  | { kind: "image"; src: string; invert?: boolean }
  | { kind: "letter"; letter: string };

const logos: Record<string, LinkGroupLogoConfig> = {
  personal: { kind: "image", src: "/images/brand/baher-mark.png", invert: true },
  baryq: { kind: "image", src: "/images/projects/baryq.png" },
  benou: { kind: "letter", letter: "B" },
  blinkotp: { kind: "image", src: "/images/projects/blinkotp.png" },
  raby: { kind: "letter", letter: "R" },
  boostify: { kind: "image", src: "/images/projects/boostify-mark.png" },
  lnki: { kind: "image", src: "/images/projects/lnki-mark.png", invert: true },
  adzology: { kind: "letter", letter: "A" },
};

export function getLinkGroupLogo(group: LinkGroup): LinkGroupLogoConfig {
  const configured = logos[group.id];
  if (configured) return configured;

  if (group.logoImage) {
    return { kind: "image", src: group.logoImage, invert: group.logoInvert };
  }

  return { kind: "letter", letter: group.title.charAt(0).toUpperCase() };
}

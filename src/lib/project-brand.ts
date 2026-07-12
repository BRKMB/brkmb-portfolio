import brandsData from "@/data/brands.json";
import type { Brand, Project } from "@/types";

const brands = brandsData as Brand[];

export type ProjectListThumb =
  | { kind: "image"; src: string; invert?: boolean }
  | { kind: "letter"; letter: string };

/** Real marks only — placeholder SVGs are invisible at list size */
const listThumbs: Record<string, ProjectListThumb> = {
  lnki: { kind: "image", src: "/images/projects/lnki-mark.png", invert: true },
  boostify: { kind: "image", src: "/images/projects/boostify-mark.png" },
  blinkotp: { kind: "image", src: "/images/projects/blinkotp.png" },
  baryq: { kind: "image", src: "/images/projects/baryq.png" },
  benou: { kind: "letter", letter: "B" },
  raby: { kind: "letter", letter: "R" },
};

export function getProjectBrand(project: Project): Brand | undefined {
  const slug = project.slug.toLowerCase();
  return brands.find(
    (b) =>
      b.slug.toLowerCase() === slug ||
      b.id.toLowerCase() === slug ||
      b.href?.toLowerCase().includes(`/${slug}/`)
  );
}

export function getProjectAccent(project: Project): string {
  return getProjectBrand(project)?.accent ?? "#c9f31d";
}

/** Canonical venture order — list + case-study navigation */
export const PROJECT_ORDER = [
  "lnki",
  "Boostify",
  "BlinkOTP",
  "BARYQ",
  "BENOU",
  "RABY",
] as const;

export function getAdjacentProjectSlugs(slug: string): {
  prev?: string;
  next?: string;
} {
  const i = PROJECT_ORDER.indexOf(slug as (typeof PROJECT_ORDER)[number]);
  if (i === -1) return {};
  return {
    prev: i > 0 ? PROJECT_ORDER[i - 1] : undefined,
    next: i < PROJECT_ORDER.length - 1 ? PROJECT_ORDER[i + 1] : undefined,
  };
}

export type ProjectHeroVisual =
  | { type: "image"; src: string; invert?: boolean }
  | { type: "letter"; letter: string };

/** Hero assets — never use broken/empty covers (e.g. lnki-cover.png is blank) */
const heroVisuals: Record<string, ProjectHeroVisual> = {
  lnki: { type: "image", src: "/images/projects/lnki-logo.png", invert: true },
  boostify: { type: "image", src: "/images/projects/boostify-mark.png" },
  blinkotp: { type: "image", src: "/images/projects/blinkotp.png" },
  baryq: { type: "image", src: "/images/projects/baryq.png" },
  benou: { type: "letter", letter: "B" },
  raby: { type: "letter", letter: "R" },
};

export function getProjectHeroVisual(project: Project): ProjectHeroVisual {
  const slug = project.slug.toLowerCase();
  const configured = heroVisuals[slug];
  if (configured) return configured;

  const brand = getProjectBrand(project);
  if (brand?.logoImage) {
    return { type: "image", src: brand.logoImage };
  }

  return { type: "letter", letter: project.title.charAt(0).toUpperCase() };
}

export function getBrandListThumb(brand: Brand): ProjectListThumb {
  const slug = brand.slug.toLowerCase();
  const configured = listThumbs[slug];
  if (configured) return configured;

  if (brand.logoImage) {
    return { kind: "image", src: brand.logoImage };
  }

  return {
    kind: "letter",
    letter: brand.name.charAt(0).toUpperCase(),
  };
}

export function getProjectListThumb(project: Project): ProjectListThumb {
  const slug = project.slug.toLowerCase();
  const configured = listThumbs[slug];
  if (configured) return configured;

  const brand = getProjectBrand(project);
  if (brand?.logoImage) {
    return { kind: "image", src: brand.logoImage };
  }

  return {
    kind: "letter",
    letter: project.title.charAt(0).toUpperCase(),
  };
}

export type ProjectStatus = "Completed" | "In Progress" | "Live";
export type BrandStatus = "Live" | "Building" | "Coming Soon";
export type ProjectCategory =
  | "Branding"
  | "UI/UX"
  | "Applications"
  | "Extensions"
  | "Motion"
  | "External Client Work";

export type ProjectKind = "venture" | "work";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  logoImage?: string;
  description: string;
  ownership: string;
  status: BrandStatus;
  accent: string;
  href?: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  category: ProjectCategory;
  status: ProjectStatus;
  kind?: ProjectKind;
  thumbnail: string;
  tools: string[];
  overview: string;
  role: string;
  process: string[];
  results: string[];
  gallery: string[];
  featured?: boolean;
  externalUrl?: string;
}

export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  image: string;
  /** @deprecated Grid uses fixed 4:3 — kept for CMS compatibility */
  aspect?: "tall" | "wide" | "square";
  description?: string;
  overview?: string;
  role?: string;
  tools?: string[];
  tags?: string[];
  year?: string;
  /** @deprecated Migrated to `blocks` on load */
  gallery?: string[];
  /** Behance-style page content */
  blocks?: import("./design-blocks").DesignBlock[];
  hidden?: boolean;
  /** Optional CTA button on project page */
  cta?: { label: string; url: string };
  /** Downloadable attachments (free files only) */
  attachments?: { name: string; url: string }[];
  /** Project-wide style defaults for new text blocks */
  styleDefaults?: { textColor?: string; pageBackground?: string };
}

export type {
  DesignBlock,
  DesignBlockType,
  DesignEmbedBlock,
  DesignImageBlock,
  DesignSplitBlock,
  DesignSpacerBlock,
  DesignTextBlock,
} from "./design-blocks";

export interface LinkItem {
  id: string;
  label: string;
  description: string;
  href: string;
  platform: string;
  featured?: boolean;
  /** Hidden on /links but kept in CMS */
  hidden?: boolean;
}

export interface LinkGroup {
  id: string;
  title: string;
  subtitle?: string;
  logoImage?: string;
  accent?: string;
  defaultOpen?: boolean;
  /** Hidden on /links but kept in CMS */
  hidden?: boolean;
  links: LinkItem[];
}

export interface TimelineItem {
  id: string;
  project: string;
  task: string;
  progress: number;
}

export interface Stat {
  label: string;
  value: string;
  suffix?: string;
}

export interface ContactLink {
  id: string;
  label: string;
  href: string;
  icon: string;
}

export interface Experience {
  period: string;
  role: string;
  company: string;
  description: string;
}

export interface ResumeData {
  summary: string;
  education: { school: string; degree: string };
  skills: string[];
  experience: Experience[];
  cvDownloadUrl: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  title: string;
  description: string;
  email: string;
  stats: Stat[];
}

export interface CmsData {
  projects: Project[];
  portfolio: PortfolioItem[];
  linkGroups: LinkGroup[];
  resume: ResumeData;
}

/** @deprecated Legacy CMS export shape — migrated to linkGroups on load */
export interface LegacyCmsData extends Omit<CmsData, "linkGroups"> {
  links?: LinkItem[];
  linkGroups?: LinkGroup[];
}

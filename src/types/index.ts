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
  /** Enables /projects/{slug}/privacy|terms|support/ when compliance data exists */
  storeCompliance?: boolean;
}

export type ProjectComment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type ProjectEngagement = {
  views: number;
  likes: number;
  commentCount?: number;
  comments: ProjectComment[];
};

/** @deprecated Use ProjectComment */
export type BehanceComment = ProjectComment;

/** @deprecated Use ProjectEngagement */
export type BehanceEngagement = ProjectEngagement;

export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  image: string;
  /** Import-only; not shown in UI */
  behanceGalleryId?: number;
  engagement?: ProjectEngagement;
  /** @deprecated Migrated to `engagement` */
  behanceEngagement?: ProjectEngagement;
  /** @deprecated Grid uses fixed 4:3 — kept for CMS compatibility */
  aspect?: "tall" | "wide" | "square";
  description?: string;
  overview?: string;
  role?: string;
  tools?: string[];
  tags?: string[];
  /** Behance `publishedOn` (Unix seconds). */
  publishedOn?: number;
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
  /** Light marks on dark PNGs — invert to black/white per theme */
  logoInvert?: boolean;
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
  highlights?: string[];
}

export interface ResumeToolGroup {
  category: string;
  items: string[];
}

export interface ResumeData {
  summary: string;
  title?: string;
  location?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  cvRevision?: string;
  cvRevisionLabel?: string;
  education: {
    school: string;
    degree: string;
    graduated?: string;
    gpa?: string;
  };
  competencies?: string[];
  skills: string[];
  tools?: ResumeToolGroup[];
  certifications?: string[];
  languages?: string[];
  achievements?: string[];
  experience: Experience[];
  featuredProject?: { name: string; description: string };
  portfolioNote?: string;
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
  /** Bumped with CMS_PORTFOLIO_REVISION when portfolio.json changes. */
  portfolioRevision?: number;
}

/** @deprecated Legacy CMS export shape — migrated to linkGroups on load */
export interface LegacyCmsData extends Omit<CmsData, "linkGroups"> {
  links?: LinkItem[];
  linkGroups?: LinkGroup[];
}

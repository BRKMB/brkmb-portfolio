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
  title: string;
  category: string;
  image: string;
  aspect: "tall" | "wide" | "square";
  description?: string;
  tags?: string[];
  year?: string;
}

export interface LinkItem {
  id: string;
  label: string;
  description: string;
  href: string;
  platform: string;
  featured?: boolean;
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
  links: LinkItem[];
  resume: ResumeData;
}

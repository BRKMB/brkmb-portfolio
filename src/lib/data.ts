import brandsData from "@/data/brands.json";
import projectsData from "@/data/projects.json";
import portfolioData from "@/data/portfolio.json";
import linksData from "@/data/links.json";
import timelineData from "@/data/timeline.json";
import contactData from "@/data/contact.json";
import resumeData from "@/data/resume.json";
import aboutData from "@/data/about.json";
import siteData from "@/data/site.json";
import type {
  Brand,
  Project,
  PortfolioItem,
  TimelineItem,
  ContactLink,
  LinkItem,
  ProjectCategory,
} from "@/types";

export const site = siteData;
export const brands = brandsData as Brand[];
export const projects = projectsData as Project[];
export const portfolio = portfolioData as PortfolioItem[];
export const links = linksData as LinkItem[];
export const timeline = timelineData as TimelineItem[];
export const contact = contactData as ContactLink[];
export const resume = resumeData;
export const about = aboutData;

export const projectCategories: (ProjectCategory | "All")[] = [
  "All",
  "Branding",
  "UI/UX",
  "Applications",
  "Extensions",
  "Motion",
  "External Client Work",
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

export const ventureProjects = projects.filter((p) => p.kind !== "work");

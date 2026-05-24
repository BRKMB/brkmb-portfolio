import { notFound } from "next/navigation";
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/data";
import { ProjectDetail } from "./ProjectDetail";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Baher Magally`,
    description: project.shortDescription,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  if (!getProjectBySlug(slug)) notFound();
  return <ProjectDetail slug={slug} />;
}

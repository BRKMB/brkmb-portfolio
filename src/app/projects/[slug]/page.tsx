import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/data";
import { statusColor, cn } from "@/lib/utils";

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
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="min-h-screen px-4 pt-32 pb-20 md:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/#projects" className="text-subheadline text-accent transition hover:opacity-80">
          ← All projects
        </Link>

        <div className="glass-card relative mt-8 aspect-[21/9] overflow-hidden !p-0">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover rounded-[19px]"
            priority
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="chip-glass text-caption v-secondary px-3 py-1">{project.category}</span>
          <span className={cn("chip-glass text-caption px-3 py-1", statusColor(project.status))}>
            {project.status}
          </span>
        </div>

        <h1 className="font-display text-large-title mt-6 v-primary">{project.title}</h1>
        <p className="text-body mt-4 v-secondary">{project.description}</p>

        <section className="glass-sheet mt-12 p-8">
          <h2 className="text-caption text-accent tracking-[0.2em] uppercase">Overview</h2>
          <p className="text-body mt-4 v-secondary leading-relaxed">{project.overview}</p>
        </section>

        <section className="mt-8 px-2">
          <h2 className="text-caption text-accent tracking-[0.2em] uppercase">My role</h2>
          <p className="text-body mt-4 v-secondary">{project.role}</p>
        </section>

        <section className="glass-card mt-8 p-8">
          <h2 className="text-caption text-accent tracking-[0.2em] uppercase">Process</h2>
          <ol className="text-body mt-4 list-decimal space-y-2 pl-5 v-secondary">
            {project.process.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="mt-8 px-2">
          <h2 className="text-caption text-accent tracking-[0.2em] uppercase">Results</h2>
          <ul className="text-body mt-4 space-y-2">
            {project.results.map((r) => (
              <li key={r} className="flex gap-2 v-secondary">
                <span className="text-accent">✓</span> {r}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 px-2">
          <h2 className="text-caption text-accent tracking-[0.2em] uppercase">Technologies</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tools.map((t) => (
              <span key={t} className="chip-glass text-subheadline v-secondary px-4 py-2">
                {t}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-caption text-accent tracking-[0.2em] uppercase">Gallery</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {project.gallery.map((src, i) => (
              <div key={src} className="glass-card relative aspect-video overflow-hidden !p-0">
                <Image
                  src={src}
                  alt={`${project.title} ${i + 1}`}
                  fill
                  className="rounded-[19px] object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

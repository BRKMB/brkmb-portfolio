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
    title: `${project.title} | BRKMB`,
    description: project.shortDescription,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="min-h-screen px-4 pt-28 pb-20 md:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/#projects" className="text-sm text-accent hover:text-[#d4ff4d]">
          ← All projects
        </Link>

        <div className="relative mt-8 aspect-[21/9] overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1008] to-[#1a2e14]">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span className="text-sm text-accent">{project.category}</span>
          <span
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              statusColor(project.status)
            )}
          >
            {project.status}
          </span>
        </div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg text-white/50">{project.description}</p>

        <section className="mt-12">
          <h2 className="text-sm tracking-[0.2em] text-accent uppercase">Overview</h2>
          <p className="mt-4 text-white/60 leading-relaxed">{project.overview}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-sm tracking-[0.2em] text-accent uppercase">My role</h2>
          <p className="mt-4 text-white/60">{project.role}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-sm tracking-[0.2em] text-accent uppercase">Process</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-white/55">
            {project.process.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="text-sm tracking-[0.2em] text-accent uppercase">Results</h2>
          <ul className="mt-4 space-y-2">
            {project.results.map((r) => (
              <li key={r} className="flex gap-2 text-white/55">
                <span className="text-accent">✓</span> {r}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-sm tracking-[0.2em] text-accent uppercase">Technologies</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tools.map((t) => (
              <span
                key={t}
                className="glass rounded-full px-4 py-2 text-sm text-white/60"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-sm tracking-[0.2em] text-accent uppercase">Gallery</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {project.gallery.map((src, i) => (
              <div
                key={src}
                className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-[#0a1008]/80 to-[#1a2e14]/50"
              >
                <Image src={src} alt={`${project.title} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

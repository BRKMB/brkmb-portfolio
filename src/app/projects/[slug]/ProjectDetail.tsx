"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useProject, useProjects } from "@/components/providers/CmsProvider";
import {
  getProjectAccent,
  getProjectListThumb,
  getAdjacentProjectSlugs,
} from "@/lib/project-brand";
import { ProjectComplianceLinks } from "@/components/projects/ProjectComplianceLinks";
import { ProductShowcase } from "@/components/projects/ProductShowcase";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

function storeCtaLabel(url: string): string {
  if (url.includes("chromewebstore.google.com")) return "Add to your browser →";
  return "Visit live →";
}

export function ProjectDetail({ slug }: { slug: string }) {
  const project = useProject(slug);
  const allProjects = useProjects();
  const adjacent = getAdjacentProjectSlugs(slug);
  const prevProject = adjacent.prev
    ? allProjects.find((p) => p.slug === adjacent.prev)
    : undefined;
  const nextProject = adjacent.next
    ? allProjects.find((p) => p.slug === adjacent.next)
    : undefined;

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-5 pt-32 text-center">
        <p className="v-secondary">Project not found.</p>
        <Link href="/projects/" className="text-accent mt-4 inline-block">
          ← All projects
        </Link>
      </div>
    );
  }

  const accent = getProjectAccent(project);
  const thumb = getProjectListThumb(project);
  const isLive = project.status === "Live";
  const isProductPage = Boolean(project.features?.length && project.shots?.length);
  const gallery = project.gallery.filter(
    (src) => !src.includes("/placeholders/") && src !== project.thumbnail
  );

  return (
    <article
      className={cn(
        "case-study min-h-screen px-5 pt-28 pb-24 md:px-10 md:pt-32",
        isProductPage && "case-study--product"
      )}
      style={{ "--case-accent": accent } as CSSProperties}
    >
      <div className={cn("mx-auto w-full", isProductPage ? "max-w-6xl" : "max-w-3xl")}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <Link href="/projects/" className="text-subheadline text-accent transition hover:opacity-80">
            ← All projects
          </Link>

          <div className="case-head mt-8">
            <div className="case-head__mark" aria-hidden>
              {thumb.kind === "letter" ? (
                <span className="case-head__letter font-display">{thumb.letter}</span>
              ) : (
                <Image
                  src={thumb.src}
                  alt=""
                  width={48}
                  height={48}
                  className={cn(thumb.invert && "case-head__mark-img--invert")}
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="case-pill">{project.category}</span>
                <span className={cn("case-pill", isLive && "case-pill--live")}>{project.status}</span>
              </div>
              <h1 className="font-display text-large-title mt-4 uppercase v-primary">{project.title}</h1>
              {project.tagline ? (
                <p className="text-headline mt-2 v-secondary">{project.tagline}</p>
              ) : null}
            </div>
          </div>

          <p className="text-body md:text-lg mt-6 max-w-3xl v-secondary leading-relaxed">
            {project.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.externalUrl ? (
              <Button href={project.externalUrl} external>
                {storeCtaLabel(project.externalUrl)}
              </Button>
            ) : null}
            <Button href="/contact/" variant="ghost">
              Work with me
            </Button>
          </div>
        </motion.div>

        {isProductPage && project.features && project.shots && project.externalUrl ? (
          <ProductShowcase
            project={project}
            features={project.features}
            shots={project.shots}
            howItWorks={project.howItWorks ?? project.process}
            trustBadges={project.trustBadges ?? []}
            storeUrl={project.externalUrl}
          />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="case-facts mt-10 grid gap-6 border-y border-subtle py-8 sm:grid-cols-2"
            >
              <div>
                <p className="case-meta__label">Role</p>
                <p className="text-subheadline mt-2 v-primary leading-relaxed">{project.role}</p>
              </div>
              <div>
                <p className="case-meta__label">Stack &amp; tools</p>
                <ul className="case-meta__tools mt-3">
                  {project.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <div className="mt-12 space-y-12">
              <section>
                <h2 className="font-display text-title-2 v-primary">Overview</h2>
                <p className="text-body mt-4 v-secondary leading-relaxed">{project.overview}</p>
              </section>

              <section>
                <h2 className="font-display text-title-2 v-primary">Approach</h2>
                <ol className="case-steps mt-5">
                  {project.process.map((step, i) => (
                    <li key={step} className="case-step">
                      <span className="case-step__num font-display tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-body v-secondary leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <section>
                <h2 className="font-display text-title-2 v-primary">Outcomes</h2>
                <ul className="case-outcomes mt-5">
                  {project.results.map((item) => (
                    <li key={item} className="case-outcome">
                      <span className="case-outcome__mark" aria-hidden />
                      <span className="text-body v-secondary leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {gallery.length > 0 ? (
                <section>
                  <h2 className="font-display text-title-2 v-primary">Visuals</h2>
                  <div className="case-gallery mt-5">
                    {gallery.map((src, i) => (
                      <div key={`${src}-${i}`} className="case-gallery__item">
                        <Image
                          src={src}
                          alt={`${project.title} visual ${i + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 672px"
                          className={cn(
                            src.includes("logo") || src.endsWith(".svg")
                              ? "object-contain p-8"
                              : "object-cover"
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </>
        )}

        <div className="mt-14">
          <ProjectComplianceLinks slug={slug} />
        </div>

        <nav className="case-nav mt-16 border-t border-subtle pt-8" aria-label="Other projects">
          <div className="grid gap-4 sm:grid-cols-2">
            {prevProject ? (
              <Link href={`/projects/${prevProject.slug}/`} className="case-nav__link focus-ring group">
                <span className="text-footnote v-tertiary">Previous</span>
                <span className="font-display text-headline mt-1 block v-primary transition group-hover:text-accent">
                  ← {prevProject.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {nextProject ? (
              <Link
                href={`/projects/${nextProject.slug}/`}
                className="case-nav__link case-nav__link--next focus-ring group sm:text-right"
              >
                <span className="text-footnote v-tertiary">Next</span>
                <span className="font-display text-headline mt-1 block v-primary transition group-hover:text-accent">
                  {nextProject.title} →
                </span>
              </Link>
            ) : null}
          </div>
        </nav>
      </div>
    </article>
  );
}

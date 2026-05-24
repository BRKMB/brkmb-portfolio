"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { projects, projectCategories } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { statusColor, cn } from "@/lib/utils";
import type { ProjectCategory } from "@/types";

const FOUNDER_SLUGS = ["baryq-brand", "benou-app", "blinkotp", "raby"];

type Props = { homepage?: boolean };

export function Projects({ homepage }: Props) {
  const [filter, setFilter] = useState<ProjectCategory | "All">("All");

  const pool = homepage
    ? projects.filter((p) => !FOUNDER_SLUGS.includes(p.slug))
    : projects;

  const filtered =
    filter === "All" ? pool : pool.filter((p) => p.category === filter);

  if (homepage && pool.length === 0) return null;

  return (
    <section id="projects" className="scroll-mt-32 px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label={homepage ? "Also" : "Archive"}
          title={homepage ? "Design & select work" : "All projects"}
          description={
            homepage
              ? "Motion, client collaborations, and craft pieces — separate from the ventures above."
              : "Full archive including founder products."
          }
        />

        <div className="mb-10 flex flex-wrap gap-2">
          {(homepage
            ? (["All", "Motion", "External Client Work", "Branding"] as const)
            : projectCategories
          ).map((cat) => (
            <button
              key={cat}
              type="button"
              data-cursor
              onClick={() => setFilter(cat)}
              className={cn(
                "chip-glass focus-ring min-h-[44px] px-5 text-subheadline",
                filter === cat ? "chip-glass-active" : "v-secondary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.article
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              >
                <Link href={`/projects/${project.slug}/`} data-cursor className="group block focus-ring rounded-[20px]">
                  <div className="glass-card overflow-hidden !p-0">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-t-[19px]">
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-title-3 v-primary transition group-hover:text-accent">
                          {project.title}
                        </h3>
                        <span
                          className={cn(
                            "text-caption shrink-0 rounded-full border px-2.5 py-0.5",
                            statusColor(project.status)
                          )}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p className="text-subheadline mt-2 v-secondary">{project.shortDescription}</p>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

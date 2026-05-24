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
    <section id="projects" className="scroll-mt-28 px-4 py-24 md:px-8 md:py-32">
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
                "rounded-full px-4 py-2 text-sm transition-all",
                filter === cat
                  ? "btn-primary font-medium"
                  : "glass text-white/60 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.article
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
              >
                <Link href={`/projects/${project.slug}/`} data-cursor className="group block">
                  <div className="glass gradient-border overflow-hidden rounded-3xl">
                    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#0a1008] to-[#1a2e14]">
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#040806] via-transparent to-transparent" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-display text-xl text-white transition group-hover:text-accent">
                          {project.title}
                        </h3>
                        <span
                          className={cn(
                            "shrink-0 rounded-full border px-2.5 py-0.5 text-xs",
                            statusColor(project.status)
                          )}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-white/45">{project.shortDescription}</p>
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

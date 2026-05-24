"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { projects, projectCategories } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { statusColor, cn } from "@/lib/utils";
import type { ProjectCategory } from "@/types";

export function Projects() {
  const [filter, setFilter] = useState<ProjectCategory | "All">("All");

  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="scroll-mt-28 px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Work"
          title="Selected projects"
          description="Branding, products, extensions, and client work — filter by category."
        />

        <div className="mb-10 flex flex-wrap gap-2">
          {projectCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              data-cursor
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition-all",
                filter === cat
                  ? "bg-white text-black"
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
              >
                <Link href={`/projects/${project.slug}/`} data-cursor className="group block">
                  <div className="glass gradient-border overflow-hidden rounded-2xl">
                    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-indigo-950/80 to-violet-950/50">
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                      <div className="absolute right-4 bottom-4 left-4 translate-y-2 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                        <p className="text-sm text-white/80">{project.tools.join(" · ")}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition">
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
                      <span className="mt-4 inline-block text-sm text-indigo-400">
                        View case study →
                      </span>
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

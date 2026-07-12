"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useProjects } from "@/components/providers/CmsProvider";
import { ProjectIndexRow } from "@/components/projects/ProjectIndexRow";
import { PROJECT_ORDER } from "@/lib/project-brand";
import type { Project, ProjectStatus } from "@/types";
import { cn } from "@/lib/utils";

type Filter = "All" | ProjectStatus;

const FILTERS: Filter[] = ["All", "Live", "In Progress"];

const ORDER: string[] = [...PROJECT_ORDER];

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const ai = ORDER.indexOf(a.slug);
    const bi = ORDER.indexOf(b.slug);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

export function ProjectsShowcase() {
  const all = useProjects().filter((p) => p.kind !== "work");
  const [filter, setFilter] = useState<Filter>("All");

  const projects = useMemo(() => {
    const sorted = sortProjects(all);
    if (filter === "All") return sorted;
    return sorted.filter((p) => p.status === filter);
  }, [all, filter]);

  const liveCount = all.filter((p) => p.status === "Live").length;

  return (
    <div className="projects-index">
      <header className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/" className="text-subheadline text-accent transition hover:opacity-80">
            ← Home
          </Link>
          <p className="text-caption mt-10 tracking-[0.3em] uppercase text-accent">Ventures</p>
          <h1 className="font-display text-large-title mt-4 uppercase v-primary">Projects</h1>
          <p className="text-body mt-4 max-w-lg v-secondary leading-relaxed">
            {all.length} products · {liveCount} live · designed and built end to end.
          </p>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              data-cursor
              onClick={() => setFilter(f)}
              className={cn(
                "text-subheadline rounded-full px-4 py-2 transition",
                filter === f
                  ? "chip-glass-active"
                  : "chip-glass v-secondary hover:v-primary"
              )}
            >
              {f === "In Progress" ? "Building" : f}
            </button>
          ))}
        </div>
      </header>

      <div className="projects-index__list mx-auto mt-12 max-w-4xl border-t border-subtle">
        {projects.map((project, i) => (
          <ScrollReveal key={project.slug} variant="up" delay={i * 0.04}>
            <ProjectIndexRow
              project={project}
              index={ORDER.indexOf(project.slug)}
            />
          </ScrollReveal>
        ))}
      </div>

      {projects.length === 0 ? (
        <p className="text-body mx-auto mt-12 max-w-4xl text-center v-tertiary">
          No projects in this filter.
        </p>
      ) : null}

      <p className="text-subheadline mx-auto mt-16 max-w-4xl border-t border-subtle pt-8 v-secondary">
        Client and print work —{" "}
        <Link href="/designs/" className="text-accent transition hover:opacity-80">
          design portfolio →
        </Link>
      </p>
    </div>
  );
}

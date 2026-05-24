"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { useProjects } from "@/components/providers/CmsProvider";
import { statusColor, cn } from "@/lib/utils";

export default function ProjectsPage() {
  const projects = useProjects().filter((p) => p.kind !== "work");

  return (
    <div className="min-h-screen px-4 pt-32 pb-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Projects"
          subtitle="Ventures I founded and built — each one opens to a full case study."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.45 }}
            >
              <Link
                href={`/projects/${project.slug}/`}
                data-cursor
                className="glass-card focus-ring group block overflow-hidden !p-0"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-black/30">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip-glass text-caption v-secondary px-2.5 py-0.5">
                      {project.category}
                    </span>
                    <span
                      className={cn("chip-glass text-caption px-2.5 py-0.5", statusColor(project.status))}
                    >
                      {project.status}
                    </span>
                  </div>
                  <h2 className="font-display text-title-2 mt-4 v-primary">{project.title}</h2>
                  <p className="text-subheadline mt-2 line-clamp-2 v-secondary">{project.shortDescription}</p>
                  <p className="text-footnote mt-4 text-accent">View project →</p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

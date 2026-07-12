"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types";
import { getProjectAccent, getProjectListThumb } from "@/lib/project-brand";
import { cn } from "@/lib/utils";

export function ProjectIndexRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const accent = getProjectAccent(project);
  const thumb = getProjectListThumb(project);
  const isLive = project.status === "Live";

  return (
    <Link
      href={`/projects/${project.slug}/`}
      data-cursor
      className="project-index-row focus-ring group"
      style={{ "--project-accent": accent } as CSSProperties}
    >
      <span className="project-index-row__num font-display tabular-nums">
        /{String(index + 1).padStart(2, "0")}
      </span>

      <span className="project-index-row__thumb">
        {thumb.kind === "letter" ? (
          <span className="project-index-row__letter font-display">{thumb.letter}</span>
        ) : (
          <Image
            src={thumb.src}
            alt=""
            width={56}
            height={56}
            className={cn(
              "project-index-row__thumb-img",
              thumb.invert && "project-index-row__thumb-img--invert"
            )}
          />
        )}
      </span>

      <span className="project-index-row__content min-w-0 flex-1">
        <span className="project-index-row__title font-display uppercase v-primary">
          {project.title}
        </span>
        <span className="project-index-row__meta">
          <span>{project.category}</span>
          <span className="project-index-row__dot" aria-hidden>
            ·
          </span>
          <span className={cn(isLive && "project-index-row__live")}>{project.status}</span>
        </span>
        <span className="project-index-row__desc v-tertiary">{project.shortDescription}</span>
      </span>

      <span className="project-index-row__arrow font-display" aria-hidden>
        →
      </span>
    </Link>
  );
}

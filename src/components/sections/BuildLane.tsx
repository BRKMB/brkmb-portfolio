"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";
import { cn, statusColor } from "@/lib/utils";

const FEATURED_SLUGS = ["Boostify", "lnki", "BlinkOTP", "BARYQ"];

export function BuildLane() {
  const items = FEATURED_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <section className="px-5 py-14 md:px-10 md:py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="text-caption tracking-[0.28em] uppercase text-build">What I build</p>
            <h2 className="font-display text-title-1 mt-2 v-primary">
              Products & ventures
            </h2>
          </div>
          <Link
            href="/projects/"
            data-cursor
            className="text-subheadline shrink-0 text-build transition hover:opacity-80"
          >
            All projects →
          </Link>
        </motion.div>

        <div className="build-lane mt-8 md:mt-10">
          {items.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ delay: i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/projects/${project.slug}/`}
                data-cursor
                className="build-card focus-ring group"
              >
                <div className="build-card__thumb">
                  <Image
                    src={project.thumbnail}
                    alt=""
                    fill
                    sizes="280px"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="build-card__body">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-caption v-tertiary uppercase tracking-[0.12em]">
                      {project.category}
                    </span>
                    <span
                      className={cn(
                        "text-caption rounded-full border px-2 py-0.5",
                        statusColor(project.status)
                      )}
                    >
                      {project.status}
                    </span>
                  </div>
                  <h3 className="font-display text-title-3 mt-2 v-primary">{project.title}</h3>
                  <p className="text-footnote mt-1.5 line-clamp-2 v-tertiary leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

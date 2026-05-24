"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { DesignBlocksRenderer } from "@/components/design/DesignBlocksRenderer";
import { DesignEngagement } from "@/components/design/DesignEngagement";
import { usePortfolioItem } from "@/components/providers/CmsProvider";
import { site } from "@/lib/data";

export function DesignDetail({ slug }: { slug: string }) {
  const item = usePortfolioItem(slug);

  if (!item) {
    return (
      <div className="mx-auto max-w-4xl px-4 pt-32 text-center">
        <p className="v-secondary">Project not found.</p>
        <Link href="/design/" className="text-accent mt-4 inline-block">
          ← All design work
        </Link>
      </div>
    );
  }

  const blocks = item.blocks ?? [];
  const published = item.year ? `${item.year}` : "2024";

  return (
    <article className="behance-project min-h-screen pb-24">
      <div className="behance-project__hero-wrap mx-auto max-w-[1200px] px-4 pt-28 md:px-8 md:pt-32">
        <Link
          href="/design/"
          className="text-subheadline inline-flex items-center gap-1 text-accent transition hover:opacity-80"
        >
          ← All work
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="behance-project__cover relative mt-6 aspect-[16/10] overflow-hidden md:aspect-[16/9]"
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </motion.div>
      </div>

      <header className="behance-project__header mx-auto max-w-[720px] px-4 pt-10 md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08, duration: 0.45 }}
        >
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-[1.08] font-bold tracking-[-0.02em] v-primary">
            {item.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-subheadline v-tertiary">
            <span>{site.name}</span>
            <span aria-hidden>·</span>
            <span>{site.tagline.split("•")[0]?.trim() || "Designer"}</span>
            <span aria-hidden>·</span>
            <span>{published}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="behance-chip">{item.category}</span>
            {item.tools?.map((tool) => (
              <span key={tool} className="behance-chip behance-chip--muted">
                {tool}
              </span>
            ))}
          </div>

          {item.description ? (
            <p className="text-body mt-8 leading-relaxed v-secondary">{item.description}</p>
          ) : null}

          {item.overview ? (
            <p className="text-body mt-4 leading-relaxed v-primary">{item.overview}</p>
          ) : null}

          {item.role ? (
            <p className="text-footnote mt-6 v-tertiary">
              <span className="text-accent">Role — </span>
              {item.role}
            </p>
          ) : null}
        </motion.div>
      </header>

      <div className="mt-14">
        <DesignBlocksRenderer blocks={blocks} />
      </div>

      <DesignEngagement slug={item.slug} />

      <footer className="mx-auto mt-16 max-w-[720px] border-t border-white/10 px-4 pt-10 md:px-8">
        <Link
          href="/design/"
          data-cursor
          className="btn-primary text-subheadline inline-flex min-h-[44px] items-center justify-center rounded-full px-6 py-2.5"
        >
          More design work
        </Link>
      </footer>
    </article>
  );
}

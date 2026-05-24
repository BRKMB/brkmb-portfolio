"use client";

import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { useLinks } from "@/components/providers/CmsProvider";
import { site } from "@/lib/data";

export default function LinksPage() {
  const links = useLinks();
  const featured = links.filter((l) => l.featured !== false);
  const rest = links.filter((l) => l.featured === false);

  return (
    <div className="min-h-screen px-4 pt-32 pb-20 md:px-8">
      <div className="mx-auto max-w-md">
        <PageHeader
          title="Links"
          subtitle="Everywhere I show up online — tap a link below."
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-10 flex flex-col items-center text-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full btn-primary text-title-2 font-bold">
            B
          </div>
          <p className="font-display text-title-2 mt-4 v-primary">{site.name}</p>
          <p className="text-subheadline mt-1 v-secondary">{site.tagline}</p>
          <p className="text-footnote mt-1 v-tertiary">AKA Baher Rody · Baher Bottros</p>
        </motion.div>

        <ul className="mt-10 flex flex-col gap-3">
          {featured.map((link, i) => (
            <motion.li
              key={link.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.04, duration: 0.4 }}
            >
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor
                className="link-tree-card focus-ring group flex items-center gap-4"
              >
                <PlatformIcon platform={link.platform} variant="badge" className="h-6 w-6" />
                <span className="min-w-0 flex-1 text-left">
                  <span className="font-display text-headline block v-primary">{link.label}</span>
                  <span className="text-footnote block truncate v-tertiary">{link.description}</span>
                </span>
                <span className="text-footnote v-quaternary transition group-hover:v-secondary">→</span>
              </a>
            </motion.li>
          ))}
        </ul>

        {rest.length > 0 ? (
          <>
            <p className="text-caption mt-10 text-center tracking-widest uppercase v-tertiary">More</p>
            <ul className="mt-4 flex flex-col gap-2">
              {rest.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor
                    className="link-tree-card link-tree-card--compact focus-ring flex items-center gap-3"
                  >
                    <PlatformIcon
                      platform={link.platform}
                      variant="badge"
                      badgeSize="sm"
                      className="h-4 w-4"
                    />
                    <span className="text-subheadline v-secondary">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}

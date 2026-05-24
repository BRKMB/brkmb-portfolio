"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LinkGroups } from "@/components/links/LinkGroups";
import { useLinkGroups } from "@/components/providers/CmsProvider";

export default function LinksPage() {
  const linkGroups = useLinkGroups();

  return (
    <div className="min-h-screen px-4 pt-32 pb-20 md:px-8">
      <div className="mx-auto w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <Link
            href="/"
            className="text-subheadline inline-block text-accent transition hover:opacity-80"
          >
            ← Home
          </Link>

          <div className="mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full btn-primary text-title-2 font-bold">
            B
          </div>
          <h1 className="font-display text-large-title mt-6 v-primary">Links</h1>
          <p className="text-body mx-auto mt-3 max-w-sm v-secondary leading-relaxed">
            Personal profiles and links for every venture — open a section below.
          </p>
          <p className="text-footnote mt-2 v-tertiary">AKA Baher Rody · Baher Bottros</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.45 }}
          className="mt-10"
        >
          <LinkGroups groups={linkGroups} />
        </motion.div>
      </div>
    </div>
  );
}

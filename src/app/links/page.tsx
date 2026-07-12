"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LinkGroups } from "@/components/links/LinkGroups";
import { useLinkGroups } from "@/components/providers/CmsProvider";

export default function LinksPage() {
  const linkGroups = useLinkGroups();

  return (
    <div className="links-page min-h-screen px-4 pt-32 pb-20 md:px-8">
      <div className="mx-auto w-full max-w-lg">
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <Link
            href="/"
            className="text-subheadline mb-8 inline-block text-accent transition hover:opacity-80"
          >
            ← Home
          </Link>

          <h1 className="font-display text-large-title v-primary select-none" tabIndex={-1}>
            Links
          </h1>
          <p className="text-subheadline md:text-body mx-auto mt-3 max-w-[34rem] v-secondary select-none px-2 text-balance">
            Profiles for me and every venture. Expand a section below.
          </p>
        </motion.header>

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

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { LinkGroup } from "@/types";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { HiChevronDown } from "react-icons/hi2";
import { cn } from "@/lib/utils";

function LinkRow({ link }: { link: LinkGroup["links"][0] }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor
      className="link-tree-card focus-ring group flex items-center gap-3 !rounded-[14px] !py-3"
    >
      <PlatformIcon platform={link.platform} variant="badge" badgeSize="sm" className="h-4 w-4" />
      <span className="min-w-0 flex-1 text-left">
        <span className="text-subheadline block font-medium v-primary">{link.label}</span>
        <span className="text-footnote block truncate v-tertiary">{link.description}</span>
      </span>
      <span className="text-footnote v-quaternary transition group-hover:v-secondary">↗</span>
    </a>
  );
}

function GroupPanel({ group }: { group: LinkGroup }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
      className="overflow-hidden"
    >
      <ul className="flex flex-col gap-2 px-4 pb-4 pt-1">
        {group.links.map((link) => (
          <li key={link.id}>
            <LinkRow link={link} />
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function LinkGroups({ groups }: { groups: LinkGroup[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g) => [g.id, false]))
  );

  const toggle = (id: string) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col gap-3">
      {groups.map((group) => {
        const isOpen = open[group.id];
        return (
          <section key={group.id} className="link-accordion">
            <button
              type="button"
              data-cursor
              onClick={() => toggle(group.id)}
              aria-expanded={isOpen}
              className="link-accordion__trigger focus-ring w-full"
            >
              <span className="flex min-w-0 flex-1 items-center gap-3 text-left">
                {group.logoImage ? (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-white/8">
                    <Image
                      src={group.logoImage}
                      alt=""
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </span>
                ) : (
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-sm font-bold"
                    style={{
                      background: `${group.accent ?? "#c9f31d"}22`,
                      color: group.accent ?? "#c9f31d",
                    }}
                  >
                    {group.title.charAt(0)}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="font-display text-headline block v-primary">{group.title}</span>
                  {group.subtitle ? (
                    <span className="text-footnote block truncate v-tertiary">{group.subtitle}</span>
                  ) : null}
                </span>
              </span>
              <span className="link-accordion__chevron" aria-hidden>
                <HiChevronDown
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? <GroupPanel group={group} /> : null}
            </AnimatePresence>
          </section>
        );
      })}
    </div>
  );
}

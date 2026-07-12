"use client";

import { HiEye, HiHeart } from "react-icons/hi2";
import type { ProjectEngagement } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  engagement?: ProjectEngagement;
};

function formatCount(n: number) {
  return n.toLocaleString();
}

export function DesignEngagement({ engagement }: Props) {
  const views = engagement?.views ?? 0;
  const likes = engagement?.likes ?? 0;
  const comments = engagement?.comments ?? [];
  const visibleComments = comments.slice(0, 12);

  return (
    <section className="design-engagement mx-auto mt-12 max-w-[720px] border-t border-subtle px-4 pt-10 md:px-0">
      <div className="flex flex-wrap items-center gap-4">
        <span
          className={cn(
            "chip-glass flex items-center gap-2 rounded-full px-4 py-2 text-subheadline v-secondary"
          )}
          aria-label={`${formatCount(likes)} appreciations`}
        >
          <HiHeart className="h-4 w-4" aria-hidden />
          {formatCount(likes)}
        </span>
        <span className="design-engagement__views flex items-center gap-2 text-subheadline v-tertiary">
          <HiEye className="h-4 w-4" aria-hidden />
          {formatCount(views)} views
        </span>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-title-3 v-primary">Comments</h2>

        <ul className="mt-6 space-y-4">
          {comments.length === 0 ? (
            <li className="text-footnote v-tertiary">No comments yet.</li>
          ) : (
            visibleComments.map((c) => (
              <li key={c.id} className="glass-card p-4 !rounded-[14px]">
                <p className="text-subheadline font-medium v-primary">{c.authorName}</p>
                <p className="text-footnote mt-1 v-tertiary">
                  {new Date(c.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-body mt-3 whitespace-pre-wrap v-secondary leading-relaxed">
                  {c.body}
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}

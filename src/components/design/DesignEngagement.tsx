"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { HiEye, HiHeart } from "react-icons/hi2";
import {
  fetchComments,
  postComment,
  recordProjectView,
  toggleProjectLike,
  type DesignComment,
  type ProjectStats,
} from "@/lib/design-engagement/api";
import { getVisitorId, hasViewedProject, markViewedProject } from "@/lib/design-engagement/visitor";
import { cn } from "@/lib/utils";

const LIKED_KEY = (slug: string) => `brkmb-liked-${slug}`;

type Props = {
  slug: string;
  initialStats?: ProjectStats;
};

function formatCount(n: number) {
  return n.toLocaleString();
}

export function DesignEngagement({ slug, initialStats }: Props) {
  const [stats, setStats] = useState<ProjectStats>(initialStats ?? { views: 0, likes: 0 });
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<DesignComment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);

  const loadComments = useCallback(async () => {
    const list = await fetchComments(slug);
    setComments(list);
  }, [slug]);

  useEffect(() => {
    setLiked(localStorage.getItem(LIKED_KEY(slug)) === "1");
    loadComments();

    if (!hasViewedProject(slug)) {
      markViewedProject(slug);
      recordProjectView(slug).then((next) => {
        if (next) setStats(next);
      });
    }
  }, [slug, loadComments]);

  const onLike = async () => {
    if (likeBusy) return;
    setLikeBusy(true);
    const visitorId = getVisitorId();
    const result = await toggleProjectLike(slug, visitorId);
    if (result) {
      setStats({ views: result.views, likes: result.likes });
      setLiked(result.liked);
      if (result.liked) localStorage.setItem(LIKED_KEY(slug), "1");
      else localStorage.removeItem(LIKED_KEY(slug));
    }
    setLikeBusy(false);
  };

  const onSubmitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const comment = await postComment(slug, name.trim(), text.trim());
    if (comment) {
      setComments((prev) => [comment, ...prev]);
      setText("");
    }
    setSubmitting(false);
  };

  return (
    <section className="design-engagement mx-auto mt-12 max-w-[720px] border-t border-white/10 px-4 pt-10 md:px-0">
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          data-cursor
          disabled={likeBusy}
          onClick={onLike}
          className={cn(
            "design-engagement__like chip-glass flex items-center gap-2 rounded-full px-4 py-2 text-subheadline transition",
            liked && "chip-glass-active"
          )}
        >
          <HiHeart className={cn("h-4 w-4", liked && "fill-current")} />
          {formatCount(stats.likes)}
        </button>
        <span className="design-engagement__views flex items-center gap-2 text-subheadline v-tertiary">
          <HiEye className="h-4 w-4" />
          {formatCount(stats.views)} views
        </span>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-title-3 v-primary">Comments</h2>
        <form onSubmit={onSubmitComment} className="mt-4 space-y-3">
          <input
            className="admin-input w-full"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            required
          />
          <textarea
            className="admin-input min-h-[88px] w-full"
            placeholder="Write a comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={2000}
            required
          />
          <button type="submit" disabled={submitting} className="btn-primary text-subheadline px-5 py-2">
            {submitting ? "Posting…" : "Post comment"}
          </button>
        </form>

        <ul className="mt-8 space-y-4">
          {comments.length === 0 ? (
            <li className="text-footnote v-tertiary">No comments yet — be the first.</li>
          ) : (
            comments.map((c) => (
              <li key={c.id} className="glass-card p-4 !rounded-[14px]">
                <p className="text-subheadline font-medium v-primary">{c.authorName}</p>
                <p className="text-footnote mt-1 v-tertiary">
                  {new Date(c.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-body mt-3 whitespace-pre-wrap v-secondary leading-relaxed">{c.body}</p>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}

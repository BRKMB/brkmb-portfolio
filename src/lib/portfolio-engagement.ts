import type { PortfolioItem, ProjectEngagement } from "@/types";

export type ProjectStats = { views: number; likes: number };

export function getProjectEngagement(item: PortfolioItem): ProjectEngagement | undefined {
  const e = item.engagement ?? item.behanceEngagement;
  if (!e) return undefined;
  return {
    views: e.views ?? 0,
    likes: e.likes ?? 0,
    commentCount: e.commentCount ?? e.comments?.length ?? 0,
    comments: e.comments ?? [],
  };
}

export function getProjectStats(item: PortfolioItem): ProjectStats {
  const e = getProjectEngagement(item);
  return { views: e?.views ?? 0, likes: e?.likes ?? 0 };
}

import type { ProjectComment } from "@/types";
import type { ProjectStats } from "@/lib/portfolio-engagement";

export type { ProjectStats };
export type DesignComment = ProjectComment;

const API_BASE = "/api/design";

async function parseJson<T>(res: Response): Promise<T | null> {
  if (!res.ok) return null;
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Legacy API fallback — prefer `engagement` on portfolio items. */
export async function fetchProjectStats(
  slugs: string[]
): Promise<Record<string, ProjectStats>> {
  if (!slugs.length) return {};
  const res = await fetch(`${API_BASE}/stats?slugs=${encodeURIComponent(slugs.join(","))}`);
  const data = await parseJson<{ stats: Record<string, ProjectStats> }>(res);
  return data?.stats ?? {};
}

export async function fetchComments(slug: string): Promise<DesignComment[]> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(slug)}/comments`);
  const data = await parseJson<{ comments: DesignComment[] }>(res);
  return data?.comments ?? [];
}

export function projectPublicUrl(slug: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/designs/${slug}/`;
  }
  return `https://brkmb.com/designs/${slug}/`;
}

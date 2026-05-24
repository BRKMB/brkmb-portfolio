export type ProjectStats = { views: number; likes: number };

export type DesignComment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
};

const API_BASE = "/api/design";

async function parseJson<T>(res: Response): Promise<T | null> {
  if (!res.ok) return null;
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchProjectStats(
  slugs: string[]
): Promise<Record<string, ProjectStats>> {
  if (!slugs.length) return {};
  const res = await fetch(`${API_BASE}/stats?slugs=${encodeURIComponent(slugs.join(","))}`);
  const data = await parseJson<{ stats: Record<string, ProjectStats> }>(res);
  return data?.stats ?? {};
}

export async function recordProjectView(slug: string): Promise<ProjectStats | null> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(slug)}/view`, { method: "POST" });
  return parseJson<ProjectStats>(res);
}

export async function toggleProjectLike(
  slug: string,
  visitorId: string
): Promise<(ProjectStats & { liked: boolean }) | null> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(slug)}/like`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ visitorId }),
  });
  return parseJson<ProjectStats & { liked: boolean }>(res);
}

export async function fetchComments(slug: string): Promise<DesignComment[]> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(slug)}/comments`);
  const data = await parseJson<{ comments: DesignComment[] }>(res);
  return data?.comments ?? [];
}

export async function postComment(
  slug: string,
  authorName: string,
  text: string
): Promise<DesignComment | null> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(slug)}/comments`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ authorName, text }),
  });
  const data = await parseJson<{ comment: DesignComment }>(res);
  return data?.comment ?? null;
}

export function projectPublicUrl(slug: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/design/${slug}/`;
  }
  return `https://brkmb.com/design/${slug}/`;
}

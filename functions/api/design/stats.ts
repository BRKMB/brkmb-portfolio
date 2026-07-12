import engagement from "../../_data/design-engagement.json";
import { cors, json, type Env } from "../../_shared/design-db";

type EngagementRow = { views: number; likes: number; comments?: unknown[] };

const bySlug = engagement as Record<string, EngagementRow>;

export const onRequestOptions: PagesFunction<Env> = async ({ request }) =>
  new Response(null, { headers: cors(request) });

export const onRequestGet: PagesFunction<Env> = async ({ request }) => {
  const url = new URL(request.url);
  const slugs = (url.searchParams.get("slugs") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);

  const stats: Record<string, { views: number; likes: number }> = {};
  for (const slug of slugs) {
    const row = bySlug[slug];
    stats[slug] = { views: row?.views ?? 0, likes: row?.likes ?? 0 };
  }

  return new Response(JSON.stringify({ stats }), {
    headers: { "content-type": "application/json", ...cors(request) },
  });
};

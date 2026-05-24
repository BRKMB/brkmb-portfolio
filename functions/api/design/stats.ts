import { cors, json, type Env } from "../../_shared/design-db";

export const onRequestOptions: PagesFunction<Env> = async ({ request }) =>
  new Response(null, { headers: cors(request) });

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const slugs = (url.searchParams.get("slugs") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);

  if (!slugs.length) {
    return new Response(JSON.stringify({ stats: {} }), {
      headers: { "content-type": "application/json", ...cors(request) },
    });
  }

  const placeholders = slugs.map((_, i) => `?${i + 1}`).join(",");
  const { results } = await env.DB.prepare(
    `SELECT slug, view_count, like_count FROM design_stats WHERE slug IN (${placeholders})`
  )
    .bind(...slugs)
    .all<{ slug: string; view_count: number; like_count: number }>();

  const stats: Record<string, { views: number; likes: number }> = {};
  for (const slug of slugs) {
    stats[slug] = { views: 0, likes: 0 };
  }
  for (const row of results ?? []) {
    stats[row.slug] = { views: row.view_count, likes: row.like_count };
  }

  return new Response(JSON.stringify({ stats }), {
    headers: { "content-type": "application/json", ...cors(request) },
  });
};

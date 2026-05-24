import { cors, ensureStats, json, type Env } from "../../../_shared/design-db";

export const onRequestOptions: PagesFunction<Env> = async ({ request }) =>
  new Response(null, { headers: cors(request) });

export const onRequestPost: PagesFunction<Env> = async ({ params, env, request }) => {
  const slug = params.slug as string;
  if (!slug || slug.length > 120) return json({ error: "Invalid slug" }, 400);

  let body: { visitorId?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const visitorId = (body.visitorId ?? "").trim().slice(0, 64);
  if (!visitorId) return json({ error: "visitorId required" }, 400);

  await ensureStats(env.DB, slug);

  const existing = await env.DB.prepare(
    `SELECT 1 FROM design_likes WHERE slug = ?1 AND visitor_id = ?2`
  )
    .bind(slug, visitorId)
    .first();

  let liked: boolean;

  if (existing) {
    await env.DB.prepare(`DELETE FROM design_likes WHERE slug = ?1 AND visitor_id = ?2`)
      .bind(slug, visitorId)
      .run();
    await env.DB.prepare(`UPDATE design_stats SET like_count = MAX(0, like_count - 1) WHERE slug = ?1`)
      .bind(slug)
      .run();
    liked = false;
  } else {
    await env.DB.prepare(`INSERT INTO design_likes (slug, visitor_id) VALUES (?1, ?2)`)
      .bind(slug, visitorId)
      .run();
    await env.DB.prepare(`UPDATE design_stats SET like_count = like_count + 1 WHERE slug = ?1`)
      .bind(slug)
      .run();
    liked = true;
  }

  const row = await env.DB.prepare(
    `SELECT view_count, like_count FROM design_stats WHERE slug = ?1`
  )
    .bind(slug)
    .first<{ view_count: number; like_count: number }>();

  return new Response(
    JSON.stringify({
      liked,
      views: row?.view_count ?? 0,
      likes: row?.like_count ?? 0,
    }),
    { headers: { "content-type": "application/json", ...cors(request) } }
  );
};

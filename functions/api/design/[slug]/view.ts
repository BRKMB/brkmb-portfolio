import { cors, ensureStats, json, type Env } from "../../../_shared/design-db";

export const onRequestOptions: PagesFunction<Env> = async ({ request }) =>
  new Response(null, { headers: cors(request) });

export const onRequestPost: PagesFunction<Env> = async ({ params, env, request }) => {
  const slug = params.slug as string;
  if (!slug || slug.length > 120) return json({ error: "Invalid slug" }, 400);

  await ensureStats(env.DB, slug);
  await env.DB.prepare(`UPDATE design_stats SET view_count = view_count + 1 WHERE slug = ?1`)
    .bind(slug)
    .run();

  const row = await env.DB.prepare(
    `SELECT view_count, like_count FROM design_stats WHERE slug = ?1`
  )
    .bind(slug)
    .first<{ view_count: number; like_count: number }>();

  return new Response(
    JSON.stringify({
      views: row?.view_count ?? 1,
      likes: row?.like_count ?? 0,
    }),
    { headers: { "content-type": "application/json", ...cors(request) } }
  );
};

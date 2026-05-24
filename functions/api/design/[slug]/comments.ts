import { cors, json, type Env } from "../../../_shared/design-db";

export const onRequestOptions: PagesFunction<Env> = async ({ request }) =>
  new Response(null, { headers: cors(request) });

export const onRequestGet: PagesFunction<Env> = async ({ params, env, request }) => {
  const slug = params.slug as string;
  if (!slug) return json({ error: "Invalid slug" }, 400);

  const { results } = await env.DB.prepare(
    `SELECT id, author_name, body, created_at FROM design_comments
     WHERE slug = ?1 ORDER BY datetime(created_at) DESC LIMIT 100`
  )
    .bind(slug)
    .all<{ id: string; author_name: string; body: string; created_at: string }>();

  const comments = (results ?? []).map((r) => ({
    id: r.id,
    authorName: r.author_name,
    body: r.body,
    createdAt: r.created_at,
  }));

  return new Response(JSON.stringify({ comments }), {
    headers: { "content-type": "application/json", ...cors(request) },
  });
};

export const onRequestPost: PagesFunction<Env> = async ({ params, env, request }) => {
  const slug = params.slug as string;
  if (!slug || slug.length > 120) return json({ error: "Invalid slug" }, 400);

  let body: { authorName?: string; text?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const authorName = (body.authorName ?? "").trim().slice(0, 80);
  const text = (body.text ?? "").trim().slice(0, 2000);

  if (authorName.length < 2) return json({ error: "Name is too short" }, 400);
  if (text.length < 2) return json({ error: "Comment is too short" }, 400);

  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO design_comments (id, slug, author_name, body) VALUES (?1, ?2, ?3, ?4)`
  )
    .bind(id, slug, authorName, text)
    .run();

  return new Response(
    JSON.stringify({
      comment: {
        id,
        authorName,
        body: text,
        createdAt: new Date().toISOString(),
      },
    }),
    { status: 201, headers: { "content-type": "application/json", ...cors(request) } }
  );
};

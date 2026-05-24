export type Env = { DB: D1Database };

export async function ensureStats(db: D1Database, slug: string) {
  await db
    .prepare(
      `INSERT INTO design_stats (slug, view_count, like_count) VALUES (?1, 0, 0)
       ON CONFLICT(slug) DO NOTHING`
    )
    .bind(slug)
    .run();
}

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}

export function cors(request: Request) {
  const origin = request.headers.get("Origin");
  return {
    "access-control-allow-origin": origin ?? "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
  };
}

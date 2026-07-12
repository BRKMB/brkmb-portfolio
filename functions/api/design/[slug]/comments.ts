import engagement from "../../../_data/design-engagement.json";
import { cors, json, type Env } from "../../../_shared/design-db";

type BehanceComment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
};

type EngagementRow = { views?: number; likes?: number; comments?: BehanceComment[] };

const bySlug = engagement as Record<string, EngagementRow>;

export const onRequestOptions: PagesFunction<Env> = async ({ request }) =>
  new Response(null, { headers: cors(request) });

export const onRequestGet: PagesFunction<Env> = async ({ params, request }) => {
  const slug = params.slug as string;
  if (!slug) return json({ error: "Invalid slug" }, 400);

  const comments = bySlug[slug]?.comments ?? [];

  return new Response(JSON.stringify({ comments }), {
    headers: { "content-type": "application/json", ...cors(request) },
  });
};

/** Comments are read-only — sourced from Behance sync. */
export const onRequestPost: PagesFunction<Env> = async () =>
  json({ error: "Comments are synced from Behance only." }, 405);

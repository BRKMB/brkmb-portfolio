#!/usr/bin/env node
/**
 * Sync views, likes, and comments from Behance into portfolio.json.
 * Usage: BEHANCE_API_KEY=optional node scripts/sync-behance-engagement.mjs
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { fetchProject, parseBehanceEngagement } from "./fetch-behance-project.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const DELAY_MS = Number(process.env.BEHANCE_DELAY_MS ?? 5500);
const API_KEY = process.env.BEHANCE_API_KEY ?? process.env.BEHANCE_CLIENT_ID ?? "";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
}

function galleryPathFromUrl(url) {
  const m = url?.match(/behance\.net\/gallery\/\d+\/([^/?#]+)/i);
  return m?.[1] ?? null;
}

function mapComment(c) {
  const created = c.created_on ?? c.posted_on ?? c.timestamp;
  return {
    id: String(c.id ?? c.comment_id ?? crypto.randomUUID()),
    authorName:
      c.user?.display_name?.trim() ||
      c.user?.username?.trim() ||
      [c.user?.first_name, c.user?.last_name].filter(Boolean).join(" ").trim() ||
      "Behance user",
    body: stripHtml(c.comment ?? c.text ?? c.body ?? ""),
    createdAt: created
      ? new Date(Number(created) * 1000).toISOString()
      : new Date().toISOString(),
  };
}

async function fetchComments(galleryId) {
  const all = [];
  let page = 1;
  const maxPages = 20;

  while (page <= maxPages) {
    const qs = new URLSearchParams({ page: String(page) });
    if (API_KEY) qs.set("api_key", API_KEY);
    const url = `https://www.behance.net/v2/projects/${galleryId}/comments?${qs}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
    });
    if (res.status === 429) {
      console.warn(`  comments rate-limited on page ${page}, keeping partial (${all.length})`);
      break;
    }
    if (!res.ok) {
      console.warn(`  comments HTTP ${res.status} for ${galleryId}`);
      break;
    }
    const data = await res.json();
    const batch = data.comments ?? data.data?.comments ?? [];
    if (!batch.length) break;
    for (const c of batch) {
      const mapped = mapComment(c);
      if (mapped.body) all.push(mapped);
    }
    if (batch.length < 20) break;
    page += 1;
    await sleep(1200);
  }

  return all;
}

async function main() {
  const orderPath = path.join(root, "src/data/behance-import-order.json");
  const portfolioPath = path.join(root, "src/data/portfolio.json");
  const outPath = path.join(root, "src/data/behance-engagement.json");

  const order = JSON.parse(fs.readFileSync(orderPath, "utf8"));
  const portfolio = JSON.parse(fs.readFileSync(portfolioPath, "utf8"));
  const bySlug = new Map(portfolio.map((p) => [p.slug, p]));
  const summary = { updatedAt: new Date().toISOString(), projects: {} };
  const forFunctions = {};

  for (const meta of order.projects ?? []) {
    const item = bySlug.get(meta.slug);
    if (!item) {
      console.warn(`skip missing slug ${meta.slug}`);
      continue;
    }

    const galleryId = meta.galleryId ?? Number(String(item.id).replace("behance-", ""));
    const slugPath = galleryPathFromUrl(meta.url) ?? null;

    process.stdout.write(`${meta.slug} (${galleryId})… `);

    try {
      const project = await fetchProject(galleryId, slugPath);
      const { views, likes, commentCount } = parseBehanceEngagement(project);
      let comments = [];
      if (commentCount > 0) {
        comments = await fetchComments(galleryId);
        if (!comments.length && commentCount > 0) {
          console.warn(`expected ~${commentCount} comments but API returned 0`);
        }
      }

      item.behanceGalleryId = galleryId;
      item.behanceUrl = meta.url;
      item.behanceEngagement = {
        views,
        likes,
        commentCount: comments.length || commentCount,
        comments,
        syncedAt: Math.floor(Date.now() / 1000),
      };

      summary.projects[item.slug] = {
        galleryId,
        views,
        likes,
        commentCount: comments.length || commentCount,
        behanceUrl: meta.url,
      };
      forFunctions[item.slug] = { views, likes, comments };

      console.log(`views ${views}, likes ${likes}, comments ${comments.length}`);
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }

    await sleep(DELAY_MS);
  }

  fs.writeFileSync(portfolioPath, JSON.stringify(portfolio, null, 2) + "\n");
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2) + "\n");

  const publicOut = path.join(root, "public/data/behance-engagement.json");
  fs.mkdirSync(path.dirname(publicOut), { recursive: true });
  fs.writeFileSync(publicOut, JSON.stringify(summary, null, 2) + "\n");

  const fnOut = path.join(root, "functions/_data/design-engagement.json");
  fs.mkdirSync(path.dirname(fnOut), { recursive: true });
  fs.writeFileSync(fnOut, JSON.stringify(forFunctions, null, 2) + "\n");

  console.log(`\nWrote ${portfolioPath}, ${outPath}, ${publicOut}, ${fnOut}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

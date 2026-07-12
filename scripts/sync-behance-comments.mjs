#!/usr/bin/env node
/**
 * Fetch comment bodies only (for projects that already have behanceEngagement.commentCount > 0).
 * Run after sync-behance-engagement when comments API was rate-limited.
 *
 * BEHANCE_API_KEY=your_key BEHANCE_COMMENT_DELAY_MS=15000 node scripts/sync-behance-comments.mjs
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const DELAY_MS = Number(process.env.BEHANCE_COMMENT_DELAY_MS ?? 15000);
const API_KEY = process.env.BEHANCE_API_KEY ?? process.env.BEHANCE_CLIENT_ID ?? "";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
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
  while (page <= 20) {
    const qs = new URLSearchParams({ page: String(page) });
    if (API_KEY) qs.set("api_key", API_KEY);
    const url = `https://www.behance.net/v2/projects/${galleryId}/comments?${qs}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
    });
    if (res.status === 429) throw new Error("rate limited");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const batch = data.comments ?? [];
    if (!batch.length) break;
    for (const c of batch) {
      const mapped = mapComment(c);
      if (mapped.body) all.push(mapped);
    }
    if (batch.length < 20) break;
    page += 1;
    await sleep(2000);
  }
  return all;
}

async function main() {
  const portfolioPath = path.join(root, "src/data/portfolio.json");
  const fnPath = path.join(root, "functions/_data/design-engagement.json");
  const portfolio = JSON.parse(fs.readFileSync(portfolioPath, "utf8"));
  const fnData = JSON.parse(fs.readFileSync(fnPath, "utf8"));

  const targets = portfolio.filter(
    (p) => (p.behanceEngagement?.commentCount ?? 0) > 0 && (p.behanceGalleryId || p.id)
  );

  for (const item of targets) {
    const galleryId = item.behanceGalleryId ?? Number(String(item.id).replace("behance-", ""));
    process.stdout.write(`${item.slug}… `);
    try {
      const comments = await fetchComments(galleryId);
      item.behanceEngagement.comments = comments;
      fnData[item.slug] = {
        views: item.behanceEngagement.views,
        likes: item.behanceEngagement.likes,
        comments,
      };
      console.log(`${comments.length} comment(s)`);
    } catch (e) {
      console.log(`skip (${e.message})`);
    }
    await sleep(DELAY_MS);
  }

  fs.writeFileSync(portfolioPath, JSON.stringify(portfolio, null, 2) + "\n");
  fs.writeFileSync(fnPath, JSON.stringify(fnData, null, 2) + "\n");
  console.log("Done.");
}

main();

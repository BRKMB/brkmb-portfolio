#!/usr/bin/env node
/**
 * Re-import every Behance gallery from behance-profile-galleries.json
 * into portfolio.json (faithful copy — no invented metadata).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { importBehanceGallery } from "./fetch-behance-project.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const galleriesPath = path.join(root, "src/data/behance-profile-galleries.json");
const portfolioPath = path.join(root, "src/data/portfolio.json");
const orderPath = path.join(root, "src/data/behance-import-order.json");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const galleries = JSON.parse(fs.readFileSync(galleriesPath, "utf8")).sort(
  (a, b) => Number(a.id) - Number(b.id)
);

const portfolio = [];
const errors = [];

for (const g of galleries) {
  console.log(`→ ${g.path} (${g.id})`);
  await sleep(3500);
  try {
    const { item } = await importBehanceGallery(g.id, {
      slugPath: g.path,
      slug: g.slug,
    });
    item.slug = g.slug;
    portfolio.push(item);
    console.log(`  ✓ ${item.title} — ${item.blocks.length} blocks`);
  } catch (e) {
    console.error(`  ✗ ${e.message}`);
    errors.push({ ...g, error: e.message });
  }
}

fs.writeFileSync(portfolioPath, JSON.stringify(portfolio, null, 2) + "\n");

const order = {
  profile: "https://www.behance.net/baher-bottros",
  note: "Synced from Behance profile (oldest first by gallery id).",
  imported: portfolio.map((p) => p.slug),
  projects: galleries.map((g, i) => ({
    order: i + 1,
    title: portfolio.find((p) => p.slug === g.slug)?.title ?? g.path,
    slug: g.slug,
    galleryId: Number(g.id),
    url: `https://www.behance.net/gallery/${g.id}/${g.path}`,
    status: portfolio.some((p) => p.slug === g.slug) ? "imported" : "failed",
  })),
};
fs.writeFileSync(orderPath, JSON.stringify(order, null, 2) + "\n");

console.log(`\nDone: ${portfolio.length}/${galleries.length} projects`);
if (errors.length) console.log("Errors:", errors);

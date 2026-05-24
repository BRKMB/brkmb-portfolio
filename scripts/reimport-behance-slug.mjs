#!/usr/bin/env node
/**
 * Re-import one Behance project by slug (replaces entry in portfolio.json).
 * Usage: node scripts/reimport-behance-slug.mjs <slug>
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { importBehanceGallery } from "./fetch-behance-project.mjs";

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/reimport-behance-slug.mjs <slug>");
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const orderPath = path.join(root, "src/data/behance-import-order.json");
const portfolioPath = path.join(root, "src/data/portfolio.json");

const order = JSON.parse(fs.readFileSync(orderPath, "utf8"));
const meta = order.projects.find((p) => p.slug === slug);
if (!meta?.galleryId || !meta.url) {
  console.error(`Unknown or incomplete order entry: ${slug}`);
  process.exit(1);
}

const slugPath = meta.url.match(/gallery\/\d+\/([^/?#]+)/)?.[1];
const { item } = await importBehanceGallery(String(meta.galleryId), {
  slugPath,
  slug: meta.slug,
});
item.slug = meta.slug;

const portfolio = JSON.parse(fs.readFileSync(portfolioPath, "utf8"));
const idx = portfolio.findIndex((p) => p.slug === slug);
if (idx === -1) portfolio.push(item);
else portfolio[idx] = item;

fs.writeFileSync(portfolioPath, JSON.stringify(portfolio, null, 2) + "\n");
console.log(`Re-imported ${slug}: ${item.blocks.length} blocks`);
console.log(
  item.blocks.map((b) => `${b.type}${b.type === "embed" ? ` (${b.url.slice(0, 60)}…)` : ""}`).join(", ")
);

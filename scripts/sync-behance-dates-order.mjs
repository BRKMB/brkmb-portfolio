#!/usr/bin/env node
/** Pull publishedOn from Behance and sort portfolio newest-first (no image re-download). */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { importBehanceGallery } from "./fetch-behance-project.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const galleries = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/behance-profile-galleries.json"), "utf8")
);
const portfolioPath = path.join(root, "src/data/portfolio.json");
const portfolio = JSON.parse(fs.readFileSync(portfolioPath, "utf8"));
const bySlug = Object.fromEntries(portfolio.map((p) => [p.slug, p]));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (const g of galleries) {
  await sleep(2500);
  const { project } = await importBehanceGallery(g.id, { slugPath: g.path, slug: g.slug });
  const item = bySlug[g.slug];
  if (!item) continue;
  item.publishedOn = project.publishedOn;
  item.year = new Date(project.publishedOn * 1000).getFullYear().toString();
  console.log(g.slug, item.year, new Date(project.publishedOn * 1000).toISOString().slice(0, 10));
}

portfolio.sort((a, b) => b.publishedOn - a.publishedOn);
fs.writeFileSync(portfolioPath, JSON.stringify(portfolio, null, 2) + "\n");
console.log("\nSorted newest first:", portfolio[0].title, "→", portfolio.at(-1).title);

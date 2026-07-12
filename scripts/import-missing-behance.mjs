#!/usr/bin/env node
/** Import galleries listed in behance-profile-galleries.json that are not yet in portfolio.json */
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
const orderPath = path.join(root, "src/data/behance-import-order.json");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const portfolio = JSON.parse(fs.readFileSync(portfolioPath, "utf8"));
const existing = new Set(portfolio.map((p) => p.slug));

const missing = galleries.filter((g) => !existing.has(g.slug));
console.log(`Missing ${missing.length} of ${galleries.length} Behance projects\n`);

for (const g of missing) {
  console.log(`→ ${g.path}`);
  await sleep(4000);
  try {
    const { item } = await importBehanceGallery(g.id, { slugPath: g.path, slug: g.slug });
    item.slug = g.slug;
    portfolio.push(item);
    existing.add(g.slug);
    console.log(`  ✓ ${item.title} (${item.blocks.length} blocks)`);
  } catch (e) {
    console.error(`  ✗ ${e.message}`);
  }
}

portfolio.sort((a, b) => b.publishedOn - a.publishedOn);
fs.writeFileSync(portfolioPath, JSON.stringify(portfolio, null, 2) + "\n");

const order = {
  profile: "https://www.behance.net/baher-bottros",
  note: "Full Behance Work tab (35 projects). Newest first on site.",
  imported: portfolio.map((p) => p.slug),
  projects: portfolio.map((p, i) => {
    const g = galleries.find((x) => x.slug === p.slug);
    return {
      order: i + 1,
      title: p.title,
      slug: p.slug,
      galleryId: g ? Number(g.id) : Number(p.id.replace("behance-", "")),
      url: g ? `https://www.behance.net/gallery/${g.id}/${g.path}` : undefined,
      publishedOn: p.publishedOn,
      status: "imported",
    };
  }),
};
fs.writeFileSync(orderPath, JSON.stringify(order, null, 2) + "\n");
console.log(`\nTotal portfolio: ${portfolio.length}`);

#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { importBehanceGallery } from "./fetch-behance-project.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const orderPath = path.join(root, "src/data/behance-import-order.json");
const portfolioPath = path.join(root, "src/data/portfolio.json");

function slugPathFromUrl(url) {
  const m = url?.match(/gallery\/\d+\/([^/?#]+)/);
  return m?.[1] ?? null;
}

const order = JSON.parse(fs.readFileSync(orderPath, "utf8"));
const portfolio = JSON.parse(fs.readFileSync(portfolioPath, "utf8"));
const existing = new Set(portfolio.map((p) => p.slug));

const pending = order.projects.filter(
  (p) => p.status === "pending" && p.galleryId && p.url
);

for (const meta of pending) {
  if (existing.has(meta.slug)) {
    console.log(`skip (exists): ${meta.slug}`);
    meta.status = "imported";
    continue;
  }
  const slugPath = slugPathFromUrl(meta.url);
  console.log(`importing #${meta.order} ${meta.title}…`);
  try {
    const { item } = await importBehanceGallery(String(meta.galleryId), {
      slugPath,
      slug: meta.slug,
      category: "Graphic design",
      tools: ["Photoshop", "Illustrator"],
      role: "Design",
      year: meta.published?.slice(0, 4) ?? "2021",
    });
    item.slug = meta.slug;
    portfolio.push(item);
    existing.add(meta.slug);
    meta.status = "imported";
    order.imported.push(meta.slug);
    console.log(`  ✓ ${item.blocks.length} blocks`);
  } catch (e) {
    console.error(`  ✗ ${meta.slug}:`, e.message);
  }
}

fs.writeFileSync(portfolioPath, JSON.stringify(portfolio, null, 2) + "\n");
fs.writeFileSync(orderPath, JSON.stringify(order, null, 2) + "\n");
console.log(`\nPortfolio: ${portfolio.length} projects`);

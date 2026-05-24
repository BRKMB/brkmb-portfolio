#!/usr/bin/env node
/** Import older Behance projects (prepend to portfolio, oldest first). */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { importBehanceGallery } from "./fetch-behance-project.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const older = [
  { galleryId: 105797069, slugPath: "Slo-Mo-Free-Bird", slug: "slo-mo-free-bird", title: "Slo Mo Free Bird" },
  { galleryId: 105873019, slugPath: "Sun-Rose", slug: "sun-rose", title: "Sun Rose" },
  { galleryId: 105873183, slugPath: "Lord-of-Rings", slug: "lord-of-rings", title: "Lord of Rings" },
  {
    galleryId: 105875231,
    slugPath: "Stay-in-your-right-place-to-Rise",
    slug: "stay-in-your-right-place-to-rise",
    title: "Stay in your right place to Rise",
  },
  { galleryId: 105875455, slugPath: "2-Soul-Rose", slug: "2-soul-rose", title: "2 Soul Rose" },
  {
    galleryId: 107778681,
    slugPath: "NATURE-SESSION-SHORT-FOOTAGE",
    slug: "nature-session-short-footage",
    title: "NATURE SESSION SHORT FOOTAGE",
  },
  { galleryId: 109430527, slugPath: "Muizz-Street", slug: "muizz-street", title: "Muizz Street" },
  {
    galleryId: 124073461,
    slugPath: "Pollo-Planet-Restaurant-Logo-Design",
    slug: "pollo-planet-restaurant-logo-design",
    title: "Pollo Planet Restaurant Logo Design",
  },
  {
    galleryId: 124128653,
    slugPath: "Farouk-Pasha-Corner",
    slug: "farouk-pasha-corner",
    title: "Farouk Pasha Corner",
  },
  {
    galleryId: 127062567,
    slugPath: "ELWADI-MALL-Website-Design",
    slug: "elwadi-mall-website-design",
    title: "ELWADI MALL Website Design",
  },
  {
    galleryId: 127064501,
    slugPath: "Baristas-Caf-Logo-Design",
    slug: "baristas-caf-logo-design",
    title: "Baristas Caf Logo Design",
  },
  {
    galleryId: 127142319,
    slugPath: "B3E-Perfume-Logo-Design",
    slug: "b3e-perfume-logo-design",
    title: "B3E Perfume Logo Design",
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const portfolioPath = path.join(root, "src/data/portfolio.json");
const orderPath = path.join(root, "src/data/behance-import-order.json");

const portfolio = JSON.parse(fs.readFileSync(portfolioPath, "utf8"));
const existing = new Set(portfolio.map((p) => p.slug));
const imported = [];

for (const meta of older) {
  if (existing.has(meta.slug)) {
    console.log(`skip ${meta.slug}`);
    continue;
  }
  console.log(`import ${meta.title}…`);
  await sleep(4000);
  try {
    const { item } = await importBehanceGallery(String(meta.galleryId), {
      slugPath: meta.slugPath,
      slug: meta.slug,
      category: "Graphic design",
      tools: ["Photoshop", "Illustrator"],
      role: "Design",
      year: "2020",
    });
    item.slug = meta.slug;
    item.title = item.title || meta.title;
    portfolio.unshift(item);
    existing.add(meta.slug);
    imported.push(meta);
    console.log(`  ✓ ${item.blocks.length} blocks`);
  } catch (e) {
    console.error(`  ✗ ${meta.slug}:`, e.message);
  }
}

fs.writeFileSync(portfolioPath, JSON.stringify(portfolio, null, 2) + "\n");

const order = JSON.parse(fs.readFileSync(orderPath, "utf8"));
let n = 0;
for (const meta of older) {
  const entry = {
    order: ++n,
    title: meta.title,
    slug: meta.slug,
    galleryId: meta.galleryId,
    url: `https://www.behance.net/gallery/${meta.galleryId}/${meta.slugPath}`,
    status: existing.has(meta.slug) ? "imported" : "pending",
  };
  if (imported.some((i) => i.slug === meta.slug)) entry.status = "imported";
  const idx = order.projects.findIndex((p) => p.slug === meta.slug);
  if (idx === -1) order.projects.unshift(entry);
  else order.projects[idx] = { ...order.projects[idx], ...entry };
}
order.projects.forEach((p, i) => {
  p.order = i + 1;
});
order.imported = order.projects.filter((p) => p.status === "imported").map((p) => p.slug);
fs.writeFileSync(orderPath, JSON.stringify(order, null, 2) + "\n");
console.log(`\nPortfolio total: ${portfolio.length}`);

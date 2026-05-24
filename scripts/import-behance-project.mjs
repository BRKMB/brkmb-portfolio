#!/usr/bin/env node
/**
 * Import one Behance gallery into portfolio.json (images + blocks).
 * Usage: node scripts/import-behance-project.mjs <galleryId> <slug> "<title>"
 *
 * Example:
 * node scripts/import-behance-project.mjs 128573121 port-hapi-manipulation "Port Hapi - Manipulation"
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const galleryId = process.argv[2];
const slug = process.argv[3];
const title = process.argv[4];

if (!galleryId || !slug || !title) {
  console.error("Usage: node scripts/import-behance-project.mjs <galleryId> <slug> \"<title>\"");
  process.exit(1);
}

const portfolioPath = path.join(root, "src/data/portfolio.json");
const imgDir = path.join(root, "public/images/behance", slug);

async function fetchProjectHtml(id) {
  const res = await fetch(`https://www.behance.net/gallery/${id}`, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; brkmb-import/1.0)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for gallery ${id}`);
  return res.text();
}

function extractImageUrls(html, id) {
  const urls = new Set();
  const re = /https:\/\/mir-s3-cdn-cf\.behance\.net\/[^"'\s)]+/g;
  for (const match of html.matchAll(re)) {
    const url = match[0];
    if (
      url.includes(String(id)) ||
      url.includes("project_modules") ||
      (url.includes("/projects/") && !url.includes("/projects/404/"))
    ) {
      if (!url.includes("tools/") && !url.includes("creative_fields")) urls.add(url);
    }
  }
  return [...urls].filter((u) => u.includes("project_modules") || u.includes("/projects/"));
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Download failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

async function main() {
  console.log(`Fetching Behance gallery ${galleryId}…`);
  const html = await fetchProjectHtml(galleryId);
  let urls = extractImageUrls(html, galleryId);
  if (!urls.length) {
    console.warn("No images parsed from HTML — open project in browser and add URLs manually.");
    urls = [];
  }

  fs.mkdirSync(imgDir, { recursive: true });
  const localPaths = [];
  let i = 0;
  for (const url of urls.slice(0, 12)) {
    const ext = url.includes(".webp") ? "webp" : "jpg";
    const name = i === 0 ? `cover.${ext}` : `${String(i).padStart(2, "0")}.${ext}`;
    const dest = path.join(imgDir, name);
    console.log(`  ↓ ${name}`);
    await download(url, dest);
    localPaths.push(`/images/behance/${slug}/${name}`);
    i++;
  }

  const cover = localPaths[0] ?? "/images/placeholders/gallery-1.svg";
  const blocks = localPaths.map((src, idx) => ({
    id: `${slug}-img-${idx}`,
    type: "image",
    src,
    alt: title,
  }));

  if (blocks.length) {
    blocks.splice(1, 0, {
      id: `${slug}-intro`,
      type: "text",
      content: `${title}\n\nImported from Behance.`,
      align: "left",
      color: "rgba(255,255,255,0.92)",
      fontSize: "lg",
    });
  }

  const item = {
    id: `behance-${galleryId}`,
    slug,
    title,
    category: "Graphic design",
    image: cover,
    description: title,
    role: "Art direction, design",
    tools: ["Photoshop", "Illustrator"],
    year: new Date().getFullYear().toString(),
    blocks,
  };

  const portfolio = JSON.parse(fs.readFileSync(portfolioPath, "utf8"));
  const without = portfolio.filter((p) => p.slug !== slug);
  const draftIdx = without.findIndex((p) => p.slug === "new");
  const insertAt = draftIdx >= 0 ? draftIdx : without.findIndex((p) => p.hidden) >= 0 ? without.findIndex((p) => p.hidden) : 0;
  without.splice(insertAt, 0, item);
  fs.writeFileSync(portfolioPath, JSON.stringify(without, null, 2) + "\n");
  console.log(`\n✓ Added "${title}" at portfolio index ${insertAt}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

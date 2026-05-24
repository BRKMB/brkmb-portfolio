#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { importBehanceGallery } from "./fetch-behance-project.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const GALLERIES = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/behance-profile-galleries.json"), "utf8").catch(() => null) ||
    "null"
);

async function main() {
  const list =
    GALLERIES ??
    JSON.parse(fs.readFileSync(path.join(root, "src/data/behance-import-order.json"), "utf8"))
      .projects.filter((p) => p.galleryId)
      .map((p) => ({
        id: String(p.galleryId),
        path: p.url?.match(/gallery\/\d+\/([^/?#]+)/)?.[1],
        slug: p.slug,
      }));

  const portfolio = JSON.parse(
    fs.readFileSync(path.join(root, "src/data/portfolio.json"), "utf8")
  );
  const bySlug = Object.fromEntries(portfolio.map((p) => [p.slug, p]));

  const issues = [];
  for (const g of list) {
    await new Promise((r) => setTimeout(r, 2500));
    try {
      const { project } = await importBehanceGallery(g.id, { slugPath: g.path });
      const slug =
        g.slug ??
        project.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const local = bySlug[slug];
      const types = project.modules.map((m) => m.__typename);
      const unknown = [...new Set(types)].filter(
        (t) =>
          ![
            "ImageModule",
            "TextModule",
            "VideoModule",
            "EmbedModule",
            "MediaCollectionModule",
            "MediaModule",
          ].includes(t)
      );
      if (unknown.length) issues.push({ slug, kind: "unknown_module", unknown });
      if (!local) {
        issues.push({ slug, kind: "missing_local", behanceName: project.name });
        continue;
      }
      if (local.title !== project.name)
        issues.push({
          slug,
          kind: "title_mismatch",
          local: local.title,
          behance: project.name,
        });
      if (local.role && local.role !== "Design" && !project.description?.includes(local.role))
        issues.push({ slug, kind: "maybe_invented_role", role: local.role });
      if (local.role === "Design")
        issues.push({ slug, kind: "invented_role_default" });
      const behanceBlocks = types.length;
      if (Math.abs((local.blocks?.length ?? 0) - behanceBlocks) > 2)
        issues.push({
          slug,
          kind: "block_count",
          local: local.blocks?.length,
          behanceModules: behanceBlocks,
          types,
        });
    } catch (e) {
      issues.push({ slug: g.slug ?? g.id, kind: "fetch_error", error: e.message });
    }
  }
  console.log(JSON.stringify(issues, null, 2));
  console.log("\nTotal issues:", issues.length);
}

main();

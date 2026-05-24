#!/usr/bin/env node
/**
 * Fetch Behance project from gallery page JSON (beconfig-store_state).
 * Usage: node scripts/fetch-behance-project.mjs <galleryId>
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseTextColor(html) {
  const m = html?.match(/color:\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/);
  return m?.[1];
}

function parseFontSize(html) {
  const m = html?.match(/font-size:\s*(\d+)px/i);
  if (!m) return "md";
  const px = Number(m[1]);
  if (px >= 28) return "lg";
  if (px <= 14) return "sm";
  return "md";
}

function parseTextAlign(mod) {
  if (mod.alignment === "center") return "center";
  if (mod.alignment === "right") return "right";
  return "left";
}

function behanceToolNames(project) {
  return (project.tools ?? [])
    .map((t) => (t.title || "").replace(/^Adobe\s+/i, "").trim())
    .filter(Boolean);
}

/** Category chip: from Behance tags only (never invented). */
function behanceCategory(project) {
  const tags = project.tags?.map((t) => t.title).filter(Boolean) ?? [];
  const prefer = [
    "Packaging",
    "Logo Design",
    "Photography",
    "Advertising",
    "Web Design",
    "Branding",
    "Illustration",
    "Art Direction",
  ];
  for (const p of prefer) {
    const hit = tags.find((t) => t.toLowerCase().includes(p.toLowerCase()));
    if (hit) return hit;
  }
  return (tags[0] ?? "Graphic design").trim();
}

function pickImageUrl(mod) {
  const sizes = mod.imageSizes?.allAvailable ?? [];
  /** Avoid source/fs — files can exceed Cloudflare Pages 25 MiB limit. */
  const isGif = sizes.some((s) => s.url?.endsWith(".gif"));
  const prefer = isGif
    ? ["max_158", "max_316", "max_632", "disp", "hd"]
    : ["max_1200", "1400", "hd", "2800", "disp", "max_808", "808"];
  for (const key of prefer) {
    const found = sizes.find((s) => s.url?.includes(`/${key}/`) || s.url?.includes(`_${key}/`));
    if (found?.url && !found.url.endsWith(".webp")) return found.url;
  }
  const jpg = sizes.find((s) => s.url?.endsWith(".jpg") || s.url?.endsWith(".png"));
  return jpg?.url ?? mod.src;
}

function pickCoverUrl(project) {
  const sizes = project.covers?.allAvailable ?? [];
  const prefer = ["max_808", "808", "404", "disp", "original"];
  for (const key of prefer) {
    const found = sizes.find((s) => s.url?.includes(`/${key}/`));
    if (found?.url) return found.url;
  }
  return sizes[0]?.url;
}

function parsePageBackground(stylesInline) {
  const m = stylesInline?.match(/background-color:\s*(#[0-9a-fA-F]{3,8})/);
  return m?.[1];
}

function modulesToBlocks(modules, slug) {
  const blocks = [];
  let n = 0;
  for (const mod of modules) {
    const id = `${slug}-${n++}`;
    if (mod.__typename === "ImageModule") {
      blocks.push({
        id: `${id}-img`,
        type: "image",
        src: `__DOWNLOAD__:${pickImageUrl(mod)}`,
        alt: stripHtml(mod.altText) || undefined,
        caption: mod.caption || undefined,
      });
    } else if (mod.__typename === "TextModule") {
      const linkMatch = mod.text?.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
      const link = linkMatch?.[1];
      const linkLabel = linkMatch ? stripHtml(linkMatch[2]) : "";
      const content = linkLabel || stripHtml(mod.text);
      if (!content) continue;
      const textBlock = {
        id: `${id}-txt`,
        type: "text",
        content,
        align: parseTextAlign(mod),
        fontSize: parseFontSize(mod.text),
      };
      const color = parseTextColor(mod.text);
      if (color) textBlock.color = color;
      if (link && !/youtube|vimeo|dailymotion/i.test(link)) textBlock.href = link;
      blocks.push(textBlock);
    } else if (mod.__typename === "MediaCollectionModule") {
      for (let ci = 0; ci < (mod.components ?? []).length; ci++) {
        const comp = mod.components[ci];
        const url = pickImageUrl({ imageSizes: comp.imageSizes });
        if (!url) continue;
        blocks.push({
          id: `${id}-img-${ci}`,
          type: "image",
          src: `__DOWNLOAD__:${url}`,
          caption: ci === 0 && mod.caption ? mod.caption : undefined,
        });
      }
    } else if (mod.__typename === "VideoModule" || mod.__typename === "MediaModule") {
      const embedHtml = mod.embed || mod.fluidEmbed || "";
      const iframe = embedHtml.match(/src=["']([^"']+)["']/i)?.[1];
      const src =
        mod.videoUrl ||
        mod.src ||
        mod.embedUrl ||
        mod.video?.url ||
        mod.video?.source ||
        iframe;
      if (src) {
        blocks.push({
          id: `${id}-embed`,
          type: "embed",
          url: src,
          caption: stripHtml(mod.caption) || undefined,
        });
      }
    } else if (mod.__typename === "EmbedModule") {
      const html = mod.originalEmbed || mod.fluidEmbed || "";
      const iframe = html.match(/src=["']([^"']+)["']/i)?.[1];
      const url = iframe || mod.embedUrl;
      if (url) blocks.push({ id: `${id}-embed`, type: "embed", url });
    }
  }
  return blocks;
}

async function fetchProject(galleryId, slugPath) {
  const url = slugPath
    ? `https://www.behance.net/gallery/${galleryId}/${slugPath}`
    : `https://www.behance.net/gallery/${galleryId}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      Accept: "text/html",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const html = await res.text();
  const m = html.match(/id="beconfig-store_state">([\s\S]*?)<\/script>/);
  if (!m) throw new Error("beconfig-store_state not found");
  const state = JSON.parse(m[1]);
  const project = state.project?.project;
  if (!project) throw new Error("project missing in state");
  return project;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Download ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return dest;
}

function extFromUrl(url) {
  const u = url.split("?")[0];
  if (u.endsWith(".png")) return "png";
  if (u.endsWith(".gif")) return "gif";
  if (u.endsWith(".webp")) return "webp";
  return "jpg";
}

export async function importBehanceGallery(galleryId, opts = {}) {
  const project = await fetchProject(galleryId, opts.slugPath);
  const slug =
    opts.slug ??
    project.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const imgDir = path.join(root, "public/images/behance", slug);
  fs.mkdirSync(imgDir, { recursive: true });

  const blocks = modulesToBlocks(project.modules, slug);
  let imgIndex = 0;

  for (const block of blocks) {
    if (block.type === "grid" && block.images) {
      const localImages = [];
      for (const entry of block.images) {
        if (!entry?.startsWith("__DOWNLOAD__:")) {
          localImages.push(entry);
          continue;
        }
        const remote = entry.replace("__DOWNLOAD__:", "");
        const name =
          imgIndex === 0
            ? `cover.${extFromUrl(remote)}`
            : `${String(imgIndex).padStart(2, "0")}.${extFromUrl(remote)}`;
        const local = `/images/behance/${slug}/${name}`;
        await download(remote, path.join(root, "public", local));
        localImages.push(local);
        imgIndex++;
      }
      block.images = localImages;
      continue;
    }
    if (block.src?.startsWith("__DOWNLOAD__:")) {
      const remote = block.src.replace("__DOWNLOAD__:", "");
      const name =
        imgIndex === 0
          ? `cover.${extFromUrl(remote)}`
          : `${String(imgIndex).padStart(2, "0")}.${extFromUrl(remote)}`;
      const local = `/images/behance/${slug}/${name}`;
      await download(remote, path.join(root, "public", local));
      block.src = local;
      imgIndex++;
    }
  }

  const coverRemote = pickCoverUrl(project);
  const coverName = `thumb.${extFromUrl(coverRemote)}`;
  const coverLocal = `/images/behance/${slug}/${coverName}`;
  await download(coverRemote, path.join(root, "public", coverLocal));

  const firstImage = blocks.find((b) => b.type === "image")?.src ?? coverLocal;
  const pageBg = parsePageBackground(project.stylesInline);

  const description = stripHtml(project.description);
  const item = {
    id: `behance-${galleryId}`,
    slug,
    title: project.name,
    category: behanceCategory(project),
    image: coverLocal,
    description: description || undefined,
    overview: description || undefined,
    tools: behanceToolNames(project),
    tags: project.tags?.map((t) => t.title?.trim()).filter(Boolean) ?? [],
    publishedOn: project.publishedOn,
    year: new Date(project.publishedOn * 1000).getFullYear().toString(),
    styleDefaults: pageBg ? { pageBackground: pageBg } : undefined,
    blocks,
  };

  return { item, project };
}

// CLI
if (process.argv[1]?.includes("fetch-behance-project")) {
  const galleryId = process.argv[2];
  if (!galleryId) {
    console.error("Usage: node scripts/fetch-behance-project.mjs <galleryId>");
    process.exit(1);
  }
  importBehanceGallery(galleryId)
    .then(({ item }) => {
      console.log(JSON.stringify(item, null, 2));
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

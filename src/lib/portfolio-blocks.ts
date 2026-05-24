import type { PortfolioItem } from "@/types";
import type { DesignBlock, DesignBlockType, DesignImageBlock } from "@/types/design-blocks";

export const THUMB_RATIO_LABEL = "4 : 3";
export const THUMB_SIZE_HINT = "800 × 600 px (min. 600 × 450)";
export const COVER_RATIO_LABEL = "16 : 9";
export const COVER_SIZE_HINT = "1920 × 1080 px recommended";

export function newBlockId(prefix = "block") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createBlock(type: DesignBlockType): DesignBlock {
  switch (type) {
    case "image":
      return { id: newBlockId("img"), type: "image", src: "" };
    case "text":
      return {
        id: newBlockId("txt"),
        type: "text",
        content: "",
        align: "left",
        color: "rgba(255,255,255,0.92)",
        fontSize: "md",
      };
    case "grid":
      return { id: newBlockId("grid"), type: "grid", images: [], columns: 2 };
    case "split":
      return {
        id: newBlockId("split"),
        type: "split",
        layout: "text-left",
        text: "",
        textColor: "rgba(255,255,255,0.92)",
        textAlign: "left",
        image: "",
      };
    case "embed":
      return { id: newBlockId("embed"), type: "embed", url: "" };
    case "spacer":
      return { id: newBlockId("sp"), type: "spacer", size: "md" };
  }
}

export function migrateGalleryToBlocks(item: PortfolioItem): DesignBlock[] {
  const blocks: DesignBlock[] = [];

  if (item.overview?.trim()) {
    blocks.push({
      id: newBlockId("intro"),
      type: "text",
      content: item.overview,
      align: "left",
      color: "rgba(255,255,255,0.92)",
      fontSize: "lg",
    });
  }

  const urls = item.gallery?.length ? item.gallery : [item.image];
  const seen = new Set<string>();

  for (const src of urls) {
    if (!src || seen.has(src)) continue;
    seen.add(src);
    blocks.push({
      id: newBlockId("img"),
      type: "image",
      src,
      alt: item.title,
    });
  }

  return blocks;
}

export function ensurePortfolioBlocks(item: PortfolioItem): PortfolioItem {
  const blocks =
    item.blocks?.length ? item.blocks : migrateGalleryToBlocks(item);

  return {
    ...item,
    blocks,
    gallery: item.gallery?.length
      ? item.gallery
      : blocks
          .filter((b): b is DesignImageBlock => b.type === "image" && !!b.src)
          .map((b) => b.src),
  };
}

export { getEmbedIframeSrc, isCompactEmbed, parseEmbedUrl } from "@/lib/embed-url";

const IMAGE_MAX_WIDTH = 1920;
const IMAGE_JPEG_QUALITY = 0.82;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function compressDataUrl(dataUrl: string, maxWidth: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      try {
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => reject(new Error("Image decode failed"));
    img.src = dataUrl;
  });
}

export async function readImageFile(file: File): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file);
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") {
    return dataUrl;
  }
  try {
    return await compressDataUrl(dataUrl, IMAGE_MAX_WIDTH, IMAGE_JPEG_QUALITY);
  } catch {
    return dataUrl;
  }
}

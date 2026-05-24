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
        color: "#ffffff",
        fontSize: "md",
      };
    case "split":
      return {
        id: newBlockId("split"),
        type: "split",
        layout: "text-left",
        text: "",
        textColor: "#ffffff",
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

export function getEmbedIframeSrc(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const yt = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/i);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  if (/^https?:\/\//i.test(trimmed) && (trimmed.includes("embed") || trimmed.includes("player"))) {
    return trimmed;
  }

  return null;
}

export async function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

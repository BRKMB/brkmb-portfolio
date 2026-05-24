"use client";

import Image from "next/image";
import type { DesignBlock, TextAlign } from "@/types/design-blocks";
import { getEmbedIframeSrc, isCompactEmbed, readImageFile } from "@/lib/portfolio-blocks";
import { cn } from "@/lib/utils";
type Props = {
  block: DesignBlock;
  onChange: (block: DesignBlock) => void;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-caption mb-1 block v-tertiary">{children}</span>;
}

async function onImagePick(cb: (src: string) => void, file?: File | null) {
  if (!file) return;
  const src = await readImageFile(file);
  cb(src);
}

export function DesignBlockEditor({ block, onChange }: Props) {
  switch (block.type) {
    case "image":
      return (
        <div className="space-y-3">
          <div className="admin-thumb-frame admin-thumb-frame--wide">
            {block.src ? (
              <Image src={block.src} alt="" fill className="object-cover" unoptimized={block.src.startsWith("data:")} />
            ) : (
              <span className="text-footnote v-quaternary">Full-width image</span>
            )}
          </div>
          <label className="block">
            <FieldLabel>Image URL</FieldLabel>
            <input
              className="admin-input w-full"
              value={block.src}
              onChange={(e) => onChange({ ...block, src: e.target.value })}
            />
          </label>
          <label className="block">
            <FieldLabel>Upload</FieldLabel>
            <input
              type="file"
              accept="image/*"
              className="text-footnote w-full"
              onChange={(e) => onImagePick((src) => onChange({ ...block, src }), e.target.files?.[0])}
            />
          </label>
          <input
            className="admin-input w-full"
            value={block.caption ?? ""}
            placeholder="Caption (optional)"
            onChange={(e) => onChange({ ...block, caption: e.target.value })}
          />
        </div>
      );

    case "text":
      return (
        <div className="space-y-3">
          <label className="block">
            <FieldLabel>Text</FieldLabel>
            <textarea
              className="admin-input min-h-[120px] w-full"
              value={block.content}
              onChange={(e) => onChange({ ...block, content: e.target.value })}
              placeholder="Write your story, process, or captions…"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block">
              <FieldLabel>Color</FieldLabel>
              <input
                type="color"
                className="h-10 w-full cursor-pointer rounded-lg border border-white/10 bg-transparent"
                value={
                  block.color?.startsWith("#")
                    ? block.color
                    : block.color?.includes("255,255,255")
                      ? "#ffffff"
                      : "#191919"
                }
                onChange={(e) => onChange({ ...block, color: e.target.value })}
              />
            </label>
            <label className="block">
              <FieldLabel>Align</FieldLabel>
              <select
                className="admin-input w-full"
                value={block.align ?? "left"}
                onChange={(e) => onChange({ ...block, align: e.target.value as TextAlign })}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </label>
            <label className="block">
              <FieldLabel>Size</FieldLabel>
              <select
                className="admin-input w-full"
                value={block.fontSize ?? "md"}
                onChange={(e) =>
                  onChange({
                    ...block,
                    fontSize: e.target.value as "sm" | "md" | "lg",
                  })
                }
              >
                <option value="sm">Small</option>
                <option value="md">Body</option>
                <option value="lg">Large</option>
              </select>
            </label>
          </div>
        </div>
      );

    case "grid":
      return (
        <div className="space-y-3">
          <label className="block">
            <FieldLabel>Columns</FieldLabel>
            <select
              className="admin-input w-full"
              value={block.columns ?? 2}
              onChange={(e) =>
                onChange({ ...block, columns: Number(e.target.value) as 2 | 3 })
              }
            >
              <option value={2}>2 columns</option>
              <option value={3}>3 columns</option>
            </select>
          </label>
          <label className="block">
            <FieldLabel>Image URLs (one per line)</FieldLabel>
            <textarea
              className="admin-input min-h-[100px] w-full font-mono text-xs"
              value={block.images.join("\n")}
              onChange={(e) =>
                onChange({
                  ...block,
                  images: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="https://…"
            />
          </label>
          <label className="block">
            <FieldLabel>Upload multiple</FieldLabel>
            <input
              type="file"
              accept="image/*"
              multiple
              className="text-footnote w-full"
              onChange={async (e) => {
                const files = [...(e.target.files ?? [])];
                if (!files.length) return;
                const added: string[] = [];
                for (const file of files) {
                  added.push(await readImageFile(file));
                }
                onChange({ ...block, images: [...block.images, ...added] });
              }}
            />
          </label>
        </div>
      );

    case "split":
      return (
        <div className="space-y-3">
          <label className="block">
            <FieldLabel>Layout</FieldLabel>
            <select
              className="admin-input w-full"
              value={block.layout}
              onChange={(e) =>
                onChange({
                  ...block,
                  layout: e.target.value as "text-left" | "text-right",
                })
              }
            >
              <option value="text-left">Text left · Image right</option>
              <option value="text-right">Image left · Text right</option>
            </select>
          </label>
          <label className="block">
            <FieldLabel>Text column</FieldLabel>
            <textarea
              className="admin-input min-h-[100px] w-full"
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <FieldLabel>Text color</FieldLabel>
              <input
                type="color"
                className="h-10 w-full cursor-pointer rounded-lg border border-white/10 bg-transparent"
                value={
                  block.textColor?.startsWith("#")
                    ? block.textColor
                    : block.textColor?.includes("255,255,255")
                      ? "#ffffff"
                      : "#191919"
                }
                onChange={(e) => onChange({ ...block, textColor: e.target.value })}
              />
            </label>
            <label className="block">
              <FieldLabel>Text align</FieldLabel>
              <select
                className="admin-input w-full"
                value={block.textAlign ?? "left"}
                onChange={(e) =>
                  onChange({
                    ...block,
                    textAlign: e.target.value as "left" | "center" | "right",
                  })
                }
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </label>
          </div>
          <div className="admin-thumb-frame admin-thumb-frame--split">
            {block.image ? (
              <Image src={block.image} alt="" fill className="object-cover" unoptimized={block.image.startsWith("data:")} />
            ) : (
              <span className="text-footnote v-quaternary">Image column</span>
            )}
          </div>
          <input
            className="admin-input w-full"
            value={block.image}
            placeholder="Image URL"
            onChange={(e) => onChange({ ...block, image: e.target.value })}
          />
          <label className="block">
            <FieldLabel>Upload image</FieldLabel>
            <input
              type="file"
              accept="image/*"
              className="text-footnote w-full"
              onChange={(e) => onImagePick((src) => onChange({ ...block, image: src }), e.target.files?.[0])}
            />
          </label>
        </div>
      );

    case "embed": {
      const embedSrc = getEmbedIframeSrc(block.url);
      const compact = isCompactEmbed(block.url);
      return (
        <div className="space-y-3">
          <label className="block">
            <FieldLabel>Link or embed URL</FieldLabel>
            <input
              className="admin-input w-full"
              value={block.url}
              placeholder="https://www.youtube.com/watch?v=…"
              onChange={(e) => onChange({ ...block, url: e.target.value })}
            />
          </label>
          <p className="text-caption leading-relaxed v-tertiary">
            Works with YouTube, Vimeo, Spotify, SoundCloud, Loom, Figma, CodePen, Dailymotion — or paste
            an iframe embed code. No paid Adobe / 3D hosts.
          </p>
          {embedSrc ? (
            <div
              className={cn(
                "relative w-full overflow-hidden rounded-lg border border-white/10 bg-black/40",
                compact ? "h-[152px]" : "aspect-video"
              )}
            >
              <iframe
                src={embedSrc}
                title="Preview"
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : block.url.trim() ? (
            <p className="text-footnote text-amber-400/90">
              Could not read this URL — try the share / embed link from the platform.
            </p>
          ) : null}
          <input
            className="admin-input w-full"
            value={block.caption ?? ""}
            placeholder="Caption (optional)"
            onChange={(e) => onChange({ ...block, caption: e.target.value })}
          />
        </div>
      );
    }

    case "spacer":
      return (
        <label className="block">
          <FieldLabel>Vertical space</FieldLabel>
          <select
            className="admin-input w-full"
            value={block.size ?? "md"}
            onChange={(e) => onChange({ ...block, size: e.target.value as "sm" | "md" | "lg" })}
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>
      );

    default:
      return null;
  }
}

export { BLOCK_TYPE_LABELS } from "@/lib/design-studio-tiles";

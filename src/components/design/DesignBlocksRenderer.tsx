"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import type { DesignBlock } from "@/types/design-blocks";
import { getEmbedIframeSrc, isCompactEmbed } from "@/lib/portfolio-blocks";
import { cn } from "@/lib/utils";

function studioReadableColor(color?: string): string {
  if (!color) return "#191919";
  const c = color.toLowerCase().replace(/\s/g, "");
  if (
    c === "#fff" ||
    c === "#ffffff" ||
    c.startsWith("rgba(255,255,255") ||
    c.startsWith("rgb(255,255,255")
  ) {
    return "#191919";
  }
  return color;
}

function BlockPlaceholder({
  label,
  hint,
  className,
}: {
  label: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "behance-studio-placeholder flex flex-col items-center justify-center border-2 border-dashed border-[#c8c8c8] bg-[#fafafa] text-center",
        className
      )}
    >
      <span className="text-sm font-medium text-[#444]">{label}</span>
      {hint ? <span className="mt-1 max-w-[280px] text-xs text-[#888]">{hint}</span> : null}
    </div>
  );
}

function TextBlockView({
  content,
  href,
  align,
  color,
  fontSize,
  studio,
}: {
  content: string;
  href?: string;
  align?: string;
  color?: string;
  fontSize?: string;
  studio?: boolean;
}) {
  const sizeClass =
    fontSize === "lg"
      ? "text-[1.125rem] md:text-[1.25rem] leading-relaxed"
      : fontSize === "sm"
        ? "text-footnote leading-relaxed"
        : "text-body leading-relaxed";

  const resolvedColor = studio ? studioReadableColor(color) : color || "rgba(255,255,255,0.88)";

  const body = content || (studio ? "Your text will appear here…" : "");

  return (
    <div
      className={cn("behance-text-block whitespace-pre-wrap", sizeClass)}
      style={{
        color: resolvedColor,
        textAlign: (align as CSSProperties["textAlign"]) || "left",
      }}
    >
      {href && body ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
          {body}
        </a>
      ) : (
        body
      )}
    </div>
  );
}

function BlockView({ block, studio }: { block: DesignBlock; studio?: boolean }) {
  if (!studio && block.hidden) return null;

  switch (block.type) {
    case "image":
      if (!block.src) {
        if (!studio) return null;
        return (
          <BlockPlaceholder
            label="Image"
            hint="Upload or paste an image URL in the sidebar"
            className="aspect-[16/10] w-full"
          />
        );
      }
      return (
        <figure className="behance-project__frame">
          <div className="relative w-full overflow-hidden bg-black/30">
            <Image
              src={block.src}
              alt={block.alt || ""}
              width={1600}
              height={1000}
              className="h-auto w-full object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
              unoptimized={block.src.startsWith("data:")}
            />
          </div>
          {block.caption ? (
            <figcaption
              className={cn("text-footnote mt-3", studio ? "text-[#666]" : "v-tertiary")}
            >
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );

    case "text":
      if (!studio && !block.content.trim()) return null;
      return (
        <div className="behance-project__text-wrap mx-auto max-w-[720px] px-0 md:px-0">
          <TextBlockView
            content={block.content}
            href={block.href}
            align={block.align}
            color={block.color}
            fontSize={block.fontSize}
            studio={studio}
          />
        </div>
      );

    case "grid": {
      const imgs = block.images.filter(Boolean);
      if (!imgs.length) {
        if (!studio) return null;
        const cols = block.columns ?? 2;
        return (
          <div
            className={cn(
              "grid gap-2",
              cols === 3 ? "grid-cols-3" : "grid-cols-2"
            )}
          >
            {Array.from({ length: cols === 3 ? 3 : 2 }).map((_, i) => (
              <BlockPlaceholder
                key={i}
                label="Photo"
                hint="Add images in the sidebar"
                className="aspect-[4/3]"
              />
            ))}
          </div>
        );
      }
      const cols = block.columns ?? 2;
      return (
        <div
          className={cn(
            "behance-grid-block grid gap-2 md:gap-3",
            cols === 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2"
          )}
        >
          {imgs.map((src, i) => (
            <div key={`${src}-${i}`} className="relative aspect-[4/3] overflow-hidden bg-black/20">
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes={cols === 3 ? "33vw" : "50vw"}
                unoptimized={src.startsWith("data:")}
              />
            </div>
          ))}
        </div>
      );
    }

    case "split": {
      const textFirst = block.layout === "text-left";
      const textCol = (
        <div
          className={cn(
            "behance-split__text flex flex-col justify-center p-4 md:p-6",
            !textFirst && "md:order-2"
          )}
        >
          {block.text.trim() || studio ? (
            <TextBlockView
              content={block.text}
              align={block.textAlign}
              color={block.textColor}
              fontSize="md"
              studio={studio}
            />
          ) : null}
        </div>
      );
      const mediaCol = (
        <div
          className={cn(
            "behance-split__media relative min-h-[200px] overflow-hidden bg-black/30",
            !textFirst && "md:order-1"
          )}
        >
          {block.image ? (
            <Image
              src={block.image}
              alt={block.alt || ""}
              width={1200}
              height={900}
              className="h-auto w-full object-cover"
              sizes="(max-width: 600px) 100vw, 50vw"
              unoptimized={block.image.startsWith("data:")}
            />
          ) : studio ? (
            <BlockPlaceholder label="Image" className="aspect-[4/3] h-full min-h-[200px]" />
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center text-footnote v-quaternary">
              Image
            </div>
          )}
        </div>
      );
      return (
        <div className={cn("behance-split", block.layout === "text-right" && "behance-split--text-right")}>
          {textCol}
          {mediaCol}
        </div>
      );
    }

    case "embed": {
      const src = getEmbedIframeSrc(block.url);
      if (!src) {
        if (!studio) return null;
        return (
          <BlockPlaceholder
            label="Video or embed"
            hint="YouTube, Vimeo, Spotify, SoundCloud, Loom, Figma, CodePen…"
            className="aspect-video w-full"
          />
        );
      }
      const compact = isCompactEmbed(block.url);
      return (
        <figure className="behance-embed">
          <div
            className={cn(
              "relative w-full overflow-hidden bg-black/40",
              compact ? "h-[152px] md:h-[232px]" : "aspect-video"
            )}
          >
            <iframe
              src={src}
              title={block.caption || "Embedded media"}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {block.caption ? (
            <figcaption
              className={cn("text-footnote mt-3", studio ? "text-[#666]" : "v-tertiary")}
            >
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }

    case "spacer":
      return (
        <div
          className={cn(
            studio && "behance-studio-spacer border border-dashed border-[#ddd] bg-[#fafafa]",
            block.size === "sm" && (studio ? "h-8" : "h-6"),
            block.size === "lg" && (studio ? "h-24" : "h-20"),
            (!block.size || block.size === "md") && (studio ? "h-14" : "h-12")
          )}
          aria-hidden={!studio}
        >
          {studio ? (
            <span className="flex h-full items-center justify-center text-xs text-[#aaa]">Spacer</span>
          ) : null}
        </div>
      );

    default:
      return null;
  }
}

type Props = {
  blocks: DesignBlock[];
  /** Studio canvas: show placeholders for empty blocks */
  mode?: "publish" | "studio";
};

export function DesignBlocksRenderer({ blocks, mode = "publish" }: Props) {
  const studio = mode === "studio";
  const visible = studio ? blocks : blocks.filter((b) => !b.hidden);

  return (
    <div
      className={cn(
        "behance-project__gallery mx-auto max-w-[1200px] space-y-10 px-4 md:space-y-14 md:px-8",
        studio && "behance-project__gallery--studio !space-y-6 !px-0"
      )}
    >
      {visible.map((block) => (
        <div key={block.id} className={cn(studio && block.hidden && "opacity-40")}>
          <BlockView block={block} studio={studio} />
        </div>
      ))}
    </div>
  );
}

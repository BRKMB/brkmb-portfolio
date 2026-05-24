"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import type { DesignBlock } from "@/types/design-blocks";
import { getEmbedIframeSrc } from "@/lib/portfolio-blocks";
import { cn } from "@/lib/utils";

function TextBlockView({
  content,
  align,
  color,
  fontSize,
}: {
  content: string;
  align?: string;
  color?: string;
  fontSize?: string;
}) {
  const sizeClass =
    fontSize === "lg"
      ? "text-[1.125rem] md:text-[1.25rem] leading-relaxed"
      : fontSize === "sm"
        ? "text-footnote leading-relaxed"
        : "text-body leading-relaxed";

  return (
    <div
      className={cn("behance-text-block whitespace-pre-wrap", sizeClass)}
      style={{
        color: color || "rgba(255,255,255,0.88)",
        textAlign: (align as CSSProperties["textAlign"]) || "left",
      }}
    >
      {content}
    </div>
  );
}

function BlockView({ block }: { block: DesignBlock }) {
  if (block.hidden) return null;

  switch (block.type) {
    case "image":
      if (!block.src) return null;
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
            />
          </div>
          {block.caption ? (
            <figcaption className="text-footnote mt-3 v-tertiary">{block.caption}</figcaption>
          ) : null}
        </figure>
      );

    case "text":
      if (!block.content.trim()) return null;
      return (
        <div className="behance-project__text-wrap mx-auto max-w-[720px] px-0 md:px-0">
          <TextBlockView
            content={block.content}
            align={block.align}
            color={block.color}
            fontSize={block.fontSize}
          />
        </div>
      );

    case "split": {
      const textFirst = block.layout === "text-left";
      const textCol = (
        <div className={cn("behance-split__text flex flex-col justify-center", !textFirst && "md:order-2")}>
          {block.text.trim() ? (
            <TextBlockView
              content={block.text}
              align={block.textAlign}
              color={block.textColor}
              fontSize="md"
            />
          ) : null}
        </div>
      );
      const mediaCol = (
        <div className={cn("behance-split__media relative min-h-[200px] overflow-hidden bg-black/30", !textFirst && "md:order-1")}>
          {block.image ? (
            <Image
              src={block.image}
              alt={block.alt || ""}
              width={1200}
              height={900}
              className="h-auto w-full object-cover"
              sizes="(max-width: 600px) 100vw, 50vw"
            />
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
      if (!src) return null;
      return (
        <figure className="behance-embed">
          <div className="relative aspect-video w-full overflow-hidden bg-black/40">
            <iframe
              src={src}
              title={block.caption || "Embedded media"}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {block.caption ? (
            <figcaption className="text-footnote mt-3 v-tertiary">{block.caption}</figcaption>
          ) : null}
        </figure>
      );
    }

    case "spacer":
      return (
        <div
          className={cn(
            block.size === "sm" && "h-6",
            block.size === "lg" && "h-20",
            (!block.size || block.size === "md") && "h-12"
          )}
          aria-hidden
        />
      );

    default:
      return null;
  }
}

export function DesignBlocksRenderer({ blocks }: { blocks: DesignBlock[] }) {
  const visible = blocks.filter((b) => !b.hidden);

  return (
    <div className="behance-project__gallery mx-auto max-w-[1200px] space-y-10 px-4 md:space-y-14 md:px-8">
      {visible.map((block) => (
        <div key={block.id}>
          <BlockView block={block} />
        </div>
      ))}
    </div>
  );
}

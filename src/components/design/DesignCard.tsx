"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiEye, HiHeart, HiLink } from "react-icons/hi2";
import type { PortfolioItem } from "@/types";
import type { ProjectStats } from "@/lib/design-engagement/api";
import { projectPublicUrl } from "@/lib/design-engagement/api";

type Props = {
  item: PortfolioItem;
  stats?: ProjectStats;
};

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

export function DesignCard({ item, stats = { views: 0, likes: 0 } }: Props) {
  const [copied, setCopied] = useState(false);

  const copyLink = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = projectPublicUrl(item.slug);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <Link
      href={`/design/${item.slug}/`}
      data-cursor
      className="behance-card-v2 focus-ring block"
    >
      <div className="behance-card-v2__media relative overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 316px"
          className="object-cover"
        />
        <div className="behance-card-v2__gradient" aria-hidden />
        <button
          type="button"
          className="behance-card-v2__copy"
          aria-label={copied ? "Link copied" : "Copy project link"}
          title={copied ? "Copied!" : "Copy link"}
          onClick={copyLink}
        >
          <HiLink className="h-3.5 w-3.5" />
        </button>
        <div className="behance-card-v2__footer">
          <h2 className="behance-card-v2__title">{item.title}</h2>
          <div className="behance-card-v2__stats">
            <span className="behance-card-v2__stat">
              <HiHeart className="h-3.5 w-3.5" aria-hidden />
              {formatCount(stats.likes)}
            </span>
            <span className="behance-card-v2__stat">
              <HiEye className="h-3.5 w-3.5" aria-hidden />
              {formatCount(stats.views)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

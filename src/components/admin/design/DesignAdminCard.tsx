"use client";

import Link from "next/link";
import Image from "next/image";
import { HiCog6Tooth, HiEye, HiEyeSlash, HiHeart } from "react-icons/hi2";
import type { PortfolioItem } from "@/types";
import type { ProjectStats } from "@/lib/design-engagement/api";
import { cn } from "@/lib/utils";

type Props = {
  item: PortfolioItem;
  stats?: ProjectStats;
};

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

export function DesignAdminCard({ item, stats = { views: 0, likes: 0 } }: Props) {
  const hidden = item.hidden === true;
  const editHref = `/admin/design/${item.slug}/`;

  return (
    <div className={cn("behance-card-v2 group relative block", hidden && "opacity-70")}>
      <Link href={editHref} data-cursor className="focus-ring block">
        <div className="behance-card-v2__media relative overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 316px"
            className="object-cover"
          />
          <div className="behance-card-v2__gradient" aria-hidden />
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
      <Link
        href={editHref}
        className="behance-card-v2__copy"
        aria-label="Edit project"
        title="Edit project"
        onClick={(e) => e.stopPropagation()}
      >
        <HiCog6Tooth className="h-4 w-4" />
      </Link>
      {hidden ? (
        <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white/90">
          <HiEyeSlash className="h-3 w-3" />
          Hidden
        </span>
      ) : null}
    </div>
  );
}

"use client";

import { useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiCheck, HiEye, HiHeart, HiLink } from "react-icons/hi2";
import type { PortfolioItem } from "@/types";
import { formatBehancePublishedDate } from "@/lib/behance-dates";
import { copyTextSync } from "@/lib/copy-to-clipboard";
import { notifyLinkCopied } from "@/lib/link-copied-toast";
import type { ProjectStats } from "@/lib/portfolio-engagement";
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
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyLink = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const url = projectPublicUrl(item.slug);
    const ok = copyTextSync(url);

    if (!ok) {
      void navigator.clipboard?.writeText(url).then(finishCopy).catch(() => undefined);
      return;
    }

    finishCopy();
  };

  const finishCopy = () => {
    setCopied(true);
    notifyLinkCopied();
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 2200);
  };

  return (
    <article className="behance-card-v2 focus-ring">
      <Link href={`/designs/${item.slug}/`} data-cursor className="behance-card-v2__link block">
        <div className="behance-card-v2__media relative overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 560px) 100vw, (max-width: 1024px) 50vw, 316px"
            className="object-cover"
          />
          <div className="behance-card-v2__gradient" aria-hidden />
          <div className="behance-card-v2__footer">
            <div>
              <h2 className="behance-card-v2__title">{item.title}</h2>
              {item.publishedOn ? (
                <p className="behance-card-v2__date">
                  {formatBehancePublishedDate(item.publishedOn)}
                </p>
              ) : null}
            </div>
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
      <button
        type="button"
        className={`behance-card-v2__copy${copied ? " behance-card-v2__copy--done" : ""}`}
        aria-label={copied ? "Link copied" : "Copy project link"}
        onClick={copyLink}
      >
        {copied ? <HiCheck className="h-3.5 w-3.5" aria-hidden /> : <HiLink className="h-3.5 w-3.5" aria-hidden />}
      </button>
    </article>
  );
}

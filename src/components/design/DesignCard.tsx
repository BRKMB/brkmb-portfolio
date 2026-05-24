import Link from "next/link";
import Image from "next/image";
import type { PortfolioItem } from "@/types";

export function DesignCard({ item }: { item: PortfolioItem }) {
  return (
    <Link
      href={`/design/${item.slug}/`}
      data-cursor
      className="behance-card focus-ring group block"
    >
      <div className="behance-card__cover relative overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="behance-card__shade absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100" />
      </div>
      <div className="behance-card__meta">
        <h2 className="behance-card__title">{item.title}</h2>
        <p className="behance-card__category">{item.category}</p>
      </div>
    </Link>
  );
}

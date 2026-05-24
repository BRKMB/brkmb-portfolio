import type { PortfolioItem } from "@/types";

/** Behance-style: "December 16th 2024" */
export function formatBehancePublishedDate(unixSeconds: number): string {
  const d = new Date(unixSeconds * 1000);
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  const month = d.toLocaleString("en-US", { month: "long" });
  return `${month} ${day}${suffix} ${d.getFullYear()}`;
}

export function sortPortfolioNewestFirst(items: PortfolioItem[]): PortfolioItem[] {
  return [...items].sort((a, b) => {
    const ta = a.publishedOn ?? (a.year ? Number(a.year) * 1e10 : 0);
    const tb = b.publishedOn ?? (b.year ? Number(b.year) * 1e10 : 0);
    return tb - ta;
  });
}

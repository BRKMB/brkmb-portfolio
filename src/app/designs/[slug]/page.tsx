import { notFound } from "next/navigation";
import { getAllPortfolioSlugs, getPortfolioBySlug } from "@/lib/portfolio";
import { DesignDetail } from "@/components/design/DesignDetail";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPortfolioSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = getPortfolioBySlug(slug);
  if (!item) return { title: "Not Found" };
  return {
    title: `${item.title} | Design — Baher Magally`,
    description: item.description ?? item.overview,
  };
}

export default async function DesignProjectPage({ params }: Props) {
  const { slug } = await params;
  if (!getPortfolioBySlug(slug)) notFound();
  return <DesignDetail slug={slug} />;
}

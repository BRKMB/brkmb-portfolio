import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design Work | Baher Magally",
  description: "Brand identity, UI, posters, packaging, and motion — graphic design portfolio.",
};

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return children;
}

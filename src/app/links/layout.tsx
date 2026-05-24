import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links | Baher Magally",
  description: "All my profiles, socials, and contact links in one place.",
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return children;
}

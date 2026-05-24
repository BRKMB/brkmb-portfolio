import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Baher Magally",
  description: "Ventures I founded and built — BARYQ, BENOU, BlinkOTP, RABY.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

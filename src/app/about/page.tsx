import type { Metadata } from "next";
import { About } from "@/components/sections/About";

export const metadata: Metadata = {
  title: "About | Baher Magally",
  description: "Founder, product builder, and graphic designer — story, process, and roles.",
};

export default function AboutPage() {
  return (
    <div className="pt-8">
      <About />
    </div>
  );
}

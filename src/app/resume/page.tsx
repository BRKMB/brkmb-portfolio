import type { Metadata } from "next";
import { ResumePageContent } from "@/components/resume/ResumePageContent";

export const metadata: Metadata = {
  title: "Resume & About | Baher Magally",
  description:
    "Background, experience, skills, and certifications — graphic design, print production, and ventures built end to end.",
};

export default function ResumePage() {
  return <ResumePageContent />;
}

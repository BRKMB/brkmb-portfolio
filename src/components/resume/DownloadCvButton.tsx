"use client";

import { pdf } from "@react-pdf/renderer";
import { CvDocument } from "./CvDocument";
import type { ResumeData } from "@/types";
import { site } from "@/lib/data";

type Props = {
  resume: ResumeData;
  className?: string;
};

export function DownloadCvButton({ resume, className }: Props) {
  const download = async () => {
    const blob = await pdf(<CvDocument resume={resume} siteName={site.name} email={site.email} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Baher-Magally-CV.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button type="button" onClick={download} data-cursor className={className}>
      Download CV (PDF)
    </button>
  );
}

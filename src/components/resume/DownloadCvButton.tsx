"use client";

import { pdf } from "@react-pdf/renderer";
import { CvDocument } from "./CvDocument";
import type { ResumeData } from "@/types";
import { site } from "@/lib/data";
import { buildCvFilename } from "@/lib/cv-generation";

type Props = {
  resume: ResumeData;
  className?: string;
};

export function DownloadCvButton({ resume, className }: Props) {
  const download = async () => {
    const generatedAt = new Date();
    const blob = await pdf(
      <CvDocument
        resume={resume}
        siteName={site.name}
        email={site.email}
        generatedAt={generatedAt}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = buildCvFilename(site.name, generatedAt);
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button type="button" onClick={download} data-cursor className={className}>
      Download CV (PDF)
    </button>
  );
}

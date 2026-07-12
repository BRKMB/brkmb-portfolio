"use client";

import { createRoot } from "react-dom/client";
import type { ResumeData } from "@/types";
import { site } from "@/lib/data";
import { buildCvFilename, buildCvGenerationFooter } from "@/lib/cv-generation";
import { generateCvPdfFromHtml } from "@/lib/generate-cv-pdf";
import { CvHtmlDocument } from "./CvHtmlDocument";

type Props = {
  resume: ResumeData;
  className?: string;
};

export function DownloadCvButton({ resume, className }: Props) {
  const download = async () => {
    const generatedAt = new Date();
    const websiteLabel = (resume.website ?? "brkmb.com").replace(/^https?:\/\//i, "").replace(/\/$/, "");
    const filename = buildCvFilename(site.name, generatedAt);
    const generationFooter = buildCvGenerationFooter(generatedAt, websiteLabel);

    const host = document.createElement("div");
    host.style.cssText =
      "position:fixed;left:-10000px;top:0;width:794px;background:#ffffff;z-index:-1";
    document.body.appendChild(host);

    const root = createRoot(host);
    root.render(
      <CvHtmlDocument
        resume={resume}
        siteName={site.name}
        email={resume.cvEmail ?? site.email}
        generatedAt={generatedAt}
      />
    );

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    const cvElement = host.firstElementChild as HTMLElement | null;
    if (!cvElement) {
      root.unmount();
      host.remove();
      return;
    }

    await generateCvPdfFromHtml(cvElement, { filename, generationFooter });

    root.unmount();
    host.remove();
  };

  return (
    <button type="button" onClick={download} data-cursor className={className}>
      Download CV (PDF)
    </button>
  );
}

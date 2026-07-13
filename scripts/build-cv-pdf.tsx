/**
 * Build-time CV PDF for a permanent public URL (no signed/expiring links).
 * Run: npm run build:cv
 */
import React from "react";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pdf } from "@react-pdf/renderer";
import { CvDocument } from "../src/components/resume/CvDocument";
import { CV_PDF_PUBLIC_FILE } from "../src/lib/cv-generation";
import resume from "../src/data/resume.json";
import site from "../src/data/site.json";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const generatedAt = new Date();
  const outPath = path.join(__dirname, "../public", CV_PDF_PUBLIC_FILE);

  const blob = await pdf(
    <CvDocument
      resume={resume}
      siteName={site.name}
      email={resume.cvEmail ?? site.email}
      generatedAt={generatedAt}
    />
  ).toBlob();

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, Buffer.from(await blob.arrayBuffer()));

  const kb = Math.round(fs.statSync(outPath).size / 1024);
  console.log(`CV PDF → public/${CV_PDF_PUBLIC_FILE} (${kb} KB)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Builds public/cv/cv-template.docx from the reference Word CV with docxtemplater tags.
 * Run after updating the source docx at scripts/cv-reference.docx
 */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import PizZip from "pizzip";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "scripts/cv-reference.docx");
const outDir = join(root, "public/cv");
const outFile = join(outDir, "cv-template.docx");

mkdirSync(outDir, { recursive: true });
copyFileSync(source, outFile);

const zip = new PizZip(readFileSync(outFile));
let xml = zip.file("word/document.xml").asText();

const replacements = [
  ["BAHER MAGALLY", "{name}"],
  [
    "Graphic Designer  ·  Print Production, Prepress &amp; Color Quality Consistency  ·  Brand Identity",
    "{title}",
  ],
  ["Warsaw, Poland   |   +48 573 707 027   |   hi@brkmb.com   |   brkmb.com   |   linkedin.com/in/baher-bottros", "{contactLine}"],
  [
    "Graphic Designer with production-focused experience across Brand Identity, Artwork Preparation, Color Management, and Visual Quality Assurance. Skilled in preparing and preflighting print-ready files using CMYK color workflows, bleed, crop marks, and high-resolution print specifications for commercial print. Built BARYQ end-to-end — from brand strategy through production-ready artwork, packaging concepts, and multi-channel marketing assets — maintaining strict brand guideline compliance across every touchpoint. Currently applies structured visual QA discipline at Lionbridge, ensuring layout accuracy, typography consistency, and defect-free output across multilingual digital products. Strong track record of cross-functional collaboration, problem-solving, and translating design intent into production-ready output.",
    "{summary}",
  ],
];

for (const [from, to] of replacements) {
  if (!xml.includes(from)) {
    console.warn("Missing expected fragment:", from.slice(0, 60));
  }
  xml = xml.split(from).join(to);
}

// Competencies block → loop placeholder (single paragraph per line in template data)
const compStart = "Production-Ready Artwork   ·   Artwork Preparation";
const compEnd = "Adobe InDesign   ·   Figma";
const compIdxStart = xml.indexOf(compStart);
const compIdxEnd = xml.indexOf(compEnd);
if (compIdxStart !== -1 && compIdxEnd !== -1) {
  const compEndLen = compEnd.length;
  const before = xml.slice(0, compIdxStart);
  const after = xml.slice(compIdxEnd + compEndLen);
  xml = `${before}{#competencies}{.}{/competencies}${after}`;
}

// Experience: replace first job header through last freelance bullet with loop
const expMarkerStart = "Visual QA &amp; Localization Specialist  ·  Lionbridge  ·  Warsaw, Poland";
const expMarkerEnd =
  "Managed client communication from creative brief through final delivery, adapting design intent to technical and print requirements — a workflow directly applicable to brand-to-printer production pipelines.";
const expStart = xml.indexOf(expMarkerStart);
const expEnd = xml.indexOf(expMarkerEnd);
if (expStart !== -1 && expEnd !== -1) {
  const before = xml.slice(0, expStart);
  const after = xml.slice(expEnd + expMarkerEnd.length);
  const loop = `{#experience}{header}{#bullets}{.}{/bullets}{/experience}`;
  xml = before + loop + after;
}

// Education
xml = xml.replace(
  "Bachelor of Graphic Design\tMarch 2025",
  "{degree}\t{graduated}"
);
xml = xml.replace(
  "Vistula University, Warsaw, Poland   ·   GPA: 4.02 / 5.0",
  "{schoolLine}"
);

// Certifications (3 in reference — loop supports more)
const certStart = "Fundamentals of Graphic Design — California Institute of the Arts (Coursera)";
const certEnd = "Digital Marketing — Accenture · FutureLearn (2021)";
const cStart = xml.indexOf(certStart);
const cEnd = xml.indexOf(certEnd);
if (cStart !== -1 && cEnd !== -1) {
  xml =
    xml.slice(0, cStart) +
    "{#certifications}{.}{/certifications}" +
    xml.slice(cEnd + certEnd.length);
}

// Tools
xml = xml.replace(
  "Design &amp; Production:  Adobe Creative Suite  ·  Adobe Illustrator  ·  Adobe Photoshop  ·  Adobe InDesign  ·  Adobe Premiere  ·  Adobe XD  ·  Figma",
  "{toolsDesign}"
);
xml = xml.replace(
  "QA &amp; Collaboration:  Jira  ·  Microsoft Office  ·  Structured Defect Reporting Workflows",
  "{toolsQa}"
);

// Languages
xml = xml.replace(
  "Arabic (Native)   ·   English (Advanced)   ·   Polish (Basic)",
  "{languagesLine}"
);

// Portfolio note
xml = xml.replace(
  "Portfolio available at  brkmb.com  — Brand Identity · Graphic Production · UI/UX · Packaging Concepts · Commercial Projects",
  "{portfolioNote}"
);

zip.file("word/document.xml", xml);
writeFileSync(outFile, zip.generate({ type: "nodebuffer" }));
console.log("Wrote", outFile);

/**
 * Build public/cv/baher-magally-cv.pdf from the Word source (baher-magally-cv.docx).
 * macOS: Microsoft Word via AppleScript. Linux: LibreOffice if installed.
 * CI without a converter uses the committed PDF when the docx hash is unchanged.
 */
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const CV_PDF_PUBLIC_FILE = "cv/baher-magally-cv.pdf";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const cvDir = path.join(root, "public/cv");
const docxPath = path.join(cvDir, "baher-magally-cv.docx");
const pdfPath = path.join(root, "public", CV_PDF_PUBLIC_FILE);
const hashPath = path.join(cvDir, ".baher-magally-cv.docx.sha256");

function sha256(filePath) {
  return createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

async function convertWithWord(source, dest) {
  const destPosix = dest.replace(/\\/g, "/");
  const sourcePosix = source.replace(/\\/g, "/");
  const script = `set docPath to POSIX file "${sourcePosix}"
set pdfPath to POSIX file "${destPosix}"
tell application "Microsoft Word"
  open docPath
  save as active document file name pdfPath file format format PDF
  close active document saving no
end tell`;
  await execFileAsync("osascript", ["-e", script], { timeout: 180_000 });
}

async function convertWithLibreOffice(source, dest) {
  const outDir = path.dirname(dest);
  const bin =
    process.env.LIBREOFFICE_BIN ?? (await which("soffice")) ?? (await which("libreoffice"));
  if (!bin) throw new Error("LibreOffice not found");

  await execFileAsync(bin, ["--headless", "--convert-to", "pdf", "--outdir", outDir, source], {
    timeout: 120_000,
  });

  const produced = path.join(outDir, `${path.basename(source, ".docx")}.pdf`);
  if (produced !== dest && fs.existsSync(produced)) {
    fs.renameSync(produced, dest);
  }
}

async function which(cmd) {
  try {
    const { stdout } = await execFileAsync("which", [cmd]);
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

async function main() {
  if (!fs.existsSync(docxPath)) {
    throw new Error("Missing Word CV source: public/cv/baher-magally-cv.docx");
  }

  fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
  const docxHash = sha256(docxPath);
  const previousHash = fs.existsSync(hashPath) ? fs.readFileSync(hashPath, "utf8").trim() : "";
  const pdfExists = fs.existsSync(pdfPath);

  if (pdfExists && docxHash === previousHash) {
    const kb = Math.round(fs.statSync(pdfPath).size / 1024);
    console.log(`CV PDF up to date → public/${CV_PDF_PUBLIC_FILE} (${kb} KB)`);
    return;
  }

  let converted = false;

  if (process.platform === "darwin" && fs.existsSync("/Applications/Microsoft Word.app")) {
    console.log("Converting Word CV → PDF (Microsoft Word)…");
    await convertWithWord(docxPath, pdfPath);
    converted = true;
  } else if ((await which("soffice")) || (await which("libreoffice"))) {
    console.log("Converting Word CV → PDF (LibreOffice)…");
    await convertWithLibreOffice(docxPath, pdfPath);
    converted = true;
  }

  if (!converted) {
    if (pdfExists) {
      console.warn(
        "No Word/LibreOffice converter — using committed PDF. Run `npm run build:cv` on macOS after editing the .docx."
      );
      return;
    }
    throw new Error(
      "Cannot build CV PDF: install Microsoft Word (macOS) or LibreOffice, or commit public/cv/baher-magally-cv.pdf"
    );
  }

  if (!fs.existsSync(pdfPath)) {
    throw new Error(`Conversion finished but PDF not found at ${pdfPath}`);
  }

  fs.writeFileSync(hashPath, `${docxHash}\n`);
  const kb = Math.round(fs.statSync(pdfPath).size / 1024);
  console.log(`CV PDF → public/${CV_PDF_PUBLIC_FILE} (${kb} KB)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

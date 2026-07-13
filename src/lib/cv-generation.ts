const SITE_URL = "brkmb.com";

/** Stable path on brkmb.com — regenerated on each deploy, never expires. */
export const CV_PDF_PUBLIC_FILE = "cv/baher-magally-cv.pdf";
export const CV_PDF_PATH = `/${CV_PDF_PUBLIC_FILE}`;
export const CV_PDF_URL = `https://${SITE_URL}${CV_PDF_PATH}`;

export function buildCvGenerationFooter(at: Date = new Date(), siteUrl = SITE_URL): string {
  const stamp = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(at);

  return `Auto-generated from ${siteUrl} · ${stamp}`;
}

export function buildCvFilename(siteName: string, at: Date = new Date()): string {
  const date = at.toISOString().slice(0, 10);
  const slug = siteName.trim().replace(/\s+/g, "-");
  return `${slug}-CV-${date}.pdf`;
}

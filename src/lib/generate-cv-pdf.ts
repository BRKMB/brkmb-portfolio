import html2pdf from "html2pdf.js";

type Options = {
  filename: string;
  generationFooter: string;
};

export async function generateCvPdfFromHtml(element: HTMLElement, options: Options) {
  const worker = html2pdf()
    .set({
      margin: 0.5,
      filename: options.filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: {
        mode: ["css", "legacy"],
        avoid: [".cv-bullet", ".cv-job-header", ".cv-cert-line", ".cv-section-heading"],
      },
    } as Record<string, unknown>)
    .from(element)
    .toPdf();

  const pdf = await worker.get("pdf");
  const totalPages = pdf.internal.getNumberOfPages();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (let page = 1; page <= totalPages; page += 1) {
    pdf.setPage(page);
    pdf.setFont("times", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(196, 196, 196);
    pdf.text(`Page ${page} of ${totalPages}`, pageWidth - 0.5, pageHeight - 0.35, {
      align: "right",
    });
    pdf.setFontSize(6);
    pdf.text(options.generationFooter, pageWidth / 2, pageHeight - 0.22, { align: "center" });
  }

  pdf.save(options.filename);
}

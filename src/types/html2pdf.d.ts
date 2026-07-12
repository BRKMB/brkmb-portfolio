declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: Record<string, unknown>;
    jsPDF?: Record<string, unknown>;
    pagebreak?: { mode?: string | string[] };
  }

  interface Html2PdfWorker {
    set(options: Html2PdfOptions): Html2PdfWorker;
    from(element: HTMLElement): Html2PdfWorker;
    toPdf(): Html2PdfWorker;
    get(key: "pdf"): Promise<{
      internal: {
        getNumberOfPages(): number;
        pageSize: { getWidth(): number; getHeight(): number };
      };
      setPage(page: number): void;
      setFont(font: string, style: string): void;
      setFontSize(size: number): void;
      setTextColor(r: number, g: number, b: number): void;
      text(text: string, x: number, y: number, options?: { align?: string }): void;
      save(filename: string): void;
    }>;
    save(): Promise<void>;
  }

  function html2pdf(): Html2PdfWorker;

  export default html2pdf;
}

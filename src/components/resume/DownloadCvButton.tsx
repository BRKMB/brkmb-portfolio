import { CV_PDF_PATH, CV_PDF_URL } from "@/lib/cv-generation";

type Props = {
  className?: string;
};

export function DownloadCvButton({ className }: Props) {
  return (
    <a
      href={CV_PDF_PATH}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor
      className={className}
      title={CV_PDF_URL}
    >
      View CV (PDF)
    </a>
  );
}

import { CV_PDF_PATH } from "@/lib/cv-generation";

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
    >
      View CV (PDF)
    </a>
  );
}

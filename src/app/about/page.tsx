import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Baher Magally",
  description: "Background, process, and practice — now part of the resume page.",
  alternates: { canonical: "/resume/" },
};

export default function AboutPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/resume/" />
      <script
        dangerouslySetInnerHTML={{
          __html: 'window.location.replace("/resume/");',
        }}
      />
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-5 pt-32 pb-24 text-center">
        <p className="text-body v-secondary">Redirecting to resume…</p>
        <Link href="/resume/" className="text-subheadline mt-4 text-accent hover:opacity-80">
          Continue →
        </Link>
      </div>
    </>
  );
}

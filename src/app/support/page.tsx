import type { Metadata } from "next";
import { Suspense } from "react";
import { SupportPageContent } from "@/components/support/SupportPageContent";

export const metadata: Metadata = {
  title: "Support — Baher Magally",
  description:
    "Optional one-time support for free tools and projects from Baher Magally.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen px-5 pt-32 pb-24 md:px-10">
      <div className="mx-auto w-full max-w-xl">
        <p className="text-caption tracking-[0.3em] uppercase text-accent">Support</p>
        <h1 className="font-display text-large-title mt-4 uppercase v-primary">
          Optional
        </h1>
        <p className="text-body mt-5 v-secondary leading-relaxed">
          Most of the products and projects here are free. If you want to help
          keep them that way, you can leave a one-time contribution — nothing
          more is expected.
        </p>

        <Suspense
          fallback={
            <div className="mt-14 h-40 rounded-2xl border border-subtle bg-[var(--surface-subtle)]" />
          }
        >
          <SupportPageContent />
        </Suspense>
      </div>
    </div>
  );
}

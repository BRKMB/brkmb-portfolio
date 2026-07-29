import type { Metadata } from "next";
import { Suspense } from "react";
import { SupportPageContent } from "@/components/support/SupportPageContent";

export const metadata: Metadata = {
  title: "Support — Baher Magally",
  description:
    "Support free tools and projects from Baher Magally — one-time, monthly, or yearly via Stripe.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen px-5 pt-32 pb-24 md:px-10">
      <div className="mx-auto w-full max-w-lg text-center">
        <p className="text-caption tracking-[0.3em] uppercase text-accent">
          Support
        </p>
        <h1 className="font-display text-large-title mt-4 uppercase v-primary">
          Support the work
        </h1>
        <p className="text-body mx-auto mt-5 max-w-md v-secondary leading-relaxed">
          Most products and projects here are free. A contribution — once,
          monthly, or yearly — helps keep them online and moving.
        </p>

        <Suspense
          fallback={
            <div className="mx-auto mt-12 h-48 rounded-2xl border border-subtle bg-[var(--surface-subtle)]" />
          }
        >
          <SupportPageContent />
        </Suspense>
      </div>
    </div>
  );
}

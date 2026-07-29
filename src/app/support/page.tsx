import type { Metadata } from "next";
import { Suspense } from "react";
import { SupportPageContent } from "@/components/support/SupportPageContent";

export const metadata: Metadata = {
  title: "Support — Baher Magally",
  description:
    "Support free tools and projects from Baher Magally. One-time tips via Stripe help keep BlinkOTP, Boostify, lnki.to, and more free for everyone.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen px-5 pt-32 pb-24 md:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <p className="text-caption tracking-[0.3em] uppercase text-accent">Support</p>
        <h1 className="font-display text-large-title mt-4 uppercase v-primary">
          Fuel the free work
        </h1>
        <p className="text-body md:text-lg mt-5 max-w-2xl v-secondary leading-relaxed">
          If a free tool from this site helped you, you can leave a one-time tip. Totally optional —
          always appreciated.
        </p>

        <Suspense
          fallback={
            <div className="mt-12 h-64 animate-pulse rounded-[24px] border border-subtle bg-[var(--surface-subtle)]" />
          }
        >
          <SupportPageContent />
        </Suspense>
      </div>
    </div>
  );
}

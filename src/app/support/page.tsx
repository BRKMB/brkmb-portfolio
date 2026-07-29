import type { Metadata } from "next";
import Image from "next/image";
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
      <div className="mx-auto w-full max-w-5xl">
        <div className="support-layout">
          <aside className="support-visual" aria-hidden>
            <div className="support-visual__frame">
              <Image
                src="/images/brand/baher-emblem.png"
                alt=""
                width={842}
                height={595}
                priority
                className="support-visual__emblem"
              />
            </div>
          </aside>

          <div className="support-copy">
            <p className="text-caption tracking-[0.3em] uppercase text-accent">
              Support
            </p>
            <h1 className="font-display text-large-title mt-4 uppercase v-primary">
              Support the work
            </h1>
            <p className="text-body mt-5 max-w-md v-secondary leading-relaxed">
              Most products and projects here are free. A contribution — once,
              monthly, or yearly — helps keep them online and moving.
            </p>

            <Suspense
              fallback={
                <div className="mt-12 h-48 rounded-2xl border border-subtle bg-[var(--surface-subtle)]" />
              }
            >
              <SupportPageContent />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const PRESETS = [100, 1000, 10000, 100000] as const;

type Cadence = "once" | "month" | "year";

const CADENCES: { id: Cadence; label: string }[] = [
  { id: "once", label: "Once" },
  { id: "month", label: "Monthly" },
  { id: "year", label: "Yearly" },
];

function formatUsd(cents: number) {
  if (cents >= 100000) return "$1,000";
  return `$${cents / 100}`;
}

function ctaLabel(cents: number, cadence: Cadence, loading: boolean) {
  if (loading) return "Opening Stripe…";
  const amount = formatUsd(cents);
  if (cadence === "month") return `Continue · ${amount}/mo`;
  if (cadence === "year") return `Continue · ${amount}/yr`;
  return `Continue · ${amount}`;
}

export function SupportPageContent() {
  const searchParams = useSearchParams();
  const thanks = searchParams.get("thanks") === "1";
  const cancelled = searchParams.get("cancelled") === "1";

  const [cadence, setCadence] = useState<Cadence>("once");
  const [selected, setSelected] = useState<number>(1000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/support/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amountCents: selected, cadence }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        url?: string;
        error?: string;
        message?: string;
      };

      if (!res.ok || !data.success || !data.url) {
        setError(
          data.message ||
            (data.error === "not-configured"
              ? "Payments aren’t ready yet — try again shortly."
              : "Couldn’t start checkout. Please try again.")
        );
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  if (thanks) {
    return (
      <div className="mt-12 border-t border-subtle pt-10">
        <p className="font-display text-title-2 v-primary">Thank you.</p>
        <p className="text-body mt-3 max-w-md v-secondary leading-relaxed">
          Appreciated — it goes toward keeping free tools online and shipping
          the next ones.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      {cancelled ? (
        <p className="text-subheadline mb-8 v-tertiary">
          Checkout cancelled. Nothing was charged.
        </p>
      ) : null}

      <p className="case-meta__label">Frequency</p>
      <div
        className="support-cadence mt-3"
        role="group"
        aria-label="Payment frequency"
      >
        {CADENCES.map((item) => {
          const active = cadence === item.id;
          return (
            <button
              key={item.id}
              type="button"
              data-cursor
              onClick={() => {
                setCadence(item.id);
                setError(null);
              }}
              className={cn(
                "support-cadence__btn focus-ring",
                active && "support-cadence__btn--active"
              )}
              aria-pressed={active}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <p className="case-meta__label mt-8">Amount</p>
      <div
        className="support-amounts mt-3"
        role="group"
        aria-label="Contribution amount"
      >
        {PRESETS.map((cents) => {
          const active = selected === cents;
          return (
            <button
              key={cents}
              type="button"
              data-cursor
              onClick={() => {
                setSelected(cents);
                setError(null);
              }}
              className={cn(
                "support-amount focus-ring",
                active && "support-amount--active"
              )}
              aria-pressed={active}
            >
              {formatUsd(cents)}
            </button>
          );
        })}
      </div>

      {error ? (
        <p
          className="text-subheadline mt-4 text-[color:var(--color-danger,#f87171)]"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <button
        type="button"
        data-cursor
        disabled={loading}
        onClick={startCheckout}
        className="btn-primary text-subheadline mt-8 inline-flex min-h-[44px] items-center justify-center rounded-full px-7 py-2.5 disabled:opacity-60"
      >
        {ctaLabel(selected, cadence, loading)}
      </button>

      <p className="text-footnote mt-6 max-w-sm v-quaternary leading-relaxed">
        {cadence === "once"
          ? "Processed by Stripe. One-time payment."
          : "Processed by Stripe. Recurring — cancel anytime from your Stripe receipt or by emailing me."}
      </p>
    </div>
  );
}

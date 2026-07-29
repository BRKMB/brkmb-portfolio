"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const PRESETS = [100, 1000, 10000, 100000] as const;
const MIN_CENTS = 100; // $1
const MAX_CENTS = 100000; // $1,000

type Cadence = "once" | "month" | "year";

const CADENCES: { id: Cadence; label: string }[] = [
  { id: "once", label: "Once" },
  { id: "month", label: "Monthly" },
  { id: "year", label: "Yearly" },
];

function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

function ctaLabel(cents: number | null, cadence: Cadence, loading: boolean) {
  if (loading) return "Opening Stripe…";
  if (cents == null) return "Continue";
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
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amountCents = useMemo(() => {
    if (custom.trim()) {
      const dollars = Number(custom);
      if (!Number.isFinite(dollars) || dollars <= 0) return null;
      return Math.round(dollars * 100);
    }
    return selected;
  }, [custom, selected]);

  const startCheckout = async () => {
    setError(null);
    if (
      amountCents == null ||
      amountCents < MIN_CENTS ||
      amountCents > MAX_CENTS
    ) {
      setError("Enter an amount between $1 and $1,000.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/support/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amountCents, cadence }),
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
      <div className="mx-auto mt-12 max-w-md border-t border-subtle pt-10">
        <p className="font-display text-title-2 v-primary">Thank you.</p>
        <p className="text-body mx-auto mt-3 max-w-md v-secondary leading-relaxed">
          Appreciated — it goes toward keeping free tools online and shipping
          the next ones.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-12 max-w-md">
      {cancelled ? (
        <p className="text-subheadline mb-8 v-tertiary">
          Checkout cancelled. Nothing was charged.
        </p>
      ) : null}

      <p className="case-meta__label">Frequency</p>
      <div
        className="support-cadence mx-auto mt-3"
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
          const active = !custom && selected === cents;
          return (
            <button
              key={cents}
              type="button"
              data-cursor
              onClick={() => {
                setCustom("");
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

      <label className="mt-5 block text-left">
        <span className="case-meta__label">Or enter your own</span>
        <div className="support-custom mt-3">
          <span className="support-custom__prefix" aria-hidden>
            $
          </span>
          <input
            type="number"
            min={1}
            max={1000}
            step="0.01"
            inputMode="decimal"
            placeholder="Custom amount"
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
              setError(null);
            }}
            className="support-custom__input"
          />
        </div>
      </label>

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
        className="btn-primary text-subheadline mx-auto mt-8 inline-flex min-h-[44px] items-center justify-center rounded-full px-7 py-2.5 disabled:opacity-60"
      >
        {ctaLabel(amountCents, cadence, loading)}
      </button>

      <p className="text-footnote mx-auto mt-6 max-w-sm v-quaternary leading-relaxed">
        {cadence === "once"
          ? "Processed by Stripe. One-time payment."
          : "Processed by Stripe. Recurring — cancel anytime from your Stripe receipt or by emailing me."}
      </p>
    </div>
  );
}

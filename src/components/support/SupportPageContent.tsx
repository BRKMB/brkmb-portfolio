"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const PRESETS = [500, 1000, 2500, 5000] as const;

function formatUsd(cents: number) {
  return `$${cents / 100}`;
}

export function SupportPageContent() {
  const searchParams = useSearchParams();
  const thanks = searchParams.get("thanks") === "1";
  const cancelled = searchParams.get("cancelled") === "1";

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
    if (amountCents == null || amountCents < 100 || amountCents > 50000) {
      setError("Enter an amount between $1 and $500.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/support/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amountCents }),
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
      <div className="mt-14 border-t border-subtle pt-10">
        <p className="font-display text-title-2 v-primary">Thank you.</p>
        <p className="text-body mt-3 v-secondary leading-relaxed">
          Appreciated — it goes toward keeping free tools online and moving.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-14 border-t border-subtle pt-10">
      {cancelled ? (
        <p className="text-subheadline mb-8 v-tertiary">
          Checkout cancelled. Nothing was charged.
        </p>
      ) : null}

      <p className="case-meta__label">Amount</p>

      <div
        className="support-amounts mt-4"
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

      <label className="mt-6 block">
        <span className="sr-only">Custom amount in USD</span>
        <div className="support-custom">
          <span className="support-custom__prefix" aria-hidden>
            $
          </span>
          <input
            type="number"
            min={1}
            max={500}
            step={1}
            inputMode="decimal"
            placeholder="Custom"
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
        className="btn-primary text-subheadline mt-8 inline-flex min-h-[44px] items-center justify-center rounded-full px-7 py-2.5 disabled:opacity-60"
      >
        {loading ? "Opening Stripe…" : "Continue"}
      </button>

      <p className="text-footnote mt-6 max-w-sm v-quaternary leading-relaxed">
        Processed by Stripe. One-time payment — no account required, no
        subscription.
      </p>
    </div>
  );
}

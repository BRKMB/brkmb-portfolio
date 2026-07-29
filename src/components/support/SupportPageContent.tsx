"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { HiHeart, HiOutlineSparkles, HiShieldCheck } from "react-icons/hi2";
import { cn } from "@/lib/utils";

const PRESETS = [
  { cents: 300, label: "$3", hint: "Coffee" },
  { cents: 500, label: "$5", hint: "Snack" },
  { cents: 1000, label: "$10", hint: "Lunch" },
  { cents: 2500, label: "$25", hint: "Fuel" },
  { cents: 5000, label: "$50", hint: "Boost" },
] as const;

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
      setError("Choose an amount between $1 and $500.");
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
              ? "Payments are being set up — try again shortly."
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
      <div className="support-thanks glass-card mt-12 rounded-[24px] p-8 md:p-10">
        <span className="support-thanks__icon" aria-hidden>
          <HiHeart className="h-6 w-6" />
        </span>
        <h2 className="font-display text-title-1 mt-5 v-primary">Thank you</h2>
        <p className="text-body mt-3 max-w-lg v-secondary leading-relaxed">
          Your support means a lot — it helps keep free tools like BlinkOTP, Boostify, and lnki.to
          moving forward.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <div className="space-y-6">
        <aside className="support-tip" aria-label="Why support">
          <span className="support-tip__badge">
            <HiOutlineSparkles className="h-4 w-4" aria-hidden />
            Soft tip
          </span>
          <p className="font-display text-title-2 mt-4 v-primary leading-snug">
            Most of what I ship is free — by design.
          </p>
          <p className="text-body mt-3 v-secondary leading-relaxed">
            BlinkOTP, Boostify, lnki.to, and other tools stay free for everyone. If they’ve saved
            you time, a one-time tip helps fund hosting, design time, and the next release —
            no pressure, no paywall.
          </p>
        </aside>

        {cancelled ? (
          <p className="text-subheadline rounded-2xl border border-subtle bg-[var(--surface-subtle)] px-4 py-3 v-tertiary">
            Checkout cancelled — no charge was made. You can pick an amount anytime.
          </p>
        ) : null}

        <div className="support-amounts">
          <p className="case-meta__label">Choose an amount</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {PRESETS.map((preset) => {
              const active = !custom && selected === preset.cents;
              return (
                <button
                  key={preset.cents}
                  type="button"
                  data-cursor
                  onClick={() => {
                    setCustom("");
                    setSelected(preset.cents);
                    setError(null);
                  }}
                  className={cn("support-amount focus-ring", active && "support-amount--active")}
                >
                  <span className="font-display text-title-2 v-primary">{preset.label}</span>
                  <span className="text-footnote mt-1 v-tertiary">{preset.hint}</span>
                </button>
              );
            })}
          </div>

          <label className="mt-5 block">
            <span className="case-meta__label">Or custom (USD)</span>
            <div className="support-custom mt-3">
              <span className="support-custom__prefix" aria-hidden>
                $
              </span>
              <input
                type="number"
                min={1}
                max={500}
                step={1}
                inputMode="decimal"
                placeholder="Other amount"
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
            <p className="text-subheadline mt-4 text-[color:var(--color-danger,#f87171)]" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            data-cursor
            disabled={loading}
            onClick={startCheckout}
            className="btn-primary text-subheadline mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-6 py-3 sm:w-auto"
          >
            {loading ? "Redirecting to Stripe…" : "Continue to secure checkout →"}
          </button>
        </div>
      </div>

      <aside className="support-aside glass-card rounded-[24px] p-6 md:p-7">
        <p className="case-meta__label">What you’re backing</p>
        <ul className="mt-5 space-y-4">
          {[
            "Free Chrome extensions used every day",
            "Independent tools without ads or lock-in",
            "Design & product work shipped from Warsaw",
          ].map((item) => (
            <li key={item} className="flex gap-3 text-subheadline v-secondary leading-relaxed">
              <span className="mt-0.5 text-accent" aria-hidden>
                ▹
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex items-start gap-3 border-t border-subtle pt-6">
          <HiShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
          <p className="text-footnote v-tertiary leading-relaxed">
            Payments are processed by Stripe. One-time only — no subscription unless you choose to
            come back later.
          </p>
        </div>
      </aside>
    </div>
  );
}

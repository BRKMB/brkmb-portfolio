"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HiOutlinePhone, HiOutlineShieldCheck } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa6";

// Site key is public by design (embedded in the widget). The phone number and
// secret key stay server-side only.
const SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "0x4AAAAAADyEVl8lhUKnvqZR";

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      action?: string;
      theme?: "auto" | "light" | "dark";
      callback: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
    }
  ) => string;
  reset: (id?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    onTurnstileLoad?: () => void;
  }
}

type Status = "idle" | "verifying" | "loading" | "revealed" | "error";

export function PhoneReveal() {
  const widgetHost = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [phone, setPhone] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const configured = SITE_KEY.length > 0;

  const fetchPhone = useCallback(async (token: string) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact/phone", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json()) as {
        success: boolean;
        phone?: string;
        whatsapp?: string;
      };
      if (!res.ok || !data.success || !data.phone) {
        throw new Error("verify");
      }
      setPhone(data.phone);
      setWhatsapp(data.whatsapp ?? data.phone.replace(/[^0-9]/g, ""));
      setStatus("revealed");
    } catch {
      setErrorMsg("Verification failed. Please try again.");
      setStatus("error");
      window.turnstile?.reset(widgetId.current ?? undefined);
    }
  }, []);

  // Load the Turnstile script once.
  useEffect(() => {
    if (!configured) return;
    if (window.turnstile) {
      setScriptReady(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-turnstile]"
    );
    if (existing) {
      existing.addEventListener("load", () => setScriptReady(true));
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.turnstile = "true";
    script.addEventListener("load", () => setScriptReady(true));
    document.head.appendChild(script);
  }, [configured]);

  // Render widget when the script is ready and we are verifying.
  useEffect(() => {
    if (status !== "verifying" || !scriptReady || !window.turnstile) return;
    if (!widgetHost.current || widgetId.current) return;
    widgetId.current = window.turnstile.render(widgetHost.current, {
      sitekey: SITE_KEY,
      action: "reveal-phone",
      theme: "dark",
      callback: (token: string) => fetchPhone(token),
      "error-callback": () => {
        setErrorMsg("Challenge error. Please retry.");
        setStatus("error");
      },
      "expired-callback": () => {
        setErrorMsg("Challenge expired. Please retry.");
        setStatus("error");
      },
    });
  }, [status, scriptReady, fetchPhone]);

  const startVerify = () => {
    setErrorMsg(null);
    setStatus("verifying");
  };

  const retry = () => {
    widgetId.current = null;
    setErrorMsg(null);
    setStatus("verifying");
  };

  if (!configured) {
    return (
      <div className="contact-phone-card">
        <div className="flex items-center gap-3">
          <HiOutlinePhone className="h-5 w-5 text-accent" aria-hidden />
          <p className="text-headline v-primary">Phone</p>
        </div>
        <p className="text-footnote mt-2 v-tertiary">
          Phone reveal is being set up. Reach me by email in the meantime.
        </p>
      </div>
    );
  }

  return (
    <div className="contact-phone-card">
      <div className="flex items-center gap-3">
        <HiOutlinePhone className="h-5 w-5 text-accent" aria-hidden />
        <p className="text-headline v-primary">Phone</p>
      </div>

      {status === "revealed" && phone ? (
        <div className="mt-4 flex flex-col gap-3">
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            data-cursor
            className="font-display text-title-3 v-primary transition hover:text-accent"
          >
            {phone}
          </a>
          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
              className="footer-social-link footer-social-link--whatsapp inline-flex w-fit items-center gap-2 !w-auto !px-3 text-subheadline"
            >
              <FaWhatsapp className="h-4 w-4" aria-hidden />
              Message on WhatsApp
            </a>
          ) : null}
        </div>
      ) : (
        <>
        <p className="text-footnote mt-2 v-tertiary">
          Protected from scrapers. Verify once to view.
        </p>

          {status === "idle" ? (
            <button
              type="button"
              onClick={startVerify}
              data-cursor
              className="btn-primary text-subheadline mt-4 inline-flex items-center gap-2"
            >
              <HiOutlineShieldCheck className="h-4 w-4" aria-hidden />
              Verify to view number
            </button>
          ) : null}

          {status === "verifying" || status === "loading" || status === "error" ? (
            <div className="mt-4">
              <div ref={widgetHost} className="cf-turnstile-host" />
              {status === "loading" ? (
                <p className="text-footnote mt-2 v-tertiary">Verifying…</p>
              ) : null}
              {status === "error" ? (
                <div className="mt-2">
                  <p className="text-footnote text-red-400">{errorMsg}</p>
                  <button
                    type="button"
                    onClick={retry}
                    data-cursor
                    className="text-footnote mt-2 text-accent underline"
                  >
                    Try again
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

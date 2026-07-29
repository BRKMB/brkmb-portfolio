/**
 * Creates a Stripe Checkout Session for one-time or recurring support.
 * Secret key lives in STRIPE_SECRET_KEY (Pages secret / .dev.vars) — never in the client.
 */

interface Env {
  STRIPE_SECRET_KEY?: string;
  SITE_URL?: string;
  /** Stripe File IDs from Files API (purpose: business_icon / business_logo) */
  STRIPE_CHECKOUT_ICON_FILE?: string;
  STRIPE_CHECKOUT_LOGO_FILE?: string;
}

type Cadence = "once" | "month" | "year";

const ALLOWED_PRESETS = new Set([100, 1000, 10000, 100000]); // $1, $10, $100, $1000
const MIN_CUSTOM_CENTS = 100; // $1
const MAX_CUSTOM_CENTS = 100000; // $1,000

function cors(request: Request) {
  const origin = request.headers.get("Origin");
  return {
    "access-control-allow-origin": origin ?? "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
  };
}

function json(data: unknown, status: number, request: Request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      ...cors(request),
    },
  });
}

function siteBase(request: Request, env: Env): string {
  const configured = env.SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  const origin = request.headers.get("Origin");
  if (origin) return origin.replace(/\/$/, "");
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

function parseCadence(value: unknown): Cadence | null {
  if (value === "once" || value === "month" || value === "year") return value;
  return null;
}

function applyBranding(params: URLSearchParams, env: Env) {
  params.set("branding_settings[display_name]", "BRKMB");
  params.set("branding_settings[background_color]", "#050506");
  params.set("branding_settings[button_color]", "#c9f31d");
  params.set("branding_settings[font_family]", "inter");
  params.set("branding_settings[border_style]", "pill");

  const icon = env.STRIPE_CHECKOUT_ICON_FILE?.trim();
  const logo = env.STRIPE_CHECKOUT_LOGO_FILE?.trim();
  if (icon) {
    params.set("branding_settings[icon][type]", "file");
    params.set("branding_settings[icon][file]", icon);
  }
  if (logo) {
    params.set("branding_settings[logo][type]", "file");
    params.set("branding_settings[logo][file]", logo);
  }
}

export const onRequestOptions: PagesFunction<Env> = async ({ request }) =>
  new Response(null, { headers: cors(request) });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const secret = env.STRIPE_SECRET_KEY?.trim();
  if (!secret) {
    return json({ success: false, error: "not-configured" }, 500, request);
  }

  let amountCents = 0;
  let cadence: Cadence = "once";
  try {
    const body = (await request.json()) as {
      amountCents?: number;
      cadence?: string;
    };
    amountCents = Number(body?.amountCents);
    const parsed = parseCadence(body?.cadence);
    if (!parsed) {
      return json({ success: false, error: "invalid-cadence" }, 400, request);
    }
    cadence = parsed;
  } catch {
    return json({ success: false, error: "invalid-body" }, 400, request);
  }

  if (!Number.isFinite(amountCents) || !Number.isInteger(amountCents)) {
    return json({ success: false, error: "invalid-amount" }, 400, request);
  }

  const allowed =
    ALLOWED_PRESETS.has(amountCents) ||
    (amountCents >= MIN_CUSTOM_CENTS && amountCents <= MAX_CUSTOM_CENTS);

  if (!allowed) {
    return json({ success: false, error: "amount-out-of-range" }, 400, request);
  }

  const base = siteBase(request, env);
  const isRecurring = cadence !== "once";
  const productName =
    cadence === "once"
      ? "One-time support"
      : cadence === "month"
        ? "Monthly support"
        : "Yearly support";
  const productDescription = "Support for free tools and projects from brkmb.com";

  const params = new URLSearchParams();
  params.set("mode", isRecurring ? "subscription" : "payment");
  // Tips stay under your Stripe account (not Stripe Managed Payments MoR).
  params.set("managed_payments[enabled]", "false");
  params.set("success_url", `${base}/support/?thanks=1&session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${base}/support/?cancelled=1`);
  if (!isRecurring) {
    params.set("submit_type", "donate");
  }
  params.set("billing_address_collection", "auto");
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][unit_amount]", String(amountCents));
  params.set("line_items[0][price_data][product_data][name]", productName);
  params.set(
    "line_items[0][price_data][product_data][description]",
    productDescription
  );
  params.set(
    "line_items[0][price_data][product_data][tax_code]",
    "txcd_10000000"
  );
  if (isRecurring) {
    params.set("line_items[0][price_data][recurring][interval]", cadence);
  }
  params.set("metadata[source]", "brkmb-support-page");
  params.set("metadata[amount_cents]", String(amountCents));
  params.set("metadata[cadence]", cadence);
  applyBranding(params, env);

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const session = (await stripeRes.json()) as {
    id?: string;
    url?: string;
    error?: { message?: string };
  };

  if (!stripeRes.ok || !session.url) {
    return json(
      {
        success: false,
        error: "stripe-error",
        message: session.error?.message ?? "Could not start checkout",
      },
      502,
      request
    );
  }

  return json({ success: true, url: session.url, id: session.id }, 200, request);
};

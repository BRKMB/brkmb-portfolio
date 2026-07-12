/**
 * Reveals the phone number ONLY after a valid Cloudflare Turnstile challenge.
 * The number lives in the CONTACT_PHONE secret — never in the client bundle,
 * repo, or HTML — so it can't be scraped or indexed by search engines.
 */

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_PHONE?: string;
  CONTACT_WHATSAPP?: string;
}

interface TurnstileResult {
  success: boolean;
  "error-codes"?: string[];
}

function cors(request: Request) {
  const origin = request.headers.get("Origin");
  return {
    "access-control-allow-origin": origin ?? "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
  };
}

export const onRequestOptions: PagesFunction<Env> = async ({ request }) =>
  new Response(null, { headers: cors(request) });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const headers = {
    "content-type": "application/json",
    "cache-control": "no-store",
    ...cors(request),
  };

  if (!env.TURNSTILE_SECRET_KEY || !env.CONTACT_PHONE) {
    return new Response(
      JSON.stringify({ success: false, error: "not-configured" }),
      { status: 500, headers }
    );
  }

  let token = "";
  try {
    const body = (await request.json()) as { token?: string };
    token = typeof body?.token === "string" ? body.token : "";
  } catch {
    token = "";
  }

  if (!token) {
    return new Response(
      JSON.stringify({ success: false, error: "missing-token" }),
      { status: 400, headers }
    );
  }

  const ip = request.headers.get("CF-Connecting-IP") ?? "";
  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET_KEY);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  const verifyRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: form }
  );
  const verify = (await verifyRes.json()) as TurnstileResult;

  if (!verify.success) {
    return new Response(
      JSON.stringify({ success: false, error: "verification-failed" }),
      { status: 403, headers }
    );
  }

  const phone = env.CONTACT_PHONE;
  const whatsapp = env.CONTACT_WHATSAPP ?? phone.replace(/[^0-9]/g, "");

  return new Response(
    JSON.stringify({ success: true, phone, whatsapp }),
    { status: 200, headers }
  );
};

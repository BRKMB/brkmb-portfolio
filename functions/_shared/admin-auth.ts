export interface AdminEnv {
  ADMIN_PIN_SHA256?: string;
  ADMIN_SESSION_SECRET?: string;
}

const COOKIE_NAME = "brkmb_admin_sess";
const SESSION_HOURS = 24;

function cors(request: Request) {
  const origin = request.headers.get("Origin");
  return {
    "access-control-allow-origin": origin ?? "*",
    "access-control-allow-methods": "GET, POST, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-allow-credentials": "true",
  };
}

export function adminJson(
  request: Request,
  body: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {}
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      ...cors(request),
      ...extraHeaders,
    },
  });
}

export function adminOptions(request: Request) {
  return new Response(null, { headers: cors(request) });
}

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function hmacSign(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function hmacVerify(secret: string, message: string, signature: string): Promise<boolean> {
  const expected = await hmacSign(secret, message);
  return timingSafeEqual(expected, signature);
}

function sessionExpiryMs() {
  return Date.now() + SESSION_HOURS * 60 * 60 * 1000;
}

export async function createSessionToken(secret: string): Promise<string> {
  const exp = sessionExpiryMs();
  const sig = await hmacSign(secret, String(exp));
  return `${exp}.${sig}`;
}

export async function verifySessionToken(
  secret: string,
  token: string | null | undefined
): Promise<boolean> {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  return hmacVerify(secret, expStr, sig);
}

export function readSessionCookie(request: Request): string | null {
  const raw = request.headers.get("Cookie") ?? "";
  for (const part of raw.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === COOKIE_NAME) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export function sessionCookieHeader(token: string, maxAgeSec: number): string {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    `Max-Age=${maxAgeSec}`,
  ];
  return parts.join("; ");
}

export function clearSessionCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export async function verifyAdminPin(env: AdminEnv, pin: string): Promise<boolean> {
  const expected = env.ADMIN_PIN_SHA256?.trim().toLowerCase();
  if (!expected || !pin) return false;
  const actual = await sha256Hex(pin);
  return timingSafeEqual(actual, expected);
}

export function isAdminConfigured(env: AdminEnv): boolean {
  return Boolean(env.ADMIN_PIN_SHA256?.trim() && env.ADMIN_SESSION_SECRET?.trim());
}

export async function assertAdminSession(
  request: Request,
  env: AdminEnv
): Promise<boolean> {
  if (!env.ADMIN_SESSION_SECRET) return false;
  const token = readSessionCookie(request);
  return verifySessionToken(env.ADMIN_SESSION_SECRET, token);
}

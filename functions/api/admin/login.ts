import type { AdminEnv } from "../../_shared/admin-auth";
import {
  adminJson,
  adminOptions,
  clearSessionCookieHeader,
  createSessionToken,
  isAdminConfigured,
  sessionCookieHeader,
  verifyAdminPin,
} from "../../_shared/admin-auth";

export const onRequestOptions: PagesFunction<AdminEnv> = async ({ request }) =>
  adminOptions(request);

export const onRequestPost: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!isAdminConfigured(env)) {
    return adminJson(request, { ok: false, error: "not-configured" }, 503);
  }

  let pin = "";
  try {
    const body = (await request.json()) as { pin?: string };
    pin = typeof body?.pin === "string" ? body.pin : "";
  } catch {
    pin = "";
  }

  if (!pin || !(await verifyAdminPin(env, pin))) {
    return adminJson(request, { ok: false, error: "invalid-pin" }, 401);
  }

  const token = await createSessionToken(env.ADMIN_SESSION_SECRET!);
  return adminJson(
    request,
    { ok: true },
    200,
    { "Set-Cookie": sessionCookieHeader(token, 60 * 60 * 24) }
  );
};

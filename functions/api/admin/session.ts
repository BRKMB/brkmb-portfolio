import type { AdminEnv } from "../../_shared/admin-auth";
import {
  adminJson,
  adminOptions,
  assertAdminSession,
  clearSessionCookieHeader,
  isAdminConfigured,
} from "../../_shared/admin-auth";

export const onRequestOptions: PagesFunction<AdminEnv> = async ({ request }) =>
  adminOptions(request);

export const onRequestGet: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!isAdminConfigured(env)) {
    return adminJson(request, { ok: false, error: "not-configured" }, 503);
  }
  const ok = await assertAdminSession(request, env);
  return adminJson(request, { ok }, ok ? 200 : 401);
};

export const onRequestDelete: PagesFunction<AdminEnv> = async ({ request }) =>
  adminJson(request, { ok: true }, 200, { "Set-Cookie": clearSessionCookieHeader() });

import type { AdminEnv } from "../../_shared/admin-auth";
import { adminJson, adminOptions, clearSessionCookieHeader } from "../../_shared/admin-auth";

export const onRequestOptions: PagesFunction<AdminEnv> = async ({ request }) =>
  adminOptions(request);

export const onRequestPost: PagesFunction<AdminEnv> = async ({ request }) =>
  adminJson(request, { ok: true }, 200, { "Set-Cookie": clearSessionCookieHeader() });

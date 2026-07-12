const SESSION_URL = "/api/admin/session";
const LOGIN_URL = "/api/admin/login";
const LOGOUT_URL = "/api/admin/logout";

async function parseOk(res: Response): Promise<boolean> {
  if (!res.ok) return false;
  try {
    const data = (await res.json()) as { ok?: boolean };
    return Boolean(data.ok);
  } catch {
    return false;
  }
}

export async function fetchAdminSession(): Promise<boolean> {
  const res = await fetch(SESSION_URL, { credentials: "include", cache: "no-store" });
  return parseOk(res);
}

export async function loginAdminPin(pin: string): Promise<"ok" | "invalid" | "not-configured"> {
  const res = await fetch(LOGIN_URL, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ pin }),
  });

  if (res.status === 503) return "not-configured";
  if (!(await parseOk(res))) return "invalid";
  return "ok";
}

export async function logoutAdmin(): Promise<void> {
  await fetch(LOGOUT_URL, { method: "POST", credentials: "include" }).catch(() => undefined);
}

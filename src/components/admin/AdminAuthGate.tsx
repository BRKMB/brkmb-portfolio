"use client";

import { useState, type ReactNode } from "react";
import { useCms } from "@/components/providers/CmsProvider";

type AuthError = "invalid" | "not-configured" | null;

function AdminLoginForm() {
  const { login, adminAuthReady } = useCms();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<AuthError>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        className="glass-sheet w-full max-w-sm p-8"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);
          const result = await login(pin);
          if (result === "invalid") setError("invalid");
          if (result === "not-configured") setError("not-configured");
          setLoading(false);
        }}
      >
        <h1 className="font-display text-title-2 v-primary">Admin</h1>
        <p className="text-footnote mt-2 v-tertiary">Enter your PIN to manage content.</p>
        <input
          type="password"
          className="admin-input mt-6 w-full"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          autoComplete="current-password"
          disabled={!adminAuthReady || loading}
        />
        {error === "invalid" ? (
          <p className="text-footnote mt-2 text-red-400">Wrong PIN</p>
        ) : null}
        {error === "not-configured" ? (
          <p className="text-footnote mt-2 text-red-400">
            Admin login is not configured on the server yet.
          </p>
        ) : null}
        <button
          type="submit"
          className="btn-primary text-subheadline mt-6 w-full disabled:opacity-60"
          disabled={!adminAuthReady || loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const { isAdminAuthed, adminAuthReady } = useCms();

  if (!adminAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-footnote v-tertiary">Checking session…</p>
      </div>
    );
  }

  if (!isAdminAuthed) {
    return <AdminLoginForm />;
  }

  return children;
}

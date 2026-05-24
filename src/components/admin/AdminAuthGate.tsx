"use client";

import { useState, type ReactNode } from "react";
import { useCms } from "@/components/providers/CmsProvider";

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const { isAdminAuthed, login } = useCms();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  if (!isAdminAuthed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <form
          className="glass-sheet w-full max-w-sm p-8"
          onSubmit={(e) => {
            e.preventDefault();
            setError(!login(pin));
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
          />
          {error ? <p className="text-footnote mt-2 text-red-400">Wrong PIN</p> : null}
          <button type="submit" className="btn-primary text-subheadline mt-6 w-full">
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return children;
}

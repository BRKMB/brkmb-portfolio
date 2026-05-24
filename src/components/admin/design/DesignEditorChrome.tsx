"use client";

import { useEffect, type ReactNode } from "react";

/** Hides site nav/footer so the project editor matches a full-screen Behance-style canvas. */
export function DesignEditorChrome({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add("design-editor-mode");
    return () => document.body.classList.remove("design-editor-mode");
  }, []);

  return children;
}

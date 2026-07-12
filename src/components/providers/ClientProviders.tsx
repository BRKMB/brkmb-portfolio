"use client";

import { useState, useEffect, type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { Loader } from "@/components/ui/Loader";
import { LinkCopiedToastHost } from "@/components/ui/LinkCopiedToastHost";
import { Navigation } from "@/components/layout/Navigation";
import { CmsProvider } from "@/components/providers/CmsProvider";

export function ClientProviders({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("site-ready");
    if (sessionStorage.getItem("brkmb-visited") === "1") {
      setLoading(false);
      return;
    }
    const t = setTimeout(() => {
      sessionStorage.setItem("brkmb-visited", "1");
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <CmsProvider>
      <Navigation />
      <LinkCopiedToastHost />
      <AnimatePresence>{loading ? <Loader key="loader" /> : null}</AnimatePresence>
      <main className="relative">{children}</main>
    </CmsProvider>
  );
}

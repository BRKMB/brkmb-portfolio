"use client";

import { useState, useEffect, type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { Loader } from "@/components/ui/Loader";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Navigation } from "@/components/layout/Navigation";

export function ClientProviders({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      document.documentElement.classList.add("site-ready");
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <Navigation />
      <AnimatePresence mode="wait">
        {loading ? <Loader key="loader" /> : null}
      </AnimatePresence>
      <main className={loading ? "opacity-0" : "opacity-100 transition-opacity duration-700 relative"}>
        {children}
      </main>
    </>
  );
}

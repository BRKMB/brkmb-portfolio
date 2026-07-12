"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HiCheck } from "react-icons/hi2";

type LinkCopiedToastProps = {
  visible: boolean;
};

export function LinkCopiedToast({ visible }: LinkCopiedToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {visible ? (
        <div className="link-copied-toast-shell" aria-hidden={false}>
          <motion.div
            key="link-copied-toast"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="link-copied-toast"
            initial={{ opacity: 0, y: -16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
          >
            <HiCheck className="link-copied-toast__icon" aria-hidden />
            Link copied
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

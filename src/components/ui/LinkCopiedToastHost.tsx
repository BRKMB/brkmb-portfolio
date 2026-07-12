"use client";

import { useEffect, useRef, useState } from "react";
import { LINK_COPIED_EVENT } from "@/lib/link-copied-toast";
import { LinkCopiedToast } from "@/components/ui/LinkCopiedToast";

export function LinkCopiedToastHost() {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const show = () => {
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 2800);
    };

    window.addEventListener(LINK_COPIED_EVENT, show);
    return () => {
      window.removeEventListener(LINK_COPIED_EVENT, show);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return <LinkCopiedToast visible={visible} />;
}

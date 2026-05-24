"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  const cursorX = useSpring(0, { stiffness: 900, damping: 45, mass: 0.2 });
  const cursorY = useSpring(0, { stiffness: 900, damping: 45, mass: 0.2 });
  const ringX = useSpring(0, { stiffness: 280, damping: 28, mass: 0.4 });
  const ringY = useSpring(0, { stiffness: 280, damping: 28, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    setVisible(true);
    document.documentElement.classList.add("custom-cursor");

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(!!t.closest("a, button, [data-cursor], input, textarea, select"));
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [cursorX, cursorY, ringX, ringY]);

  if (!visible) return null;

  return (
    <>
      {/* Trailing ring — no blur, glow only */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="rounded-full border border-[#c9f31d]/40"
          animate={{
            width: hovering ? 48 : 36,
            height: hovering ? 48 : 36,
            opacity: hovering ? 0.9 : 0.55,
          }}
          transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
          style={{
            boxShadow:
              "0 0 20px rgba(201, 243, 29, 0.35), 0 0 40px rgba(201, 243, 29, 0.12)",
          }}
        />
      </motion.div>

      {/* Core dot — black + white stroke + green glow */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[10000] hidden md:block"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          animate={{ scale: clicking ? 0.85 : hovering ? 1.35 : 1 }}
          transition={{ duration: 0.12, ease: [0.32, 0.72, 0, 1] }}
          className="rounded-full bg-[#0a0a0a]"
          style={{
            width: 10,
            height: 10,
            border: "1.5px solid rgba(255, 255, 255, 0.95)",
            boxShadow:
              "0 0 10px rgba(201, 243, 29, 0.85), 0 0 22px rgba(201, 243, 29, 0.45), 0 0 36px rgba(201, 243, 29, 0.2)",
          }}
        />
      </motion.div>
    </>
  );
}

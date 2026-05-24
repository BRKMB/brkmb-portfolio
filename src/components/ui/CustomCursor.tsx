"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useMotionValueEvent,
  useSpring,
  type MotionValue,
} from "framer-motion";

const CURSOR_ROOT_ID = "custom-cursor-root";

function ensureCursorRoot(): HTMLElement {
  let root = document.getElementById(CURSOR_ROOT_ID);
  if (!root) {
    root = document.createElement("div");
    root.id = CURSOR_ROOT_ID;
    document.body.appendChild(root);
  } else {
    document.body.appendChild(root);
  }
  return root;
}

function CursorLayer({
  x,
  y,
  offset,
  className,
  children,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  offset: number;
  className: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useMotionValueEvent(x, "change", (v) => {
    if (ref.current) ref.current.style.left = `${v - offset}px`;
  });
  useMotionValueEvent(y, "change", (v) => {
    if (ref.current) ref.current.style.top = `${v - offset}px`;
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function CustomCursor() {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  const cursorX = useSpring(0, { stiffness: 900, damping: 45, mass: 0.2 });
  const cursorY = useSpring(0, { stiffness: 900, damping: 45, mass: 0.2 });
  const ringX = useSpring(0, { stiffness: 280, damping: 28, mass: 0.4 });
  const ringY = useSpring(0, { stiffness: 280, damping: 28, mass: 0.4 });

  useEffect(() => {
    setRoot(ensureCursorRoot());
  }, []);

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

  useEffect(() => {
    if (!root) return;
    const pinOnTop = () => {
      if (document.body.lastElementChild !== root) {
        document.body.appendChild(root);
      }
    };
    pinOnTop();
    const observer = new MutationObserver(pinOnTop);
    observer.observe(document.body, { childList: true });
    return () => observer.disconnect();
  }, [root]);

  if (!root || !visible) return null;

  const cursor = (
    <>
      <CursorLayer
        x={ringX}
        y={ringY}
        offset={18}
        className="custom-cursor-layer custom-cursor-ring hidden md:block"
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
      </CursorLayer>

      <CursorLayer
        x={cursorX}
        y={cursorY}
        offset={5}
        className="custom-cursor-layer custom-cursor-core hidden md:block"
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
      </CursorLayer>
    </>
  );

  return createPortal(cursor, root);
}

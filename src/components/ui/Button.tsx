"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  external?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  external,
}: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium transition-colors",
    variant === "primary"
      ? "bg-white text-black hover:bg-white/90 shadow-[0_0_40px_rgba(99,102,241,0.25)]"
      : "glass text-white hover:bg-white/10",
    className
  );

  const inner = <span data-cursor>{children}</span>;

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
      <Link href={href} className={styles}>
        {inner}
      </Link>
    </motion.div>
  );
}

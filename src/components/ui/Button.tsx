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
    "inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium transition-all",
    variant === "primary"
      ? "btn-primary"
      : "glass text-white/80 hover:border-[#c9f31d]/30 hover:text-white",
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

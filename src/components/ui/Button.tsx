"use client";

import Link from "next/link";
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
    "focus-ring glass-interactive",
    variant === "primary" ? "btn-primary" : "btn-glass",
    className
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles} data-cursor>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={styles} data-cursor>
      {children}
    </Link>
  );
}

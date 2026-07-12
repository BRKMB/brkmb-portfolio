import Image from "next/image";
import { cn } from "@/lib/utils";

const MARK_SRC = "/images/brand/baher-mark.png";

const markSizes = {
  sm: 28,
  md: 36,
  lg: 52,
} as const;

type SiteLogoProps = {
  className?: string;
  markClassName?: string;
  size?: keyof typeof markSizes;
  showWordmark?: boolean;
  wordmark?: string;
  compactWordmark?: boolean;
  priority?: boolean;
};

export function SiteLogo({
  className,
  markClassName,
  size = "md",
  showWordmark = true,
  wordmark = "Baher",
  compactWordmark = false,
  priority = false,
}: SiteLogoProps) {
  const px = markSizes[size];

  return (
    <span className={cn("site-logo inline-flex min-w-0 items-center gap-2.5", className)}>
      <Image
        src={MARK_SRC}
        alt=""
        width={px}
        height={px}
        priority={priority}
        className={cn("site-logo__mark shrink-0 object-contain", markClassName)}
        style={{ width: px, height: px }}
      />
      {showWordmark ? (
        <span
          className={cn(
            "site-logo__wordmark truncate v-primary",
            compactWordmark && "hidden sm:inline"
          )}
        >
          {wordmark}
        </span>
      ) : null}
    </span>
  );
}

export function SiteSignature({ className }: { className?: string }) {
  return (
    <Image
      src="/images/brand/baher-signature.png"
      alt="Baher Magally signature"
      width={140}
      height={62}
      className={cn("site-signature", className)}
    />
  );
}

import type { IconType } from "react-icons";
import {
  FaBehance,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaPaypal,
  FaGithub,
  FaX,
  FaDribbble,
  FaWhatsapp,
  FaTelegram,
  FaPinterest,
} from "react-icons/fa6";
import { SiLinktree } from "react-icons/si";
import { HiOutlineGlobeAlt, HiOutlineEnvelope } from "react-icons/hi2";

type BrandConfig = {
  icon: IconType;
  color: string;
  gradient?: string;
};

const brands: Record<string, BrandConfig> = {
  behance: { icon: FaBehance, color: "#1769FF" },
  facebook: { icon: FaFacebook, color: "#1877F2" },
  linkedin: { icon: FaLinkedin, color: "#0A66C2" },
  instagram: {
    icon: FaInstagram,
    color: "#FFFFFF",
    gradient: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
  },
  tiktok: { icon: FaTiktok, color: "#FFFFFF" },
  youtube: { icon: FaYoutube, color: "#FF0000" },
  paypal: { icon: FaPaypal, color: "#003087" },
  github: { icon: FaGithub, color: "#FFFFFF" },
  twitter: { icon: FaX, color: "#FFFFFF" },
  dribbble: { icon: FaDribbble, color: "#EA4C89" },
  whatsapp: { icon: FaWhatsapp, color: "#25D366" },
  telegram: { icon: FaTelegram, color: "#26A5E4" },
  email: { icon: HiOutlineEnvelope, color: "#EA4335" },
  website: { icon: HiOutlineGlobeAlt, color: "#5c5c5c" },
  linktree: { icon: SiLinktree, color: "#43E660" },
  pinterest: { icon: FaPinterest, color: "#E60023" },
};

function badgeBackground(key: string, brand: BrandConfig): string {
  if (key === "instagram" && brand.gradient) return brand.gradient;
  if (key === "tiktok" || key === "twitter") return "#000000";
  if (key === "github") return "#24292f";
  if (key === "whatsapp") return "#25D366";
  if (key === "telegram") return "#26A5E4";
  if (key === "facebook") return "#1877F2";
  if (key === "linkedin") return "#0A66C2";
  if (key === "youtube") return "#FF0000";
  if (key === "behance") return "#1769FF";
  if (key === "pinterest") return "#E60023";
  if (key === "paypal") return "#ffffff";
  return "#ffffff";
}

function badgeIconColor(key: string, brand: BrandConfig): string {
  if (
    key === "instagram" ||
    key === "tiktok" ||
    key === "github" ||
    key === "twitter" ||
    key === "facebook" ||
    key === "linkedin" ||
    key === "youtube" ||
    key === "behance" ||
    key === "pinterest"
  ) {
    return "#ffffff";
  }
  return brand.color;
}

export function PlatformIcon({
  platform,
  className = "h-6 w-6",
  variant = "default",
  badgeSize = "md",
}: {
  platform: string;
  className?: string;
  variant?: "default" | "badge";
  badgeSize?: "md" | "sm";
}) {
  const key = platform.toLowerCase();
  const brand = brands[key] ?? brands.website;
  const Icon = brand.icon;

  if (variant === "badge") {
    const wrap =
      badgeSize === "sm"
        ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        : "flex h-11 w-11 shrink-0 items-center justify-center rounded-full";

    return (
      <span
        className={wrap}
        style={{ background: badgeBackground(key, brand) }}
        aria-hidden
      >
        <Icon className={className} style={{ color: badgeIconColor(key, brand) }} />
      </span>
    );
  }

  return <Icon className={className} style={{ color: brand.color }} aria-hidden />;
}

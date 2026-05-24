export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function statusColor(status: string): string {
  switch (status) {
    case "Live":
    case "Completed":
      return "text-[#c9f31d] border-[#c9f31d]/25 bg-[#c9f31d]/10";
    case "In Progress":
    case "Building":
      return "text-[#d4ff4d] border-[#d4ff4d]/20 bg-[#d4ff4d]/8";
    default:
      return "text-[rgba(235,235,245,0.6)] border-white/10 bg-white/5";
  }
}

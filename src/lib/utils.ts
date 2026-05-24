export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function statusColor(status: string): string {
  switch (status) {
    case "Live":
    case "Completed":
      return "text-[#c9f31d] bg-[#c9f31d]/10 border-[#c9f31d]/25";
    case "In Progress":
    case "Building":
      return "text-[#d4ff4d] bg-[#d4ff4d]/10 border-[#d4ff4d]/20";
    default:
      return "text-[#a8d86a] bg-[#a8d86a]/10 border-[#a8d86a]/20";
  }
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function statusColor(status: string): string {
  switch (status) {
    case "Live":
    case "Completed":
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
    case "In Progress":
    case "Building":
      return "text-amber-400 bg-amber-400/10 border-amber-400/30";
    default:
      return "text-violet-400 bg-violet-400/10 border-violet-400/30";
  }
}

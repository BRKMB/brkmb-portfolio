export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function statusColor(status: string): string {
  switch (status) {
    case "Live":
    case "Completed":
      return "status-chip status-chip--live";
    case "In Progress":
    case "Building":
      return "status-chip status-chip--building";
    default:
      return "status-chip status-chip--default";
  }
}

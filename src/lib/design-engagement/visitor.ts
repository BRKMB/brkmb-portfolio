const VISITOR_KEY = "brkmb-visitor-id";

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function hasViewedProject(slug: string): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(`brkmb-viewed-${slug}`) === "1";
}

export function markViewedProject(slug: string) {
  sessionStorage.setItem(`brkmb-viewed-${slug}`, "1");
}

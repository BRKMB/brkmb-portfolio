export function toWebsiteUrl(website: string): string {
  const trimmed = website.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

export function toLinkedInUrl(linkedin: string): string {
  const trimmed = linkedin.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

export function toMailto(email: string): string {
  return `mailto:${email.trim()}`;
}

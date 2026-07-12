import boostifyCompliance from "@/data/project-compliance/boostify.json";
import blinkotpCompliance from "@/data/project-compliance/blinkotp.json";
import type { ComplianceDocId, ProjectCompliance } from "@/types/project-compliance";
import { COMPLIANCE_DOC_IDS } from "@/types/project-compliance";

const bySlug: Record<string, ProjectCompliance> = {
  Boostify: boostifyCompliance as ProjectCompliance,
  boostify: boostifyCompliance as ProjectCompliance,
  BlinkOTP: blinkotpCompliance as ProjectCompliance,
  blinkotp: blinkotpCompliance as ProjectCompliance,
};

/** Slug keys are case-sensitive — map lowercase lookup */
export function getProjectCompliance(slug: string): ProjectCompliance | undefined {
  return bySlug[slug] ?? bySlug[slug.toLowerCase()] ?? bySlug[capitalize(slug)];
}

export function projectHasCompliance(slug: string): boolean {
  return Boolean(getProjectCompliance(slug));
}

export function getComplianceProjectSlugs(): string[] {
  return ["Boostify", "BlinkOTP"];
}

export function getAllComplianceParams(): { slug: string; doc: ComplianceDocId }[] {
  const params: { slug: string; doc: ComplianceDocId }[] = [];
  for (const slug of getComplianceProjectSlugs()) {
    for (const doc of COMPLIANCE_DOC_IDS) {
      params.push({ slug, doc });
    }
  }
  return params;
}

export function complianceDocPath(slug: string, doc: ComplianceDocId): string {
  return `/projects/${slug}/${doc}/`;
}

export function isComplianceDocId(value: string): value is ComplianceDocId {
  return (COMPLIANCE_DOC_IDS as readonly string[]).includes(value);
}

export const COMPLIANCE_DOC_LABELS: Record<ComplianceDocId, string> = {
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  support: "Support",
};

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

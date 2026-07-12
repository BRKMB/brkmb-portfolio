import Link from "next/link";
import {
  COMPLIANCE_DOC_LABELS,
  complianceDocPath,
  projectHasCompliance,
} from "@/lib/project-compliance";
import type { ComplianceDocId } from "@/types/project-compliance";

const DOC_IDS: ComplianceDocId[] = ["privacy", "terms", "support"];

const STORE_CHECKLIST = [
  { key: "privacy", label: "Privacy Policy (/privacy)" },
  { key: "terms", label: "Terms of Service (/terms)" },
  { key: "support", label: "Support & contact (/support)" },
] as const;

export function ProjectComplianceLinks({ slug }: { slug: string }) {
  if (!projectHasCompliance(slug)) return null;

  return (
    <section className="case-compliance" aria-labelledby="case-compliance-heading">
      <h2 id="case-compliance-heading" className="font-display text-title-2 v-primary">
        Store &amp; legal
      </h2>
      <p className="text-body mt-3 v-secondary leading-relaxed">
        Chrome Web Store and similar platforms require public privacy, terms, and support pages on a
        verified domain. All links below are hosted on this site under this project.
      </p>

      <ul className="case-compliance__links mt-6">
        {DOC_IDS.map((doc) => (
          <li key={doc}>
            <Link href={complianceDocPath(slug, doc)} className="case-compliance__link focus-ring">
              <span className="case-compliance__path">{complianceDocPath(slug, doc)}</span>
              <span className="case-compliance__label">{COMPLIANCE_DOC_LABELS[doc]}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="case-compliance__checklist mt-8">
        <p className="case-meta__label">Chrome Web Store checklist</p>
        <ul className="case-compliance__checks mt-3">
          {STORE_CHECKLIST.map((item) => (
            <li key={item.key}>
              <span className="case-compliance__check" aria-hidden>
                ✓
              </span>
              {item.label}
            </li>
          ))}
          <li>
            <span className="case-compliance__check" aria-hidden>
              ✓
            </span>
            Data collection disclosure, single-purpose use, no data selling, retention &amp; deletion
          </li>
          <li>
            <span className="case-compliance__check" aria-hidden>
              ✓
            </span>
            Support email, FAQ, and contact form link
          </li>
          <li>
            <span className="case-compliance__check" aria-hidden>
              ✓
            </span>
            Domain verified via Google Search Console (brkmb.com)
          </li>
        </ul>
      </div>
    </section>
  );
}

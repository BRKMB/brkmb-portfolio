import Link from "next/link";
import type { ComplianceDocId, ProjectCompliance } from "@/types/project-compliance";
import { COMPLIANCE_DOC_LABELS } from "@/lib/project-compliance";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function DocNav({
  slug,
  projectTitle,
  doc,
}: {
  slug: string;
  projectTitle: string;
  doc: ComplianceDocId;
}) {
  const docs: ComplianceDocId[] = ["privacy", "terms", "support"];
  return (
    <header className="compliance-doc__header">
      <Link href={`/projects/${slug}/`} className="text-subheadline text-accent transition hover:opacity-80">
        ← {projectTitle}
      </Link>
      <nav className="compliance-doc__tabs" aria-label="Legal and support pages">
        {docs.map((id) => (
          <Link
            key={id}
            href={`/projects/${slug}/${id}/`}
            className={id === doc ? "compliance-doc__tab compliance-doc__tab--active" : "compliance-doc__tab"}
            aria-current={id === doc ? "page" : undefined}
          >
            {COMPLIANCE_DOC_LABELS[id]}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function PrivacyBody({ data }: { data: ProjectCompliance }) {
  const { privacy } = data;
  return (
    <div className="compliance-prose">
      <p className="compliance-lead">{privacy.introduction}</p>

      <section>
        <h2>Data collection disclosure</h2>
        <p className="compliance-note">
          The following describes user data, permissions, and page context the extension may access.
        </p>
        <ul className="compliance-list">
          {privacy.dataCollected.map((item) => (
            <li key={item.label}>
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Permissions</h2>
        <ul className="compliance-list">
          {privacy.permissions.map((item) => (
            <li key={item.label}>
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Single purpose</h2>
        <p>{privacy.singlePurpose}</p>
      </section>

      <section>
        <h2>No sale or sharing of user data</h2>
        <p>{privacy.noDataSelling}</p>
      </section>

      <section>
        <h2>Data retention &amp; deletion</h2>
        <p>{privacy.retention}</p>
        <p>{privacy.deletion}</p>
      </section>

      {privacy.thirdParties ? (
        <section>
          <h2>Third parties</h2>
          <p>{privacy.thirdParties}</p>
        </section>
      ) : null}

      <section>
        <h2>Contact</h2>
        <p>
          Privacy questions:{" "}
          <a href={`mailto:${data.supportEmail}`} className="text-accent hover:opacity-80">
            {data.supportEmail}
          </a>
        </p>
      </section>
    </div>
  );
}

function TermsBody({ data }: { data: ProjectCompliance }) {
  const { terms } = data;
  return (
    <div className="compliance-prose">
      <p className="compliance-lead">{terms.introduction}</p>

      <section>
        <h2>User eligibility &amp; rules</h2>
        <p>{terms.eligibility}</p>
        <p>{terms.acceptableUse}</p>
      </section>

      <section>
        <h2>Payment &amp; billing</h2>
        <p>{terms.payments}</p>
      </section>

      <section>
        <h2>Intellectual property</h2>
        <p>{terms.intellectualProperty}</p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>{terms.liability}</p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>{terms.changes}</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Legal inquiries:{" "}
          <a href={`mailto:${data.supportEmail}`} className="text-accent hover:opacity-80">
            {data.supportEmail}
          </a>
        </p>
      </section>
    </div>
  );
}

function SupportBody({ data, slug }: { data: ProjectCompliance; slug: string }) {
  const { support } = data;
  return (
    <div className="compliance-prose">
      <p className="compliance-lead">{support.introduction}</p>

      <section>
        <h2>Direct contact</h2>
        <p>
          Support email:{" "}
          <a href={`mailto:${data.supportEmail}`} className="text-accent hover:opacity-80">
            {data.supportEmail}
          </a>
        </p>
        <p>
          General contact form:{" "}
          <Link href="/contact/" className="text-accent hover:opacity-80">
            brkmb.com/contact/
          </Link>
        </p>
      </section>

      <section>
        <h2>FAQ &amp; troubleshooting</h2>
        <dl className="compliance-faq">
          {support.faq.map((item) => (
            <div key={item.question} className="compliance-faq__item">
              <dt>{item.question}</dt>
              <dd>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2>Related policies</h2>
        <ul className="compliance-links-inline">
          <li>
            <Link href={`/projects/${slug}/privacy/`}>Privacy Policy</Link>
          </li>
          <li>
            <Link href={`/projects/${slug}/terms/`}>Terms of Service</Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

export function ProjectComplianceDoc({
  slug,
  projectTitle,
  doc,
  data,
}: {
  slug: string;
  projectTitle: string;
  doc: ComplianceDocId;
  data: ProjectCompliance;
}) {
  const title = `${COMPLIANCE_DOC_LABELS[doc]} — ${data.productName}`;

  return (
    <article className="compliance-doc min-h-screen px-5 pt-28 pb-24 md:px-10 md:pt-32">
      <div className="mx-auto max-w-3xl">
        <DocNav slug={slug} projectTitle={projectTitle} doc={doc} />

        <h1 className="font-display text-large-title mt-8 uppercase v-primary">{title}</h1>
        <p className="text-footnote mt-3 v-tertiary">
          Last updated {formatDate(data.lastUpdated)} · Hosted on {data.verifiedDomain} (Google Search
          Console verified)
        </p>

        <div className="mt-10">
          {doc === "privacy" ? <PrivacyBody data={data} /> : null}
          {doc === "terms" ? <TermsBody data={data} /> : null}
          {doc === "support" ? <SupportBody data={data} slug={slug} /> : null}
        </div>
      </div>
    </article>
  );
}

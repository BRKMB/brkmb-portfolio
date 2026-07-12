import type { ReactNode } from "react";
import type { ResumeData } from "@/types";
import { buildCvGenerationFooter } from "@/lib/cv-generation";
import { phoneToTel, toLinkedInUrl, toMailto, toWebsiteUrl } from "@/lib/cv-links";

const OFFICIAL_EMAIL = "hi@brkmb.com";

type Props = {
  resume: ResumeData;
  siteName: string;
  email: string;
  generatedAt?: Date;
};

function contactLineParts(resume: ResumeData, email: string) {
  const website = resume.website ?? "brkmb.com";
  const websiteUrl = toWebsiteUrl(website);
  const websiteLabel = website.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  const linkedInUrl = resume.linkedin ? toLinkedInUrl(resume.linkedin) : null;
  const linkedInLabel =
    resume.linkedin?.replace(/^https?:\/\//i, "").replace(/\/$/, "") ?? "";

  const parts: { type: "text" | "link"; value: string; href?: string }[] = [];
  const pushSep = () => parts.push({ type: "text", value: "   |   " });

  if (resume.location) parts.push({ type: "text", value: resume.location });
  if (resume.phone) {
    if (parts.length) pushSep();
    parts.push({ type: "link", value: resume.phone, href: phoneToTel(resume.phone) });
  }
  if (email) {
    if (parts.length) pushSep();
    parts.push({ type: "link", value: email, href: toMailto(email) });
  }
  if (websiteLabel) {
    if (parts.length) pushSep();
    parts.push({ type: "link", value: websiteLabel, href: websiteUrl });
  }
  if (linkedInUrl && linkedInLabel) {
    if (parts.length) pushSep();
    parts.push({ type: "link", value: linkedInLabel, href: linkedInUrl });
  }
  return { parts, websiteUrl, websiteLabel };
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="cv-section">
      <div className="cv-section-heading">
        <span className="cv-section-label">{title}</span>
        <span className="cv-section-rule" aria-hidden />
      </div>
      {children}
    </section>
  );
}

export function CvHtmlDocument({
  resume,
  siteName,
  email,
  generatedAt = new Date(),
}: Props) {
  const cvEmail = resume.cvEmail ?? email ?? OFFICIAL_EMAIL;
  const { parts: contactParts, websiteUrl, websiteLabel } = contactLineParts(resume, cvEmail);
  const competencyLines =
    resume.competencies?.length ? resume.competencies : [resume.skills.join(" · ")];
  const portfolioSuffix = resume.portfolioNote?.replace(
    /^Portfolio available at\s+\S+\s*—\s*/i,
    ""
  );

  return (
    <div className="cv-root">
      <style>{`
        .cv-root {
          box-sizing: border-box;
          width: 7.27in;
          margin: 0;
          padding: 0;
          background: #fff;
          color: #0d0d0d;
          font-family: "Times New Roman", Times, serif;
          font-size: 9.5pt;
          line-height: 1.42;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .cv-root * { box-sizing: border-box; }
        .cv-name {
          margin: 0 0 0.5pt;
          font-size: 26pt;
          font-weight: 700;
          color: #0a2240;
          letter-spacing: 0.3pt;
          text-transform: uppercase;
          line-height: 1.2;
        }
        .cv-headline {
          margin: 0 0 1.4pt;
          font-size: 10.5pt;
          font-weight: 700;
          color: #4a5568;
          line-height: 1.38;
        }
        .cv-contact {
          margin: 0 0 0;
          font-size: 9.5pt;
          color: #595959;
          line-height: 1.45;
        }
        .cv-contact a {
          color: #0563c1;
          text-decoration: underline;
        }
        .cv-section {
          margin-top: 7pt;
        }
        .cv-section-heading {
          display: flex;
          align-items: center;
          gap: 8pt;
          margin-bottom: 1pt;
        }
        .cv-section-label {
          font-size: 8pt;
          font-weight: 700;
          color: #1a4a8a;
          letter-spacing: 0.55pt;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .cv-section-rule {
          flex: 1;
          height: 1px;
          background: #c8d6e8;
        }
        .cv-body {
          margin: 0;
          font-size: 9.5pt;
          color: #0d0d0d;
          text-align: justify;
          line-height: 1.42;
        }
        .cv-competency-line {
          margin: 0 0 1.2pt;
          font-size: 9.5pt;
          line-height: 1.44;
        }
        .cv-job {
          margin-top: 6pt;
        }
        .cv-job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12pt;
          margin-bottom: 0.8pt;
          font-size: 9pt;
          font-weight: 700;
          color: #718096;
          line-height: 1.34;
        }
        .cv-job-title { flex: 1; }
        .cv-job-date { flex-shrink: 0; white-space: nowrap; }
        .cv-list {
          margin: 0;
          padding-left: 18pt;
          list-style-type: disc;
        }
        .cv-list li {
          margin-bottom: 1.8pt;
          font-size: 9.5pt;
          color: #0d0d0d;
          text-align: justify;
          line-height: 1.42;
        }
        .cv-school-line {
          margin: 0;
          font-size: 9.5pt;
          font-weight: 700;
          color: #1a4a8a;
          line-height: 1.38;
        }
        .cv-cert-line {
          margin: 0 0 1.8pt;
          font-size: 9.5pt;
          line-height: 1.42;
        }
        .cv-tool-line {
          margin: 0 0 1.2pt;
          font-size: 9.5pt;
          line-height: 1.42;
        }
        .cv-tool-line strong { font-weight: 700; }
        .cv-portfolio {
          margin-top: 7pt;
          font-size: 9.5pt;
          color: #595959;
          line-height: 1.42;
        }
        .cv-portfolio a {
          color: #0563c1;
          text-decoration: underline;
        }
      `}</style>

      <h1 className="cv-name">{siteName.toUpperCase()}</h1>
      <p className="cv-headline">{resume.title}</p>
      <p className="cv-contact">
        {contactParts.map((part, index) =>
          part.type === "link" && part.href ? (
            <a key={`${part.href}-${index}`} href={part.href}>
              {part.value}
            </a>
          ) : (
            <span key={`${part.value}-${index}`}>{part.value}</span>
          )
        )}
      </p>

      <Section title="Professional Summary">
        <p className="cv-body">{resume.summary}</p>
      </Section>

      <Section title="Core Competencies">
        {competencyLines.map((line) => (
          <p key={line} className="cv-competency-line">
            {line.replace(/\s·\s/g, "   ·   ")}
          </p>
        ))}
      </Section>

      <Section title="Professional Experience">
        {resume.experience.map((exp) => (
          <div key={`${exp.period}-${exp.role}`} className="cv-job">
            <div className="cv-job-header">
              <span className="cv-job-title">
                {exp.role} · {exp.company}
              </span>
              <span className="cv-job-date">{exp.period}</span>
            </div>
            {exp.highlights?.length ? (
              <ul className="cv-list">
                {exp.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="cv-body">{exp.description}</p>
            )}
          </div>
        ))}
      </Section>

      <Section title="Education">
        <div className="cv-job-header">
          <span className="cv-job-title">{resume.education.degree}</span>
          {resume.education.graduated ? (
            <span className="cv-job-date">{resume.education.graduated}</span>
          ) : null}
        </div>
        <p className="cv-school-line">
          {resume.education.school}
          {resume.education.gpa ? `   ·   GPA: ${resume.education.gpa}` : ""}
        </p>
      </Section>

      {resume.certifications?.length ? (
        <Section title="Certifications">
          {resume.certifications.map((cert) => (
            <p key={cert} className="cv-cert-line">
              • {cert}
            </p>
          ))}
        </Section>
      ) : null}

      {resume.tools?.length ? (
        <Section title="Tools & Software">
          {resume.tools.map((group) => (
            <p key={group.category} className="cv-tool-line">
              <strong>{group.category}:</strong> {group.items.join("   ·   ")}
            </p>
          ))}
        </Section>
      ) : null}

      {resume.languages?.length ? (
        <Section title="Languages">
          <p className="cv-body">{resume.languages.join("   ·   ")}</p>
        </Section>
      ) : null}

      {resume.portfolioNote ? (
        <p className="cv-portfolio">
          Portfolio available at{" "}
          <a href={websiteUrl}>{websiteLabel}</a>
          {" — "}
          {portfolioSuffix}
        </p>
      ) : null}

      <span className="cv-gen-meta" style={{ display: "none" }}>
        {buildCvGenerationFooter(generatedAt, websiteLabel)}
      </span>
    </div>
  );
}

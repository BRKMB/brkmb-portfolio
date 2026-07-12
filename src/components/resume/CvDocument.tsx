import { Document, Link, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import type { ResumeData } from "@/types";
import { buildCvGenerationFooter } from "@/lib/cv-generation";
import { phoneToTel, toLinkedInUrl, toMailto, toWebsiteUrl } from "@/lib/cv-links";

const ink = "#1a1a1a";
const muted = "#333333";
const faint = "#555555";
const rule = "#bdbdbd";
const linkBlue = "#1155cc";

const s = StyleSheet.create({
  page: {
    paddingTop: 42,
    paddingBottom: 58,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: ink,
    lineHeight: 1.42,
  },
  name: {
    fontSize: 19,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  headline: {
    fontSize: 9.5,
    color: muted,
    marginBottom: 7,
    lineHeight: 1.38,
  },
  contact: {
    fontSize: 8.75,
    color: faint,
    marginBottom: 16,
    lineHeight: 1.5,
  },
  link: {
    color: linkBlue,
    textDecoration: "underline",
  },
  section: {
    marginTop: 11,
    marginBottom: 1,
  },
  sectionTitle: {
    fontSize: 8.75,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.85,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  sectionRule: {
    height: 0.75,
    backgroundColor: rule,
    marginBottom: 8,
  },
  body: {
    fontSize: 9.5,
    color: ink,
    lineHeight: 1.46,
    textAlign: "justify",
  },
  competencyLine: {
    fontSize: 9.25,
    color: ink,
    lineHeight: 1.48,
    marginBottom: 4,
  },
  expBlock: {
    marginBottom: 11,
  },
  expHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 5,
  },
  expHeader: {
    flex: 1,
    fontSize: 9.75,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.35,
  },
  expPeriod: {
    flexShrink: 0,
    fontSize: 8.75,
    color: faint,
    lineHeight: 1.35,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3.5,
    paddingRight: 2,
  },
  bulletMark: {
    width: 11,
    fontSize: 9.25,
    lineHeight: 1.46,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.25,
    color: ink,
    lineHeight: 1.46,
    textAlign: "justify",
  },
  certLine: {
    fontSize: 9.25,
    marginBottom: 3,
    lineHeight: 1.38,
  },
  toolLine: {
    fontSize: 9.25,
    color: ink,
    lineHeight: 1.42,
    marginBottom: 5,
  },
  toolCategory: {
    fontFamily: "Helvetica-Bold",
  },
  portfolioNote: {
    marginTop: 12,
    fontSize: 8.75,
    color: muted,
    lineHeight: 1.42,
  },
  genFooter: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    fontSize: 6,
    color: "#c4c4c4",
    textAlign: "center",
    letterSpacing: 0.12,
  },
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.sectionRule} />
      {children}
    </View>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item) => (
        <View key={item} style={s.bulletRow}>
          <Text style={s.bulletMark}>•</Text>
          <Text style={s.bulletText}>{item}</Text>
        </View>
      ))}
    </>
  );
}

function ContactLine({
  location,
  phone,
  email,
  website,
  linkedin,
}: {
  location?: string;
  phone?: string;
  email: string;
  website?: string;
  linkedin?: string;
}) {
  const site = website ?? "brkmb.com";
  const siteUrl = toWebsiteUrl(site);
  const siteLabel = site.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  const linkedInUrl = linkedin ? toLinkedInUrl(linkedin) : null;
  const linkedInLabel = linkedin?.replace(/^https?:\/\//i, "").replace(/\/$/, "") ?? "";

  return (
    <Text style={s.contact}>
      {location ? <>{location}  |  </> : null}
      {phone ? (
        <>
          <Link src={phoneToTel(phone)} style={s.link}>
            {phone}
          </Link>
          {"  |  "}
        </>
      ) : null}
      <Link src={toMailto(email)} style={s.link}>
        {email}
      </Link>
      {"  |  "}
      <Link src={siteUrl} style={s.link}>
        {siteLabel}
      </Link>
      {linkedInUrl ? (
        <>
          {"  |  "}
          <Link src={linkedInUrl} style={s.link}>
            {linkedInLabel}
          </Link>
        </>
      ) : null}
    </Text>
  );
}

export function CvDocument({
  resume,
  siteName,
  email,
  generatedAt = new Date(),
}: {
  resume: ResumeData;
  siteName: string;
  email: string;
  generatedAt?: Date;
}) {
  const cvEmail = resume.cvEmail ?? email;
  const website = resume.website ?? "brkmb.com";
  const websiteUrl = toWebsiteUrl(website);
  const websiteLabel = website.replace(/^https?:\/\//i, "").replace(/\/$/, "");

  const competencyLines =
    resume.competencies?.length ? resume.competencies : [resume.skills.join(" · ")];

  const footerSite = websiteLabel;

  return (
    <Document title={`${siteName} — CV`} author={siteName}>
      <Page size="A4" style={s.page} wrap>
        <Text style={s.name}>{siteName.toUpperCase()}</Text>
        <Text style={s.headline}>{resume.title}</Text>

        <ContactLine
          location={resume.location}
          phone={resume.phone}
          email={cvEmail}
          website={website}
          linkedin={resume.linkedin}
        />

        <Section title="Professional Summary">
          <Text style={s.body}>{resume.summary}</Text>
        </Section>

        <Section title="Core Competencies">
          {competencyLines.map((line) => (
            <Text key={line} style={s.competencyLine}>
              {line.replace(/\s·\s/g, "   ·   ")}
            </Text>
          ))}
        </Section>

        <Section title="Professional Experience">
          {resume.experience.map((exp) => (
            <View key={`${exp.period}-${exp.role}`} style={s.expBlock} wrap={false}>
              <View style={s.expHeaderRow}>
                <Text style={s.expHeader}>
                  {exp.role} · {exp.company}
                </Text>
                <Text style={s.expPeriod}>{exp.period}</Text>
              </View>
              {exp.highlights?.length ? (
                <Bullets items={exp.highlights} />
              ) : (
                <Text style={s.body}>{exp.description}</Text>
              )}
            </View>
          ))}
        </Section>

        <Section title="Education">
          <View style={s.expHeaderRow}>
            <Text style={s.expHeader}>{resume.education.degree}</Text>
            {resume.education.graduated ? (
              <Text style={s.expPeriod}>{resume.education.graduated}</Text>
            ) : null}
          </View>
          <Text style={s.body}>
            {resume.education.school}
            {resume.education.gpa ? `   ·   GPA: ${resume.education.gpa}` : ""}
          </Text>
        </Section>

        {resume.certifications?.length ? (
          <Section title="Certifications">
            {resume.certifications.map((cert) => (
              <View key={cert} style={s.bulletRow}>
                <Text style={s.bulletMark}>•</Text>
                <Text style={s.bulletText}>{cert}</Text>
              </View>
            ))}
          </Section>
        ) : null}

        {resume.tools?.length ? (
          <Section title="Tools & Software">
            {resume.tools.map((group) => (
              <Text key={group.category} style={s.toolLine}>
                <Text style={s.toolCategory}>{group.category}: </Text>
                {group.items.join("   ·   ")}
              </Text>
            ))}
          </Section>
        ) : null}

        {resume.languages?.length ? (
          <Section title="Languages">
            <Text style={s.body}>{resume.languages.join("   ·   ")}</Text>
          </Section>
        ) : null}

        {resume.portfolioNote ? (
          <Text style={s.portfolioNote}>
            Portfolio available at{" "}
            <Link src={websiteUrl} style={s.link}>
              {websiteLabel}
            </Link>
            {" — "}
            {resume.portfolioNote.replace(/^Portfolio available at\s+\S+\s*—\s*/i, "")}
          </Text>
        ) : null}

        <Text style={s.genFooter} fixed>
          {buildCvGenerationFooter(generatedAt, footerSite)}
        </Text>
      </Page>
    </Document>
  );
}

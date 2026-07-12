import { Document, Link, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import type { ResumeData } from "@/types";
import { buildCvGenerationFooter } from "@/lib/cv-generation";
import { phoneToTel, toLinkedInUrl, toMailto, toWebsiteUrl } from "@/lib/cv-links";

const OFFICIAL_EMAIL = "hi@brkmb.com";

/** Extracted from Baher_Magally_PG_Resume2.docx */
const palette = {
  name: "#0A2240",
  headline: "#4A5568",
  contact: "#595959",
  body: "#0D0D0D",
  sectionTitle: "#1A4A8A",
  sectionRule: "#C8D6E8",
  jobHeader: "#718096",
  school: "#1A4A8A",
  link: "#0563C1",
  footer: "#C4C4C4",
} as const;

const s = StyleSheet.create({
  page: {
    paddingTop: 46,
    paddingBottom: 62,
    paddingHorizontal: 54,
    fontFamily: "Times-Roman",
    fontSize: 9.5,
    color: palette.body,
  },
  headerBlock: {
    marginBottom: 4,
  },
  nameBlock: {
    paddingBottom: 12,
  },
  name: {
    fontSize: 26,
    fontFamily: "Times-Bold",
    color: palette.name,
    letterSpacing: 0.3,
    textTransform: "uppercase",
    lineHeight: 1.2,
  },
  headlineBlock: {
    paddingBottom: 10,
  },
  headline: {
    fontSize: 10.5,
    fontFamily: "Times-Bold",
    color: palette.headline,
    lineHeight: 1.45,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 18,
  },
  contactPlain: {
    fontSize: 9.5,
    color: palette.contact,
    lineHeight: 1.45,
  },
  contactSep: {
    fontSize: 9.5,
    color: palette.contact,
    lineHeight: 1.45,
  },
  linkText: {
    fontSize: 9.5,
    color: palette.link,
    textDecoration: "underline",
    lineHeight: 1.45,
  },
  sectionWrap: {
    marginTop: 13,
    marginBottom: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 2,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Times-Bold",
    color: palette.sectionTitle,
    letterSpacing: 0.55,
    textTransform: "uppercase",
  },
  sectionRuleLine: {
    flex: 1,
    height: 1,
    backgroundColor: palette.sectionRule,
    marginLeft: 8,
  },
  body: {
    fontSize: 9.5,
    color: palette.body,
    lineHeight: 1.42,
    textAlign: "justify",
  },
  competencyLine: {
    fontSize: 9.5,
    color: palette.body,
    lineHeight: 1.44,
    marginBottom: 3,
  },
  expBlock: {
    marginBottom: 10,
  },
  expHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
    paddingBottom: 1,
  },
  expHeader: {
    flex: 1,
    fontSize: 9,
    fontFamily: "Times-Bold",
    color: palette.jobHeader,
    lineHeight: 1.34,
  },
  expPeriod: {
    flexShrink: 0,
    fontSize: 9,
    fontFamily: "Times-Bold",
    color: palette.jobHeader,
    lineHeight: 1.34,
  },
  schoolLine: {
    fontSize: 9.5,
    fontFamily: "Times-Bold",
    color: palette.school,
    lineHeight: 1.38,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3,
    paddingRight: 4,
  },
  bulletMark: {
    width: 10,
    fontSize: 9.5,
    lineHeight: 1.42,
    color: palette.body,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: palette.body,
    lineHeight: 1.42,
    textAlign: "justify",
  },
  toolLine: {
    fontSize: 9.5,
    color: palette.body,
    lineHeight: 1.4,
    marginBottom: 4,
  },
  toolCategory: {
    fontFamily: "Times-Bold",
  },
  portfolioNote: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  genFooter: {
    position: "absolute",
    bottom: 26,
    left: 54,
    right: 54,
    fontSize: 6,
    color: palette.footer,
    textAlign: "center",
    letterSpacing: 0.1,
  },
});

function CvLink({ href, label }: { href: string; label: string }) {
  return (
    <Link src={href}>
      <Text style={s.linkText}>{label}</Text>
    </Link>
  );
}

function ContactSep() {
  return <Text style={s.contactSep}>{"  |  "}</Text>;
}

function ContactRow({
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

  const items: ReactNode[] = [];

  if (location) {
    items.push(<Text key="loc" style={s.contactPlain}>{location}</Text>);
  }
  if (phone) {
    if (items.length) items.push(<ContactSep key="sep-phone" />);
    items.push(<CvLink key="phone" href={phoneToTel(phone)} label={phone} />);
  }
  if (email) {
    if (items.length) items.push(<ContactSep key="sep-email" />);
    items.push(<CvLink key="email" href={toMailto(email)} label={email} />);
  }
  if (siteLabel) {
    if (items.length) items.push(<ContactSep key="sep-site" />);
    items.push(<CvLink key="site" href={siteUrl} label={siteLabel} />);
  }
  if (linkedInUrl && linkedInLabel) {
    if (items.length) items.push(<ContactSep key="sep-li" />);
    items.push(<CvLink key="linkedin" href={linkedInUrl} label={linkedInLabel} />);
  }

  return <View style={s.contactRow}>{items}</View>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={s.sectionWrap}>
      <View style={s.sectionHeaderRow}>
        <Text style={s.sectionTitle}>{title}</Text>
        <View style={s.sectionRuleLine} />
      </View>
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

function portfolioSuffix(note: string): string {
  return note.replace(/^Portfolio available at\s+\S+\s*—\s*/i, "").trim();
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
  const cvEmail = resume.cvEmail ?? email ?? OFFICIAL_EMAIL;
  const website = resume.website ?? "brkmb.com";
  const websiteUrl = toWebsiteUrl(website);
  const websiteLabel = website.replace(/^https?:\/\//i, "").replace(/\/$/, "");

  const competencyLines =
    resume.competencies?.length ? resume.competencies : [resume.skills.join(" · ")];

  return (
    <Document title={`${siteName} — CV`} author={siteName}>
      <Page size="A4" style={s.page} wrap>
        <View style={s.headerBlock}>
          <View style={s.nameBlock}>
            <Text style={s.name}>{siteName.toUpperCase()}</Text>
          </View>
          <View style={s.headlineBlock}>
            <Text style={s.headline}>{resume.title}</Text>
          </View>
        </View>

        <ContactRow
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
          <Text style={s.schoolLine}>
            {resume.education.school}
            {resume.education.gpa ? `   ·   GPA: ${resume.education.gpa}` : ""}
          </Text>
        </Section>

        {resume.certifications?.length ? (
          <Section title="Certifications">
            {resume.certifications.map((cert) => (
              <Text key={cert} style={[s.body, { marginBottom: 3, textAlign: "left" }]}>
                • {cert}
              </Text>
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
          <View style={s.portfolioNote}>
            <Text style={s.contactPlain}>Portfolio available at </Text>
            <CvLink href={websiteUrl} label={websiteLabel} />
            <Text style={s.contactPlain}> — {portfolioSuffix(resume.portfolioNote)}</Text>
          </View>
        ) : null}

        <Text style={s.genFooter} fixed>
          {buildCvGenerationFooter(generatedAt, websiteLabel)}
        </Text>
      </Page>
    </Document>
  );
}

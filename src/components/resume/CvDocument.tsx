import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import type { ResumeData } from "@/types";
import { buildCvGenerationFooter } from "@/lib/cv-generation";

const ink = "#1a1a1a";
const muted = "#444444";
const faint = "#777777";
const rule = "#cccccc";

const s = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 52,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 9.25,
    color: ink,
    lineHeight: 1.45,
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headline: {
    fontSize: 9.5,
    color: muted,
    marginBottom: 6,
    lineHeight: 1.35,
  },
  contact: {
    fontSize: 8.5,
    color: faint,
    marginBottom: 14,
    lineHeight: 1.4,
  },
  section: {
    marginTop: 12,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.9,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sectionRule: {
    height: 1,
    backgroundColor: rule,
    marginBottom: 7,
  },
  body: {
    fontSize: 9.25,
    color: ink,
    lineHeight: 1.48,
    textAlign: "justify",
  },
  competencyLine: {
    fontSize: 9,
    color: ink,
    lineHeight: 1.42,
    marginBottom: 3,
  },
  expHeader: {
    fontSize: 9.75,
    fontFamily: "Helvetica-Bold",
    marginBottom: 1,
  },
  expPeriod: {
    fontSize: 8.5,
    color: faint,
    marginBottom: 4,
  },
  bullet: {
    fontSize: 9.1,
    color: ink,
    lineHeight: 1.44,
    marginBottom: 3,
    paddingLeft: 8,
  },
  bulletPrefix: {
    fontFamily: "Helvetica",
  },
  certLine: {
    fontSize: 9,
    marginBottom: 2.5,
    lineHeight: 1.35,
  },
  toolCategory: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  toolItems: {
    fontSize: 9,
    color: muted,
    marginBottom: 6,
    lineHeight: 1.35,
  },
  portfolioNote: {
    marginTop: 10,
    fontSize: 8.5,
    color: muted,
    lineHeight: 1.35,
  },
  genFooter: {
    position: "absolute",
    bottom: 22,
    left: 44,
    right: 44,
    fontSize: 6.25,
    color: "#b8b8b8",
    textAlign: "center",
    letterSpacing: 0.15,
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
        <Text key={item} style={s.bullet}>
          • {item}
        </Text>
      ))}
    </>
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
  const contactParts = [
    resume.location,
    resume.phone,
    email,
    resume.website ?? "brkmb.com",
    resume.linkedin,
  ].filter(Boolean);

  const competencyLines =
    resume.competencies?.length ? resume.competencies : [resume.skills.join(" · ")];

  const educationLine = [
    resume.education.degree,
    resume.education.graduated,
    resume.education.gpa ? `GPA: ${resume.education.gpa}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Document title={`${siteName} — CV`} author={siteName}>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{siteName.toUpperCase()}</Text>
        <Text style={s.headline}>
          {resume.title ?? "Graphic Designer — Print Production & Color Quality Consistency"}
        </Text>
        <Text style={s.contact}>{contactParts.join("  |  ")}</Text>

        <Section title="Professional Summary">
          <Text style={s.body}>{resume.summary}</Text>
        </Section>

        <Section title="Core Competencies">
          {competencyLines.map((line) => (
            <Text key={line} style={s.competencyLine}>
              {line}
            </Text>
          ))}
        </Section>

        <Section title="Professional Experience">
          {resume.experience.map((exp) => (
            <View key={`${exp.period}-${exp.role}`} style={{ marginBottom: 8 }}>
              <Text style={s.expHeader}>
                {exp.role} · {exp.company}
              </Text>
              <Text style={s.expPeriod}>{exp.period}</Text>
              {exp.highlights?.length ? (
                <Bullets items={exp.highlights} />
              ) : (
                <Text style={s.body}>{exp.description}</Text>
              )}
            </View>
          ))}
        </Section>

        <Section title="Education">
          <Text style={s.expHeader}>{resume.education.school}</Text>
          <Text style={s.body}>{educationLine}</Text>
        </Section>

        {resume.certifications?.length ? (
          <Section title="Certifications">
            {resume.certifications.map((cert) => (
              <Text key={cert} style={s.certLine}>
                {cert}
              </Text>
            ))}
          </Section>
        ) : null}

        {resume.tools?.length ? (
          <Section title="Tools & Software">
            {resume.tools.map((group) => (
              <View key={group.category}>
                <Text style={s.toolCategory}>{group.category}:</Text>
                <Text style={s.toolItems}>{group.items.join(" · ")}</Text>
              </View>
            ))}
          </Section>
        ) : null}

        {resume.languages?.length ? (
          <Section title="Languages">
            <Text style={s.body}>{resume.languages.join("  ·  ")}</Text>
          </Section>
        ) : null}

        {resume.portfolioNote ? (
          <Text style={s.portfolioNote}>{resume.portfolioNote}</Text>
        ) : null}

        <Text style={s.genFooter} fixed>
          {buildCvGenerationFooter(generatedAt, resume.website ?? "brkmb.com")}
        </Text>
      </Page>
    </Document>
  );
}

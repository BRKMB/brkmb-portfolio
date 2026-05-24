import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "@/types";

const s = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    backgroundColor: "#fafafa",
  },
  accentBar: {
    height: 4,
    backgroundColor: "#c9f31d",
    marginBottom: 28,
    borderRadius: 2,
  },
  name: { fontSize: 26, fontWeight: 700, letterSpacing: -0.5, marginBottom: 4 },
  tagline: { fontSize: 11, color: "#555", marginBottom: 6 },
  contact: { fontSize: 9, color: "#666", marginBottom: 20 },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#6b8e00",
    marginTop: 18,
    marginBottom: 8,
  },
  body: { fontSize: 10, lineHeight: 1.55, color: "#333" },
  skillWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 },
  skill: {
    fontSize: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#eef5d6",
    borderRadius: 4,
    color: "#2d3a00",
  },
  expBlock: { marginBottom: 12 },
  expPeriod: { fontSize: 8, color: "#6b8e00", marginBottom: 2 },
  expRole: { fontSize: 11, fontWeight: 700, marginBottom: 2 },
  expCompany: { fontSize: 9, color: "#555", marginBottom: 4 },
  footer: {
    position: "absolute",
    bottom: 36,
    left: 48,
    right: 48,
    fontSize: 8,
    color: "#999",
    textAlign: "center",
  },
});

export function CvDocument({
  resume,
  siteName,
  email,
}: {
  resume: ResumeData;
  siteName: string;
  email: string;
}) {
  return (
    <Document title={`${siteName} — CV`} author={siteName}>
      <Page size="A4" style={s.page}>
        <View style={s.accentBar} />
        <Text style={s.name}>{siteName}</Text>
        <Text style={s.tagline}>Founder · Product Builder · Graphic Designer</Text>
        <Text style={s.contact}>
          {email} · brkmb.com
        </Text>

        <Text style={s.sectionTitle}>Profile</Text>
        <Text style={s.body}>{resume.summary}</Text>

        <Text style={s.sectionTitle}>Education</Text>
        <Text style={s.expRole}>{resume.education.school}</Text>
        <Text style={s.expCompany}>{resume.education.degree}</Text>

        <Text style={s.sectionTitle}>Skills</Text>
        <View style={s.skillWrap}>
          {resume.skills.map((skill) => (
            <Text key={skill} style={s.skill}>
              {skill}
            </Text>
          ))}
        </View>

        <Text style={s.sectionTitle}>Experience</Text>
        {resume.experience.map((exp) => (
          <View key={exp.period} style={s.expBlock}>
            <Text style={s.expPeriod}>{exp.period}</Text>
            <Text style={s.expRole}>{exp.role}</Text>
            <Text style={s.expCompany}>{exp.company}</Text>
            <Text style={s.body}>{exp.description}</Text>
          </View>
        ))}

        <Text style={s.footer}>Generated from brkmb.com · {new Date().getFullYear()}</Text>
      </Page>
    </Document>
  );
}

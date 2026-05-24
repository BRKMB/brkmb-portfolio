"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/data";
import { useResume } from "@/components/providers/CmsProvider";
import { DownloadCvButton } from "@/components/resume/DownloadCvButton";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";

export default function ResumePage() {
  const resume = useResume();

  return (
    <div className="min-h-screen px-4 pt-32 pb-20 md:px-8">
      <div className="mx-auto max-w-3xl">
        <PageHeader title="Resume / CV" subtitle={resume.summary} backLabel="← Home" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <DownloadCvButton resume={resume} className="btn-primary text-subheadline inline-flex min-h-[44px] items-center justify-center rounded-full px-6 py-3" />
          <Button href={`mailto:${site.email}`} variant="ghost" external>
            Email me
          </Button>
        </motion.div>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-14"
        >
          <h2 className="text-caption text-accent tracking-[0.2em] uppercase">Education</h2>
          <div className="glass-card mt-4 p-6">
            <h3 className="font-display text-title-3 v-primary">{resume.education.school}</h3>
            <p className="text-subheadline mt-1 v-secondary">{resume.education.degree}</p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-10"
        >
          <h2 className="text-caption text-accent tracking-[0.2em] uppercase">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {resume.skills.map((skill) => (
              <span key={skill} className="chip-glass text-subheadline v-secondary px-4 py-2">
                {skill}
              </span>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-10"
        >
          <h2 className="text-caption text-accent tracking-[0.2em] uppercase">Experience</h2>
          <div className="glass-sheet mt-6 space-y-8 p-8">
            {resume.experience.map((exp) => (
              <div key={exp.period} className="relative border-l border-white/10 pl-6">
                <span className="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full bg-[#c9f31d]" />
                <p className="text-footnote text-accent">{exp.period}</p>
                <h3 className="font-display text-headline mt-1 v-primary">{exp.role}</h3>
                <p className="text-subheadline v-secondary">{exp.company}</p>
                <p className="text-subheadline mt-2 v-tertiary">{exp.description}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

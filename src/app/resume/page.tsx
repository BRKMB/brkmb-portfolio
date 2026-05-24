"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { resume, site } from "@/lib/data";
import { Button } from "@/components/ui/Button";

export default function ResumePage() {
  return (
    <div className="min-h-screen px-4 pt-28 pb-20 md:px-8">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300">
            ← Back home
          </Link>

          <h1 className="mt-8 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Resume / CV
          </h1>
          <p className="mt-4 text-lg text-white/50">{resume.summary}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={resume.cvDownloadUrl} external>
              Download CV
            </Button>
            <Button href={`mailto:${site.email}`} variant="ghost" external>
              Email me
            </Button>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-16"
        >
          <h2 className="text-sm tracking-[0.2em] text-indigo-400 uppercase">Education</h2>
          <div className="glass gradient-border mt-4 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white">{resume.education.school}</h3>
            <p className="mt-1 text-white/50">{resume.education.degree}</p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-12"
        >
          <h2 className="text-sm tracking-[0.2em] text-indigo-400 uppercase">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {resume.skills.map((skill) => (
              <span
                key={skill}
                className="glass rounded-full border border-white/10 px-4 py-2 text-sm text-white/70"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-12"
        >
          <h2 className="text-sm tracking-[0.2em] text-indigo-400 uppercase">Experience</h2>
          <div className="mt-6 space-y-6 border-l border-white/10 pl-8">
            {resume.experience.map((exp) => (
              <div key={exp.period} className="relative">
                <span className="absolute top-1 -left-[37px] h-3 w-3 rounded-full bg-indigo-500" />
                <p className="text-sm text-indigo-400">{exp.period}</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{exp.role}</h3>
                <p className="text-white/60">{exp.company}</p>
                <p className="mt-2 text-white/45">{exp.description}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

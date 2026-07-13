"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { IconType } from "react-icons";
import {
  HiAcademicCap,
  HiArrowPath,
  HiBriefcase,
  HiBuildingStorefront,
  HiGlobeAlt,
  HiLightBulb,
  HiMagnifyingGlassCircle,
  HiMapPin,
  HiOutlineEnvelope,
  HiPaintBrush,
  HiPrinter,
  HiRocketLaunch,
  HiShieldCheck,
  HiSparkles,
  HiTrophy,
  HiUser,
  HiWrenchScrewdriver,
} from "react-icons/hi2";
import { about, site } from "@/lib/data";
import { useResume } from "@/components/providers/CmsProvider";
import { DownloadCvButton } from "@/components/resume/DownloadCvButton";
import { Button } from "@/components/ui/Button";
import { CV_PDF_URL } from "@/lib/cv-generation";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

const aboutBlocks = [
  { label: "Background", text: about.who, icon: HiUser },
  { label: "Products", text: about.build, icon: HiRocketLaunch },
  { label: "Principle", text: about.believe, icon: HiLightBulb },
  { label: "Process", text: about.process, icon: HiArrowPath },
] as const;

const roleIcons: Record<string, IconType> = {
  "Graphic Designer": HiPaintBrush,
  Founder: HiBuildingStorefront,
  "Print Production": HiPrinter,
  "Visual QA": HiMagnifyingGlassCircle,
};

function SectionHeading({
  icon: Icon,
  title,
  action,
  className,
}: {
  icon: IconType;
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="flex items-center gap-3.5">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-subtle bg-[var(--accent-subtle-bg)] text-accent"
          aria-hidden
        >
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="font-display text-title-2 v-primary tracking-tight">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease },
  };
}

export function ResumePageContent() {
  const resume = useResume();

  return (
    <div className="min-h-screen px-5 pt-32 pb-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-subtle pb-12">
          <Link href="/" className="text-subheadline text-accent transition hover:opacity-80">
            ← Home
          </Link>

          <motion.div {...fadeUp(0.05)} className="mt-8 max-w-3xl">
            <p className="text-caption tracking-[0.28em] uppercase text-accent">Resume & About</p>
            <h1 className="font-display text-large-title mt-4 uppercase v-primary">{site.name}</h1>
            {resume.title ? (
              <p className="text-headline mt-4 v-primary leading-snug">{resume.title}</p>
            ) : null}
            <p className="text-body mt-5 v-secondary leading-relaxed">{resume.summary}</p>
            {resume.location ? (
              <p className="text-footnote mt-4 inline-flex items-center gap-2 v-tertiary uppercase tracking-[0.14em]">
                <HiMapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                {resume.location}
              </p>
            ) : null}
            {resume.cvRevisionLabel ? (
              <p className="text-footnote mt-3 v-tertiary">
                Last CV update:{" "}
                <span className="v-secondary">{resume.cvRevisionLabel}</span>
              </p>
            ) : null}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.6 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <DownloadCvButton className="btn-primary text-subheadline inline-flex min-h-[44px] items-center justify-center rounded-full px-6 py-3" />
            <Button href={`mailto:${site.email}`} variant="ghost">
              <HiOutlineEnvelope className="mr-2 h-4 w-4" aria-hidden />
              Email me
            </Button>
            <p className="text-caption v-quaternary max-w-sm leading-relaxed sm:ml-1">
              Shareable link (opens in a new tab):{" "}
              <a
                href={CV_PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-2 hover:underline"
              >
                {CV_PDF_URL.replace(/^https:\/\//, "")}
              </a>
            </p>
          </motion.div>

          {site.stats?.length ? (
            <motion.div
              {...fadeUp(0.18)}
              className="mt-10 grid max-w-xl grid-cols-3 gap-3 sm:gap-4"
            >
              {site.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card rounded-2xl px-4 py-4 text-center !rounded-[16px]"
                >
                  <p className="font-display text-title-1 v-primary tabular-nums">
                    {stat.value}
                    <span className="text-accent">{stat.suffix}</span>
                  </p>
                  <p className="text-footnote mt-1 v-tertiary uppercase tracking-[0.12em]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          ) : null}
        </header>

        <section className="mt-16 lg:mt-20">
          <SectionHeading icon={HiUser} title="About" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
            <div className="glass-sheet space-y-5 p-6 md:p-8">
              {aboutBlocks.map((block, i) => {
                const Icon = block.icon;
                return (
                  <motion.div
                    key={block.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.5, ease }}
                    className="flex gap-4"
                  >
                    <span
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-subtle-bg)] text-accent"
                      aria-hidden
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="text-body v-secondary leading-relaxed">
                      <span className="font-display text-headline v-primary">{block.label}. </span>
                      {block.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {about.roles.map((role, i) => {
                const Icon = roleIcons[role.title] ?? HiUser;
                return (
                  <motion.div
                    key={role.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5, ease }}
                    className={cn(
                      "glass-card p-5 !rounded-[16px]",
                      role.title === "Graphic Designer" && "ring-1 ring-accent/20"
                    )}
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-subtle-bg)] text-accent"
                      aria-hidden
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="font-display text-headline mt-3 v-primary">{role.title}</h3>
                    <p className="text-subheadline mt-2 v-tertiary leading-relaxed">{role.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {resume.achievements?.length ? (
          <section className="mt-16 lg:mt-20">
            <SectionHeading icon={HiTrophy} title="Key achievements" />
            <ul className="mt-8 grid gap-4 md:grid-cols-1">
              {resume.achievements.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5, ease }}
                  className="glass-card flex gap-4 p-5 md:p-6 !rounded-[16px]"
                >
                  <span className="font-display text-footnote mt-0.5 shrink-0 tabular-nums text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-body v-secondary leading-relaxed">{item}</p>
                </motion.li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-16 lg:mt-20">
          <SectionHeading icon={HiBriefcase} title="Experience" />
          <div className="resume-timeline mt-8">
            {resume.experience.map((exp, i) => (
              <motion.article
                key={exp.period + exp.role}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5, ease }}
                className="resume-timeline__item"
              >
                <div className="resume-timeline__marker" aria-hidden />
                <div className="glass-card p-5 md:p-6 !rounded-[16px]">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 gap-y-1">
                    <h3 className="font-display text-title-3 v-primary">{exp.role}</h3>
                    <p className="text-footnote shrink-0 text-accent uppercase tracking-[0.12em]">
                      {exp.period}
                    </p>
                  </div>
                  <p className="text-subheadline mt-1 v-secondary">{exp.company}</p>
                  {exp.highlights?.length ? (
                    <ul className="text-subheadline mt-3 list-none space-y-2 v-tertiary">
                      {exp.highlights.map((item) => (
                        <li key={item} className="flex gap-2 leading-relaxed">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-subheadline mt-3 v-tertiary leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {resume.featuredProject ? (
          <section className="mt-16 lg:mt-20">
            <SectionHeading icon={HiSparkles} title="Featured project" />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease }}
              className="glass-card mt-8 p-6 md:p-8 !rounded-[20px]"
            >
              <h3 className="font-display text-title-2 v-primary">{resume.featuredProject.name}</h3>
              <p className="text-body mt-4 max-w-3xl v-secondary leading-relaxed">
                {resume.featuredProject.description}
              </p>
              <Link
                href="/projects/BARYQ/"
                className="text-subheadline mt-5 inline-flex items-center gap-1 text-accent transition hover:opacity-80"
              >
                View case study →
              </Link>
            </motion.div>
          </section>
        ) : null}

        <section className="mt-16 lg:mt-20">
          <SectionHeading icon={HiWrenchScrewdriver} title="Core competencies" />
          <div className="glass-sheet mt-8 space-y-3 p-5 md:p-6">
            {(resume.competencies ?? []).map((line) => (
              <p key={line} className="text-subheadline v-secondary leading-relaxed">
                {line}
              </p>
            ))}
            {!resume.competencies?.length ? (
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="chip-glass text-subheadline v-secondary rounded-full px-4 py-2"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {resume.tools?.length ? (
          <section className="mt-16 lg:mt-20">
            <SectionHeading icon={HiWrenchScrewdriver} title="Tools & software" />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {resume.tools.map((group) => (
                <div key={group.category} className="glass-card p-5 !rounded-[16px]">
                  <h3 className="font-display text-headline v-primary">{group.category}</h3>
                  <p className="text-subheadline mt-3 v-secondary leading-relaxed">
                    {group.items.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-2 lg:gap-8">
          <section>
            <SectionHeading icon={HiAcademicCap} title="Education" />
            <div className="glass-card mt-8 p-6 !rounded-[16px]">
              <h3 className="font-display text-title-3 v-primary">{resume.education.school}</h3>
              <p className="text-subheadline mt-2 v-secondary leading-relaxed">
                {resume.education.degree}
              </p>
              {resume.education.graduated || resume.education.gpa ? (
                <p className="text-footnote mt-2 v-tertiary">
                  {[resume.education.graduated, resume.education.gpa ? `GPA ${resume.education.gpa}` : null]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              ) : null}
            </div>
          </section>

          <section>
            <SectionHeading
              icon={HiShieldCheck}
              title="Certifications"
              action={
                <Link
                  href="/certificates/"
                  className="text-footnote shrink-0 text-accent transition hover:opacity-80"
                >
                  View all →
                </Link>
              }
            />
            <ul className="mt-8 space-y-3">
              {(resume.certifications ?? []).map((cert) => (
                <li key={cert} className="glass-card p-4 !rounded-[14px]">
                  <p className="text-subheadline v-secondary leading-snug">{cert}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {resume.languages?.length ? (
          <section className="mt-16 lg:mt-20">
            <SectionHeading icon={HiGlobeAlt} title="Languages" />
            <div className="mt-8 flex flex-wrap gap-2">
              {resume.languages.map((lang) => (
                <span
                  key={lang}
                  className="chip-glass text-subheadline v-secondary rounded-full px-4 py-2.5"
                >
                  {lang}
                </span>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

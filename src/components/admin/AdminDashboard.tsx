"use client";

import { useState } from "react";
import Link from "next/link";
import { useCms } from "@/components/providers/CmsProvider";
import type { Project, ResumeData } from "@/types";
import { LinksAdminEditor } from "@/components/admin/LinksAdminEditor";
import { DesignPortfolioAdmin } from "@/components/admin/design/DesignPortfolioAdmin";

type Tab = "projects" | "design" | "links" | "resume" | "data";

export function AdminDashboard() {
  const cms = useCms();
  const [tab, setTab] = useState<Tab>("projects");
  const { data, setProjects, setPortfolio, setLinkGroups, setResume, previewAsVisitor, setPreviewAsVisitor } =
    cms;

  if (previewAsVisitor) {
    return (
      <div className="fixed bottom-6 left-1/2 z-[10003] -translate-x-1/2">
        <button
          type="button"
          onClick={() => setPreviewAsVisitor(false)}
          className="btn-primary text-subheadline shadow-lg"
        >
          Exit visitor preview
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-28 pb-20 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-title-1 v-primary">Admin</h1>
            <p className="text-footnote mt-1 v-tertiary">Changes save in this browser. Export JSON to back up.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="chip-glass text-subheadline px-4 py-2" onClick={() => setPreviewAsVisitor(true)}>
              Preview as visitor
            </button>
            <Link href="/" className="chip-glass text-subheadline px-4 py-2">
              View site
            </Link>
            <button type="button" className="chip-glass text-subheadline px-4 py-2" onClick={cms.exportJson}>
              Export JSON
            </button>
            <button type="button" className="chip-glass text-subheadline px-4 py-2" onClick={cms.logout}>
              Log out
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {(["projects", "design", "links", "resume", "data"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={tab === t ? "chip-glass-active text-subheadline rounded-full px-4 py-2 capitalize" : "chip-glass text-subheadline rounded-full px-4 py-2 capitalize"}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "projects" && (
          <ProjectsEditor projects={data.projects} onChange={setProjects} />
        )}
        {tab === "design" && (
          <DesignPortfolioAdmin items={data.portfolio} onChange={setPortfolio} />
        )}
        {tab === "links" && <LinksAdminEditor groups={data.linkGroups} onChange={setLinkGroups} />}
        {tab === "resume" && <ResumeEditor resume={data.resume} onChange={setResume} />}
        {tab === "data" && <DataPanel />}
      </div>
    </div>
  );
}

function ProjectsEditor({
  projects,
  onChange,
}: {
  projects: Project[];
  onChange: (p: Project[]) => void;
}) {
  const add = () => {
    const slug = `project-${Date.now()}`;
    onChange([
      ...projects,
      {
        slug,
        title: "New project",
        shortDescription: "",
        description: "",
        category: "Branding",
        status: "In Progress",
        kind: "venture",
        thumbnail: "/images/placeholders/gallery-1.svg",
        tools: [],
        overview: "",
        role: "",
        process: [],
        results: [],
        gallery: [],
        featured: true,
      },
    ]);
  };

  return (
    <div className="mt-8 space-y-4">
      <button type="button" className="btn-primary text-subheadline" onClick={add}>
        + Add project
      </button>
      {projects.map((p, idx) => (
        <div key={p.slug} className="glass-card space-y-3 p-5">
          <div className="flex flex-wrap gap-2">
            <input
              className="admin-input flex-1"
              value={p.slug}
              onChange={(e) => {
                const next = [...projects];
                next[idx] = { ...p, slug: e.target.value };
                onChange(next);
              }}
              placeholder="Slug (e.g. BARYQ)"
            />
            <button
              type="button"
              className="chip-glass text-caption px-3 py-2 text-red-300"
              onClick={() => onChange(projects.filter((_, i) => i !== idx))}
            >
              Delete
            </button>
          </div>
          <input className="admin-input w-full" value={p.title} onChange={(e) => patch(projects, idx, { title: e.target.value }, onChange)} />
          <textarea className="admin-input w-full min-h-[80px]" value={p.shortDescription} onChange={(e) => patch(projects, idx, { shortDescription: e.target.value }, onChange)} />
          <textarea className="admin-input w-full min-h-[100px]" value={p.overview} onChange={(e) => patch(projects, idx, { overview: e.target.value }, onChange)} />
          <input className="admin-input w-full" value={p.thumbnail} onChange={(e) => patch(projects, idx, { thumbnail: e.target.value }, onChange)} placeholder="Thumbnail URL or /images/..." />
          <label className="text-footnote v-tertiary block">
            Upload image
            <input
              type="file"
              accept="image/*"
              className="mt-1 block text-xs"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => patch(projects, idx, { thumbnail: reader.result as string }, onChange);
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>
      ))}
    </div>
  );
}

function ResumeEditor({
  resume,
  onChange,
}: {
  resume: ResumeData;
  onChange: (r: ResumeData) => void;
}) {
  return (
    <div className="mt-8 space-y-4">
      <div className="glass-card p-5">
        <label className="text-footnote v-tertiary">Summary</label>
        <textarea
          className="admin-input mt-2 w-full min-h-[100px]"
          value={resume.summary}
          onChange={(e) => onChange({ ...resume, summary: e.target.value })}
        />
      </div>
      <div className="glass-card space-y-3 p-5">
        <p className="text-caption text-accent uppercase tracking-widest">Education</p>
        <input
          className="admin-input w-full"
          value={resume.education.school}
          onChange={(e) =>
            onChange({ ...resume, education: { ...resume.education, school: e.target.value } })
          }
        />
        <input
          className="admin-input w-full"
          value={resume.education.degree}
          onChange={(e) =>
            onChange({ ...resume, education: { ...resume.education, degree: e.target.value } })
          }
        />
      </div>
      <div className="glass-card p-5">
        <label className="text-footnote v-tertiary">Skills (comma separated)</label>
        <input
          className="admin-input mt-2 w-full"
          value={resume.skills.join(", ")}
          onChange={(e) =>
            onChange({
              ...resume,
              skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            })
          }
        />
      </div>
      {resume.experience.map((exp, idx) => (
        <div key={exp.period} className="glass-card space-y-2 p-5">
          <input
            className="admin-input w-full"
            value={exp.period}
            onChange={(e) => {
              const next = [...resume.experience];
              next[idx] = { ...exp, period: e.target.value };
              onChange({ ...resume, experience: next });
            }}
          />
          <input
            className="admin-input w-full"
            value={exp.role}
            onChange={(e) => {
              const next = [...resume.experience];
              next[idx] = { ...exp, role: e.target.value };
              onChange({ ...resume, experience: next });
            }}
          />
          <input
            className="admin-input w-full"
            value={exp.company}
            onChange={(e) => {
              const next = [...resume.experience];
              next[idx] = { ...exp, company: e.target.value };
              onChange({ ...resume, experience: next });
            }}
          />
          <textarea
            className="admin-input w-full min-h-[72px]"
            value={exp.description}
            onChange={(e) => {
              const next = [...resume.experience];
              next[idx] = { ...exp, description: e.target.value };
              onChange({ ...resume, experience: next });
            }}
          />
        </div>
      ))}
    </div>
  );
}

function DataPanel() {
  const cms = useCms();
  const [json, setJson] = useState("");
  const [msg, setMsg] = useState("");

  return (
    <div className="mt-8 space-y-4">
      <div className="glass-card p-6">
        <p className="text-body v-secondary">
          Import/export full site content. For permanent deploy, export JSON and update files in{" "}
          <code className="text-accent">src/data/</code> then push to GitHub.
        </p>
        <button type="button" className="btn-primary text-subheadline mt-4" onClick={cms.exportJson}>
          Download backup
        </button>
        <button type="button" className="chip-glass text-subheadline mt-4 ml-2 px-4 py-2" onClick={cms.resetToDefaults}>
          Reset to defaults
        </button>
      </div>
      <textarea
        className="admin-input min-h-[200px] w-full font-mono text-xs"
        placeholder="Paste exported JSON here…"
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />
      <button
        type="button"
        className="btn-primary text-subheadline"
        onClick={() => {
          const ok = cms.importJson(json);
          setMsg(ok ? "Imported successfully." : "Invalid JSON format.");
        }}
      >
        Import JSON
      </button>
      {msg ? <p className="text-footnote text-accent">{msg}</p> : null}
    </div>
  );
}

function patch<T>(arr: T[], idx: number, partial: Partial<T>, onChange: (a: T[]) => void) {
  const next = [...arr];
  next[idx] = { ...next[idx], ...partial };
  onChange(next);
}

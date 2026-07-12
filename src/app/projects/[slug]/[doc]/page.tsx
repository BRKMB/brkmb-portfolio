import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/data";
import {
  getAllComplianceParams,
  getProjectCompliance,
  isComplianceDocId,
  COMPLIANCE_DOC_LABELS,
} from "@/lib/project-compliance";
import { ProjectComplianceDoc } from "@/components/projects/ProjectComplianceDoc";

type Props = { params: Promise<{ slug: string; doc: string }> };

export function generateStaticParams() {
  return getAllComplianceParams();
}

export async function generateMetadata({ params }: Props) {
  const { slug, doc } = await params;
  if (!isComplianceDocId(doc)) return { title: "Not Found" };
  const project = getProjectBySlug(slug);
  const compliance = getProjectCompliance(slug);
  if (!project || !compliance) return { title: "Not Found" };
  return {
    title: `${COMPLIANCE_DOC_LABELS[doc]} — ${compliance.productName} | Baher Magally`,
    description: `${COMPLIANCE_DOC_LABELS[doc]} for ${compliance.productName}.`,
  };
}

export default async function ProjectCompliancePage({ params }: Props) {
  const { slug, doc } = await params;
  if (!isComplianceDocId(doc)) notFound();

  const project = getProjectBySlug(slug);
  const compliance = getProjectCompliance(slug);
  if (!project || !compliance) notFound();

  return (
    <ProjectComplianceDoc slug={slug} projectTitle={project.title} doc={doc} data={compliance} />
  );
}

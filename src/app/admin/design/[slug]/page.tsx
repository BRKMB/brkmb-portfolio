import { getAllPortfolioSlugs } from "@/lib/portfolio";
import { NEW_PROJECT_SLUG } from "@/lib/design-admin";
import { DesignProjectEditorPage } from "@/components/admin/design/DesignProjectEditorPage";

export function generateStaticParams() {
  return [...getAllPortfolioSlugs().map((slug) => ({ slug })), { slug: NEW_PROJECT_SLUG }];
}

export default function AdminDesignProjectPage() {
  return <DesignProjectEditorPage />;
}

import { DesignEditorChrome } from "@/components/admin/design/DesignEditorChrome";

export default function AdminDesignEditorLayout({ children }: { children: React.ReactNode }) {
  return <DesignEditorChrome>{children}</DesignEditorChrome>;
}

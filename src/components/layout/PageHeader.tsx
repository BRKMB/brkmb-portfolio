import Link from "next/link";

type Props = {
  backHref?: string;
  backLabel?: string;
  title: string;
  subtitle?: string;
};

export function PageHeader({
  backHref = "/",
  backLabel = "← Home",
  title,
  subtitle,
}: Props) {
  return (
    <header className="mx-auto max-w-4xl">
      <Link href={backHref} className="text-subheadline text-accent transition hover:opacity-80">
        {backLabel}
      </Link>
      <h1 className="font-display text-large-title mt-8 v-primary">{title}</h1>
      {subtitle ? <p className="text-body mt-4 max-w-2xl v-secondary leading-relaxed">{subtitle}</p> : null}
    </header>
  );
}

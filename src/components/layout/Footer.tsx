import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 mt-8 border-t border-white/5 px-4 py-10 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-footnote v-tertiary">
          © {new Date().getFullYear()} Baher ·{" "}
          <Link href="https://brkmb.com" className="v-secondary transition hover:v-primary">
            brkmb.com
          </Link>
        </p>
        <p className="text-footnote v-quaternary">Founder · Builder · Graphic Designer</p>
      </div>
    </footer>
  );
}

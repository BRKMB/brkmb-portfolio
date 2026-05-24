import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 py-12 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-white/40">
          © {new Date().getFullYear()} Baher (Joo) ·{" "}
          <Link href="https://brkmb.com" className="text-white/60 hover:text-white">
            brkmb.com
          </Link>
        </p>
        <p className="text-sm text-white/30">Designer · Founder · Product Builder</p>
      </div>
    </footer>
  );
}

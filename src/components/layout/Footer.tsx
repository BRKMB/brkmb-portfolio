import Link from "next/link";

const footerLinks = [
  { href: "/projects/", label: "Projects" },
  { href: "/design/", label: "Design" },
  { href: "/links/", label: "Links" },
  { href: "/about/", label: "About" },
  { href: "/resume/", label: "Resume" },
];

export function Footer() {
  return (
    <footer className="relative z-10 mt-8 border-t border-white/5 px-4 py-12 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-headline v-primary">Baher Magally</p>
          <p className="text-footnote mt-2 v-tertiary">Founder · Builder · Graphic Designer</p>
          <p className="text-footnote mt-4 v-quaternary">
            © {new Date().getFullYear()}{" "}
            <Link href="https://brkmb.com" className="v-secondary transition hover:v-primary">
              brkmb.com
            </Link>
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-subheadline v-secondary transition hover:v-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}

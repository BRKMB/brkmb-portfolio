"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import certificates from "@/data/certificates.json";

const ease = [0.16, 1, 0.3, 1] as const;

type Certificate = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  image: string | null;
  verifyUrl: string;
  description: string;
};

const certs = certificates as Certificate[];

export default function CertificatesPage() {
  return (
    <div className="min-h-screen px-5 pt-32 pb-24 md:px-10">
      <div className="mx-auto max-w-5xl">
        <header>
          <Link href="/" className="text-subheadline text-accent transition hover:opacity-80">
            ← Home
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="font-display text-large-title mt-8 uppercase v-primary"
          >
            Certificates
          </motion.h1>
          <p className="text-body mt-5 max-w-2xl v-secondary leading-relaxed">
            Formal training in design, marketing, and English — each certificate links
            to the original issuer.
          </p>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {certs.map((cert, i) => (
            <motion.a
              key={cert.id}
              href={cert.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.6, ease }}
              className="glass-card focus-ring group flex flex-col overflow-hidden !p-0"
            >
              {cert.image ? (
                <span className="relative block aspect-[1772/928] w-full overflow-hidden border-b border-subtle bg-white">
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-500 ease-out group-hover:scale-[1.02]"
                  />
                </span>
              ) : (
                <span className="flex aspect-[1772/928] w-full items-center justify-center border-b border-subtle bg-white/[0.02]">
                  <span className="font-display text-title-1 text-outline uppercase opacity-60">
                    {cert.issuer.split("·")[0].trim()}
                  </span>
                </span>
              )}

              <span className="flex flex-1 flex-col p-6">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-caption uppercase tracking-[0.18em] text-accent">
                    {cert.issuer}
                  </span>
                  <span className="text-footnote shrink-0 tabular-nums v-tertiary">
                    {cert.year}
                  </span>
                </span>
                <span className="font-display text-title-3 mt-3 v-primary">{cert.title}</span>
                <span className="text-subheadline mt-2 flex-1 v-tertiary leading-relaxed">
                  {cert.description}
                </span>
                <span className="text-footnote mt-4 inline-block text-accent transition group-hover:translate-x-1">
                  Verify certificate →
                </span>
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}

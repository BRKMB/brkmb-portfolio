import type { Metadata } from "next";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  metadataBase: new URL("https://brkmb.com"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml", sizes: "180x180" }],
  },
  openGraph: {
    title: site.title,
    description: site.description,
    url: "https://brkmb.com",
    siteName: "Baher Magally",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="relative antialiased">
        <div className="site-backdrop" aria-hidden />
        <div className="site-dim" aria-hidden />
        <div className="noise" aria-hidden />
        <ClientProviders>{children}</ClientProviders>
        <Footer />
      </body>
    </html>
  );
}

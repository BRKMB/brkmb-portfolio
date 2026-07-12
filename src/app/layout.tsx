import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, Inter } from "next/font/google";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/lib/data";
import { themeBootScript } from "@/lib/theme";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-grotesk",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  metadataBase: new URL("https://brkmb.com"),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
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
    <html lang="en" suppressHydrationWarning className={`${grotesk.variable} ${inter.variable}`}>
      <head>
        <Script id="theme-boot" strategy="beforeInteractive">
          {themeBootScript}
        </Script>
      </head>
      <body className="relative antialiased">
        <div className="site-bg" aria-hidden />
        <ThemeProvider>
          <ClientProviders>{children}</ClientProviders>
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}

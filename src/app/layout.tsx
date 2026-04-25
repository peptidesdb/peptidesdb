import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://peptidedb.org"),
  title: {
    default: "PeptideDB — Open Research Peptide Reference",
    template: "%s · PeptideDB",
  },
  description:
    "Open-source, citation-dense, side-by-side comparable peptide research reference. Mechanism, dosage, evidence, side effects, and stack synergies for every research peptide.",
  keywords: [
    "peptide research",
    "peptide reference",
    "peptide comparison",
    "research peptides",
    "peptide dosage",
    "peptide mechanism",
    "PeptideDB",
  ],
  authors: [{ name: "PeptideDB Contributors" }],
  openGraph: {
    type: "website",
    title: "PeptideDB — Open Research Peptide Reference",
    description:
      "Side-by-side peptide comparison with PubMed-cited mechanism, dosage, and stack data.",
    siteName: "PeptideDB",
  },
  twitter: {
    card: "summary_large_image",
    title: "PeptideDB",
    description: "Open research peptide reference.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Static, build-time-known bootstrap script. Runs before paint via Next's
 * Script component with beforeInteractive strategy. Reads localStorage
 * preference, falls back to prefers-color-scheme, defaults to dark.
 *
 * Content is a literal string — no user input is interpolated here, so it
 * is XSS-safe. Lives in /public so the response can be cached / inlined
 * by Next without inline-script CSP friction.
 */
const themeBootstrap = `(function(){try{var t=localStorage.getItem('peptidedb-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrap}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

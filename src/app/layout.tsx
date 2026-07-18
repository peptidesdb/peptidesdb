import type { Metadata } from "next";
import { Instrument_Serif, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AtlasHeader } from "@/components/site/AtlasHeader";
import { AtlasFooter } from "@/components/site/AtlasFooter";
import { SITE_URL } from "@/lib/site";

/* Specimen Atlas typography stack:
   - Instrument Serif: display (sharp 19th-century lithograph terminals)
   - Geist: body (modern open grotesque, distinct from Inter)
   - JetBrains Mono: tabular numerals, folios, citation IDs */

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: {
    // Bing Webmaster Tools.
    other: {
      "msvalidate.01": "456B0E4225D0109D84B4CCF9CA264ADB",
    },
    // Google Search Console. Set NEXT_PUBLIC_GSC_VERIFICATION to the
    // google-site-verification token (Vercel env) and redeploy — or verify by
    // DNS TXT instead (no code needed). Until then Google barely crawls a new
    // low-authority domain; this is the R1 fix from the 2026-07-18 audit.
    ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
      : {}),
  },
  title: {
    default: "PeptidesDB — Specimen Atlas of Research Peptides",
    template: "%s · PeptidesDB",
  },
  description:
    "An open-source, citation-dense atlas of research peptides. Mechanism, dosage, evidence, side effects, and stack synergies for every plate. Each claim links to a paper; every paper opens in PubMed.",
  keywords: [
    "peptide research",
    "peptide reference",
    "peptide comparison",
    "research peptides",
    "peptide atlas",
    "PubMed",
    "PeptidesDB",
  ],
  authors: [{ name: "PeptidesDB Contributors" }],
  openGraph: {
    type: "website",
    title: "PeptidesDB — Specimen Atlas of Research Peptides",
    description:
      "Side-by-side peptide reference with PubMed-cited mechanism, dosage, and stack data.",
    siteName: "PeptidesDB",
  },
  twitter: {
    card: "summary_large_image",
    title: "PeptidesDB",
    description: "An open atlas of research peptides.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <AtlasHeader />
        <main id="main" className="flex-1">{children}</main>
        <AtlasFooter />
      </body>
    </html>
  );
}

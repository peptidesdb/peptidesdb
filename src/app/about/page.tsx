import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "PeptidesDB is a founder-led, MIT-licensed, citation-native reference for research peptides — built in public, every claim linked to a paper, every change a reviewable pull request.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-[720px] px-6 sm:px-16 py-16 sm:py-24">
      {/* MASTHEAD ————————————————— */}
      <header className="text-center mb-16 sm:mb-24">
        <p className="at-folio mb-6">The project</p>
        <h1 className="at-display text-[56px] sm:text-[80px] leading-[0.95] mb-6">
          About
        </h1>
        <p className="at-display-italic text-[24px] sm:text-[28px] text-at-ink-soft max-w-[560px] mx-auto">
          A reference where the data{" "}
          <span className="text-at-gold">is</span> the citation.
        </p>
      </header>

      <hr className="border-0 border-t border-at-rule mb-16" />

      {/* § 01 — WHAT IT IS ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 01 · What this is</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            An atlas, not a store or a forum.
          </span>
        </h2>
        <div className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm">
          <p>
            PeptidesDB is a citation-native reference for research peptides. Each
            compound is a plate: mechanism, dosage, evidence, side effects,
            administration, and stack synergy — every claim-bearing value linked
            to a paper, or explicitly marked uncited so the gap is visible.
          </p>
          <p>
            The peptide literature is scattered across PubMed, journals, vendor
            blogs, and forum threads. Existing references are text-only,
            closed-source, and not built for comparison. This one stores each
            peptide as a YAML file in a public repository, renders it as a
            print-quality monograph, and lets you compare any two or three
            side by side.
          </p>
        </div>
      </section>

      {/* § 02 — WHO BUILDS IT ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 02 · Who builds it</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            Founder-led, built in public.
          </span>
        </h2>
        <div className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm">
          <p>
            PeptidesDB is built and funded by the founder of CertaPeptides, a
            research-peptide seller. We do not hide that — we{" "}
            <Link href="/independence" className="at-link">
              disclose it in full
            </Link>
            , describe the editorial firewall, and hand you the tools to verify
            the atlas including its own products. It is currently the work of
            one maintainer with named outside reviewers being recruited; the
            code and content are MIT-licensed and every edit is a public pull
            request. Contributions are genuinely welcome, and any that arrive
            are upside, not a claim we make on the marketing.
          </p>
        </div>
      </section>

      {/* § 03 — HOW IT WORKS ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 03 · How it works</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            Every claim survives a build gate.
          </span>
        </h2>
        <div className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm">
          <p>
            The build fails on a schema violation, a citation that points at a
            reference that does not exist, or a slug that does not match its
            file. A separate audit checks every PubMed ID against the live
            database and flags the &ldquo;real ID, wrong paper&rdquo;
            mismatch. The{" "}
            <Link href="/methodology" className="at-link">
              methodology
            </Link>{" "}
            documents the full checking pipeline; the{" "}
            <Link href="/corrections" className="at-link">
              corrections log
            </Link>{" "}
            records every fix.
          </p>
        </div>
      </section>

      {/* CALL TO ACTION ————————————————— */}
      <hr className="border-0 border-t-2 border-at-ink mb-12" />
      <footer className="text-center">
        <p className="at-folio mb-6">Where to go next</p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Link href="/catalog" className="at-folio hover:text-at-gold">
            Browse the catalogue →
          </Link>
          <Link href="/independence" className="at-folio hover:text-at-gold">
            Independence →
          </Link>
          <Link href="/contribute" className="at-folio hover:text-at-gold">
            Contribute →
          </Link>
        </div>
      </footer>
    </article>
  );
}

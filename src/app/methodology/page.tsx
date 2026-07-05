import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How PeptidesDB checks a citation and how it will check a lab result — the build gates, the live PubMed verification, the claim-support audit, and the evidence tiers. Reproducible from the open repository.",
  alternates: { canonical: `${SITE_URL}/methodology` },
};

export default function MethodologyPage() {
  return (
    <article className="mx-auto max-w-[720px] px-6 sm:px-16 py-16 sm:py-24">
      {/* MASTHEAD ————————————————— */}
      <header className="text-center mb-16 sm:mb-24">
        <p className="at-folio mb-6">How the atlas is checked</p>
        <h1 className="at-display text-[56px] sm:text-[80px] leading-[0.95] mb-6">
          Methodology
        </h1>
        <p className="at-display-italic text-[24px] sm:text-[28px] text-at-ink-soft max-w-[560px] mx-auto">
          Everything here is{" "}
          <span className="text-at-gold">reproducible</span> — including by our
          critics.
        </p>
      </header>

      <hr className="border-0 border-t border-at-rule mb-16" />

      {/* § 01 — BUILD GATES ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 01 · The build gates</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            A bad claim fails to compile.
          </span>
        </h2>
        <p className="text-[16px] leading-[1.7] text-at-ink-warm mb-4">
          Each peptide is a YAML file validated against a Zod schema at build
          time. The build fails — the change cannot ship — on any of:
        </p>
        <ul className="space-y-3 text-[16px] leading-[1.7] text-at-ink-warm list-disc pl-6 marker:text-at-ink-muted">
          <li>a schema violation (wrong shape, missing required field);</li>
          <li>
            a citation that references an ID not present in the citation
            registry;
          </li>
          <li>a citation key that does not match its own <code className="at-mono text-[13px] text-at-ink">id</code> field;</li>
          <li>a filename that does not match its slug, or a duplicate slug.</li>
        </ul>
        <p className="text-[16px] leading-[1.7] text-at-ink-warm mt-4">
          Every claim-bearing value carries a <code className="at-mono text-[13px] text-at-ink">cite</code>{" "}
          slot. When a claim is not yet sourced, the slot is empty and the
          claim renders as <em>uncited</em> — the absence of a citation is
          visible, not hidden.
        </p>
      </section>

      {/* § 02 — CITATION VERIFICATION ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 02 · Citation verification</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            Real ID, and the right paper.
          </span>
        </h2>
        <div className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm">
          <p>
            The citation audit (<code className="at-mono text-[13px] text-at-ink">audit-citations.ts</code>)
            queries live PubMed for every referenced PMID and confirms two
            things: that the record <em>exists</em>, and that its title matches
            the title we recorded. The title match is the important part — it
            catches the most common fabrication pattern, a real PMID attached to
            the wrong paper. A separate claim-support audit
            (<code className="at-mono text-[13px] text-at-ink">audit-claims.ts</code>)
            checks whether a cited abstract actually supports the claim it is
            attached to; it is being promoted from a reported signal to a hard
            gate.
          </p>
          <p>
            None of this is a claim you have to take on faith. The audit scripts
            are in the{" "}
            <a
              href="https://github.com/peptidesdb/peptidesdb"
              target="_blank"
              rel="noopener noreferrer"
              className="at-link"
            >
              public repository
            </a>
            . Clone it and run them.
          </p>
        </div>
      </section>

      {/* § 03 — EVIDENCE TIERS ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 03 · Evidence tiers</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            The strength of a claim is stated, not implied.
          </span>
        </h2>
        <div className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm">
          <p>
            Each claim carries an evidence level on an eight-step scale from{" "}
            <code className="at-mono text-[13px] text-at-ink">fda-approved</code>{" "}
            down through the clinical phases, animal-strong and
            animal-mechanistic, to <code className="at-mono text-[13px] text-at-ink">theoretical</code>.
            Each peptide rolls those up into a four-bucket summary tier,
            computed — never set by hand. Peptides whose evidence base is
            primarily non-Western literature carry a plain, non-judgemental note
            saying so, rather than a hidden downgrade.
          </p>
        </div>
      </section>

      {/* § 04 — LAB PROVENANCE ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 04 · Lab provenance</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            Facts about a lab report — never a verdict.
          </span>
        </h2>
        <div className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm">
          <p>
            Third-party lab results (HPLC purity, endotoxin) tied to batch codes
            are being wired in, each independently re-verifiable at the issuing
            lab. When that ships, the atlas will report facts — &ldquo;purity as
            stated: 98.1%,&rdquo; or &ldquo;this report code does not resolve at
            the issuing lab&rdquo; — and never a verdict like
            &ldquo;scam.&rdquo; Status language runs through a single audited
            rules layer, and it is not marketed as an independent registry until
            genuinely arms-length vendors have published into it.
          </p>
        </div>
      </section>

      {/* § 05 — CORRECTIONS ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 05 · Corrections</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            When we get it wrong, we log it.
          </span>
        </h2>
        <div className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm">
          <p>
            Every material fix — a purged fabricated citation, a corrected
            statistic, a downgraded evidence rating — is recorded in the public{" "}
            <Link href="/corrections" className="at-link">
              corrections log
            </Link>{" "}
            with its date and its trigger. A reference that turns out to be
            fabricated is removed and recorded, not quietly overwritten.
          </p>
        </div>
      </section>

      {/* CALL TO ACTION ————————————————— */}
      <hr className="border-0 border-t-2 border-at-ink mb-12" />
      <footer className="text-center">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Link href="/corrections" className="at-folio hover:text-at-gold">
            Corrections log →
          </Link>
          <Link href="/independence" className="at-folio hover:text-at-gold">
            Independence →
          </Link>
          <a
            href="https://github.com/peptidesdb/peptidesdb"
            target="_blank"
            rel="noopener noreferrer"
            className="at-folio hover:text-at-gold"
          >
            Repository ↗
          </a>
        </div>
      </footer>
    </article>
  );
}

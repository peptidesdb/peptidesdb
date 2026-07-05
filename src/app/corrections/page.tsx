import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Corrections log",
  description:
    "Every material correction to PeptidesDB, dated, with its trigger — including purged fabricated citations. A public record is a trust asset, not a liability.",
  alternates: { canonical: `${SITE_URL}/corrections` },
};

/* Public corrections log. Newest first. Each entry records what changed, when,
   and what triggered it. A fabricated reference is removed and recorded here —
   never quietly overwritten. Add new entries to the top of this array. */
const CORRECTIONS: {
  date: string;
  title: string;
  trigger: string;
  body: string;
}[] = [
  {
    date: "2026-07-05",
    title: "Removed a fabricated citation (clarke-2018)",
    trigger: "Fabricated-citation audit",
    body: "A reference keyed clarke-2018 was cited three times on the tesamorelin plate for its glucose and insulin-sensitivity claims. No matching paper could be found in PubMed; the registry note flagged it as likely fabricated. It has been purged from the citation registry and from every plate. The two metabolic-outcome claims now cite Stanley et al. (JAMA, 2014; PMID 25038357), a real tesamorelin randomized trial; the glucose-intolerance safety claim now cites the FDA EGRIFTA label.",
  },
  {
    date: "2026-07-05",
    title: "Corrected a mismatched PMID (jastreboff-2023-reta)",
    trigger: "Citation cross-check",
    body: "The retatrutide reference jastreboff-2023-reta carried the PubMed ID of a NEJM correspondence letter (37888926) rather than the primary Phase 2 trial it describes. The ID was corrected to 37366315 (Jastreboff et al., NEJM, 2023), which reports the 24.2% body-weight reduction the plate cites. The retatrutide headline stats, previously uncited, now point to it.",
  },
];

export default function CorrectionsPage() {
  return (
    <article className="mx-auto max-w-[720px] px-6 sm:px-16 py-16 sm:py-24">
      {/* MASTHEAD ————————————————— */}
      <header className="text-center mb-16 sm:mb-24">
        <p className="at-folio mb-6">The record</p>
        <h1 className="at-display text-[56px] sm:text-[80px] leading-[0.95] mb-6">
          Corrections
        </h1>
        <p className="at-display-italic text-[24px] sm:text-[28px] text-at-ink-soft max-w-[560px] mx-auto">
          A public record of every fix is a{" "}
          <span className="text-at-gold">trust asset</span>, not a scandal.
        </p>
      </header>

      <hr className="border-0 border-t border-at-rule mb-16" />

      <section className="mb-16">
        <p className="text-[16px] leading-[1.7] text-at-ink-warm mb-12">
          When the atlas is wrong, the fix is logged here — dated, with what
          triggered it. A fabricated citation is not silently swapped out; it is
          removed and recorded. The{" "}
          <Link href="/methodology" className="at-link">
            methodology
          </Link>{" "}
          describes the checks that surface these in the first place.
        </p>

        <ol className="space-y-12">
          {CORRECTIONS.map((c, i) => (
            <li key={i}>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
                <span className="at-mono text-[13px] text-at-ink-soft">
                  {c.date}
                </span>
                <span className="at-folio text-at-ink-muted">{c.trigger}</span>
              </div>
              <h2 className="at-display text-[24px] sm:text-[26px] leading-[1.2] text-at-ink mb-3">
                {c.title}
              </h2>
              <p className="text-[16px] leading-[1.7] text-at-ink-warm">
                {c.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* CALL TO ACTION ————————————————— */}
      <hr className="border-0 border-t-2 border-at-ink mb-12" />
      <footer className="text-center">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Link href="/methodology" className="at-folio hover:text-at-gold">
            Methodology →
          </Link>
          <Link href="/independence" className="at-folio hover:text-at-gold">
            Independence →
          </Link>
          <a
            href="https://github.com/peptidesdb/peptidesdb/commits/main"
            target="_blank"
            rel="noopener noreferrer"
            className="at-folio hover:text-at-gold"
          >
            Full commit history ↗
          </a>
        </div>
      </footer>
    </article>
  );
}

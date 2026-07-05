import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms of use for PeptidesDB: a research and educational reference only, not medical advice, offered without warranty. Code and content are MIT-licensed.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-[720px] px-6 sm:px-16 py-16 sm:py-24">
      <header className="text-center mb-16 sm:mb-24">
        <p className="at-folio mb-6">Legal</p>
        <h1 className="at-display text-[56px] sm:text-[80px] leading-[0.95] mb-6">
          Terms of use
        </h1>
        <p className="at-display-italic text-[24px] sm:text-[28px] text-at-ink-soft max-w-[560px] mx-auto">
          Reference material, offered honestly and without warranty.
        </p>
      </header>

      <hr className="border-0 border-t border-at-rule mb-16" />

      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 01 · Research use only</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            Not medical advice.
          </span>
        </h2>
        <div className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm">
          <p>
            PeptidesDB is a research and educational reference. Nothing on it is
            medical advice, a diagnosis, a treatment recommendation, or an
            endorsement to use, buy, or administer any compound. The peptides
            described are research chemicals; many are not approved for human
            use. Consult a qualified clinician before making any health
            decision. You are responsible for complying with the laws that
            apply to you.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 02 · No warranty</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            Accurate as we can make it — but verify.
          </span>
        </h2>
        <div className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm">
          <p>
            The atlas is built to be citation-accurate and is checked against
            the primary literature, but it is provided &ldquo;as is,&rdquo;
            without warranty of any kind, and may contain errors. Every claim
            links to its source so you can check it yourself. To the maximum
            extent permitted by law, the maintainers are not liable for any loss
            arising from use of, or reliance on, this material. When we find and
            fix an error, we record it in the{" "}
            <Link href="/corrections" className="at-link">
              corrections log
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 03 · Licence &amp; links</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            MIT-licensed; external links are not endorsements.
          </span>
        </h2>
        <div className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm">
          <p>
            The code and content are released under the{" "}
            <a
              href="https://github.com/peptidesdb/peptidesdb/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="at-link"
            >
              MIT licence
            </a>
            . You may reuse them under its terms. Links out to PubMed, journals,
            and other sites are provided for reference and are not endorsements;
            we are not responsible for external content. Ownership and the
            handling of the one commercial relationship in the project are
            disclosed on the{" "}
            <Link href="/independence" className="at-link">
              independence
            </Link>{" "}
            page.
          </p>
        </div>
      </section>

      <hr className="border-0 border-t-2 border-at-ink mb-12" />
      <footer className="text-center">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Link href="/privacy" className="at-folio hover:text-at-gold">
            Privacy →
          </Link>
          <Link href="/imprint" className="at-folio hover:text-at-gold">
            Imprint →
          </Link>
        </div>
      </footer>
    </article>
  );
}

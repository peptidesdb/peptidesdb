import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Imprint",
  description:
    "Imprint / Impressum for PeptidesDB: who operates the site, the ownership relationship with CertaPeptides, and how to make contact.",
  alternates: { canonical: `${SITE_URL}/imprint` },
};

export default function ImprintPage() {
  return (
    <article className="mx-auto max-w-[720px] px-6 sm:px-16 py-16 sm:py-24">
      <header className="text-center mb-16 sm:mb-24">
        <p className="at-folio mb-6">Legal · Impressum</p>
        <h1 className="at-display text-[56px] sm:text-[80px] leading-[0.95] mb-6">
          Imprint
        </h1>
        <p className="at-display-italic text-[24px] sm:text-[28px] text-at-ink-soft max-w-[560px] mx-auto">
          Who is responsible for this site.
        </p>
      </header>

      <hr className="border-0 border-t border-at-rule mb-16" />

      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 01 · Operator</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            Responsible for content.
          </span>
        </h2>
        <div className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm">
          <p>
            PeptidesDB is an independent reference project funded and operated by
            the founder of CertaPeptides, a research-peptide seller. The
            ownership relationship, the editorial firewall between the seller
            and the atlas, and how to verify the project are set out in full on
            the{" "}
            <Link href="/independence" className="at-link">
              independence
            </Link>{" "}
            page. The project is operated from Romania (EU).
          </p>
          <p className="text-[15px] text-at-ink-soft">
            A postal address for formal legal correspondence is available on
            request via the contact routes below.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 02 · Contact</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            How to reach us.
          </span>
        </h2>
        <ul className="space-y-3 text-[16px] leading-[1.7] text-at-ink-warm list-disc pl-6 marker:text-at-ink-muted">
          <li>
            <strong className="text-at-ink">Repository</strong> — open an issue
            at{" "}
            <a
              href="https://github.com/peptidesdb/peptidesdb/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="at-link"
            >
              github.com/peptidesdb/peptidesdb
            </a>
            .
          </li>
          <li>
            <strong className="text-at-ink">Confidential reports</strong> — open
            a private security advisory on the repository, or email{" "}
            <a href="mailto:contact@peptidesdb.org" className="at-link">
              contact@peptidesdb.org
            </a>
            .
          </li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 03 · Content &amp; liability</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            Scope of responsibility.
          </span>
        </h2>
        <div className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm">
          <p>
            Content is provided as a research reference under the{" "}
            <Link href="/terms" className="at-link">
              terms of use
            </Link>{" "}
            and the{" "}
            <Link href="/privacy" className="at-link">
              privacy notice
            </Link>
            . Links to external sites lead to content for which their respective
            operators are responsible. The code and content are MIT-licensed.
          </p>
        </div>
      </section>

      <hr className="border-0 border-t-2 border-at-ink mb-12" />
      <footer className="text-center">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Link href="/privacy" className="at-folio hover:text-at-gold">
            Privacy →
          </Link>
          <Link href="/terms" className="at-folio hover:text-at-gold">
            Terms →
          </Link>
          <Link href="/independence" className="at-folio hover:text-at-gold">
            Independence →
          </Link>
        </div>
      </footer>
    </article>
  );
}

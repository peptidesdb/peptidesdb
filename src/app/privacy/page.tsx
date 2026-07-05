import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What PeptidesDB collects and does not collect: no accounts, no advertising trackers, no data sale. The only personal data touched is an IP address used briefly to rate-limit the Ask feature, whose questions are sent to Anthropic to generate an answer.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-[720px] px-6 sm:px-16 py-16 sm:py-24">
      <header className="text-center mb-16 sm:mb-24">
        <p className="at-folio mb-6">Legal</p>
        <h1 className="at-display text-[56px] sm:text-[80px] leading-[0.95] mb-6">
          Privacy
        </h1>
        <p className="at-display-italic text-[24px] sm:text-[28px] text-at-ink-soft max-w-[560px] mx-auto">
          The short version: there is very little to collect.
        </p>
      </header>

      <hr className="border-0 border-t border-at-rule mb-16" />

      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 01 · What we do not do</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            No accounts, no trackers, no data sale.
          </span>
        </h2>
        <ul className="space-y-3 text-[16px] leading-[1.7] text-at-ink-warm list-disc pl-6 marker:text-at-ink-muted">
          <li>There are no user accounts and nothing to sign up for.</li>
          <li>We do not run advertising networks or advertising trackers.</li>
          <li>We do not sell, rent, or share personal data.</li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 02 · The Ask feature</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            IP for rate limiting; your question goes to Anthropic.
          </span>
        </h2>
        <div className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm">
          <p>
            When you use{" "}
            <Link href="/ask" className="at-link">
              Ask
            </Link>
            , two things happen that touch data:
          </p>
          <ul className="space-y-3 list-disc pl-6 marker:text-at-ink-muted">
            <li>
              <strong className="text-at-ink">Rate limiting.</strong> Your IP
              address (read from the standard{" "}
              <code className="at-mono text-[13px] text-at-ink">
                x-forwarded-for
              </code>{" "}
              / <code className="at-mono text-[13px] text-at-ink">x-real-ip</code>{" "}
              headers) is used to count requests over short windows so the
              feature is not abused. The count is held transiently in a
              key-value store; we do not build a profile from it.
            </li>
            <li>
              <strong className="text-at-ink">Answer generation.</strong> Your
              question, together with the relevant peptide text retrieved from
              the atlas, is sent to Anthropic&rsquo;s Claude API to compose an
              answer grounded only in atlas content. We do not store the
              questions or answers as a record tied to you.
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 03 · Sub-processors</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            Who else touches the data.
          </span>
        </h2>
        <ul className="space-y-3 text-[16px] leading-[1.7] text-at-ink-warm list-disc pl-6 marker:text-at-ink-muted">
          <li>
            <strong className="text-at-ink">Vercel</strong> — hosting, content
            delivery, and the transient rate-limit store.
          </li>
          <li>
            <strong className="text-at-ink">Anthropic</strong> — processes Ask
            questions to generate answers.
          </li>
          <li>
            <strong className="text-at-ink">GitHub</strong> — only if you choose
            to contribute; contributions are public pull requests under your
            GitHub identity.
          </li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 04 · Your rights &amp; contact</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            Questions and requests.
          </span>
        </h2>
        <p className="text-[16px] leading-[1.7] text-at-ink-warm">
          Because there are no accounts and no retained personal records, there
          is little to access, correct, or delete. For any privacy question, or
          to exercise a data right under the GDPR or a comparable regime, open
          an issue on the{" "}
          <a
            href="https://github.com/peptidesdb/peptidesdb/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="at-link"
          >
            repository
          </a>{" "}
          or use the contact route on the{" "}
          <Link href="/imprint" className="at-link">
            imprint
          </Link>{" "}
          page. This notice may be updated; material changes are noted in the{" "}
          <Link href="/corrections" className="at-link">
            corrections log
          </Link>
          .
        </p>
      </section>

      <hr className="border-0 border-t-2 border-at-ink mb-12" />
      <footer className="text-center">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Link href="/terms" className="at-folio hover:text-at-gold">
            Terms →
          </Link>
          <Link href="/imprint" className="at-folio hover:text-at-gold">
            Imprint →
          </Link>
        </div>
      </footer>
    </article>
  );
}

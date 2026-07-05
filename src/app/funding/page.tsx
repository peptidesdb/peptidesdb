import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Funding",
  description:
    "How PeptidesDB is paid for: currently founder-funded, with no ads, no sponsorships, and no affiliate revenue — and a committed roadmap to a revenue line that does not come from parties who profit from the atlas's conclusions.",
  alternates: { canonical: `${SITE_URL}/funding` },
};

export default function FundingPage() {
  return (
    <article className="mx-auto max-w-[720px] px-6 sm:px-16 py-16 sm:py-24">
      {/* MASTHEAD ————————————————— */}
      <header className="text-center mb-16 sm:mb-24">
        <p className="at-folio mb-6">Governance · Money</p>
        <h1 className="at-display text-[56px] sm:text-[80px] leading-[0.95] mb-6">
          Funding
        </h1>
        <p className="at-display-italic text-[24px] sm:text-[28px] text-at-ink-soft max-w-[560px] mx-auto">
          Follow the money — because{" "}
          <span className="text-at-gold">you should</span>.
        </p>
      </header>

      <hr className="border-0 border-t border-at-rule mb-16" />

      {/* § 01 — TODAY ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 01 · Today</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            Founder-funded. Nothing else.
          </span>
        </h2>
        <ul className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm list-disc pl-6 marker:text-at-ink-muted">
          <li>
            <strong className="text-at-ink">No advertising.</strong> There are
            no ad slots and no ad network on any page.
          </li>
          <li>
            <strong className="text-at-ink">No sponsorships.</strong> No plate,
            section, or ranking is paid for. Placement cannot be bought.
          </li>
          <li>
            <strong className="text-at-ink">No affiliate revenue.</strong> The
            atlas earns nothing when you click out, buy a compound, or visit a
            vendor — including CertaPeptides. Outbound links to the funder&rsquo;s
            store are{" "}
            <code className="at-mono text-[13px] text-at-ink">nofollow</code> and
            disclosed as same-owner.
          </li>
          <li>
            <strong className="text-at-ink">No accounts, no data sale.</strong>{" "}
            There is nothing to sign up for and no user data to sell. See the{" "}
            <Link href="/privacy" className="at-link">
              privacy page
            </Link>
            .
          </li>
        </ul>
        <p className="text-[16px] leading-[1.7] text-at-ink-warm mt-4">
          Running costs — hosting, the answer model, the domain — are paid by
          the founder. That is the honest current state: this is subsidised by a
          peptide seller, which is exactly why the{" "}
          <Link href="/independence" className="at-link">
            editorial firewall
          </Link>{" "}
          and the roadmap below matter.
        </p>
      </section>

      {/* § 02 — THE ROADMAP ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 02 · The roadmap</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            Toward revenue with no stake in the conclusions.
          </span>
        </h2>
        <div className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm">
          <p>
            The committed direction is a revenue line that does not come from
            anyone who profits from what the atlas concludes — for example,
            paid data and API licensing to labs and researchers, and/or a
            transparent donations vehicle. The principle is simple: the people
            who pay for the atlas must not be the people whose products it
            evaluates.
          </p>
          <p>
            That is also the precondition for the{" "}
            <Link href="/independence" className="at-link">
              governance end-state
            </Link>{" "}
            — a neutral non-profit holding the trademark and domain and
            licensing the data to all vendors equally. A project cannot move to
            that structure until it can fund itself without its founder&rsquo;s
            store. We will report progress here, dated, as it happens.
          </p>
        </div>
      </section>

      {/* CALL TO ACTION ————————————————— */}
      <hr className="border-0 border-t-2 border-at-ink mb-12" />
      <footer className="text-center">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Link href="/independence" className="at-folio hover:text-at-gold">
            Independence →
          </Link>
          <Link href="/methodology" className="at-folio hover:text-at-gold">
            Methodology →
          </Link>
          <Link href="/corrections" className="at-folio hover:text-at-gold">
            Corrections log →
          </Link>
        </div>
      </footer>
    </article>
  );
}

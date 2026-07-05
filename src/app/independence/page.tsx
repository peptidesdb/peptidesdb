import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Independence & ownership",
  description:
    "PeptidesDB is built and funded by the founder of CertaPeptides, a research-peptide seller. This page states that plainly, describes the editorial firewall, and shows you how to verify the atlas — including its own products.",
  alternates: { canonical: `${SITE_URL}/independence` },
};

export default function IndependencePage() {
  return (
    <article className="mx-auto max-w-[720px] px-6 sm:px-16 py-16 sm:py-24">
      {/* MASTHEAD ————————————————— */}
      <header className="text-center mb-16 sm:mb-24">
        <p className="at-folio mb-6">Governance · Disclosure</p>
        <h1 className="at-display text-[56px] sm:text-[80px] leading-[0.95] mb-6">
          Independence
        </h1>
        <p className="at-display-italic text-[24px] sm:text-[28px] text-at-ink-soft max-w-[560px] mx-auto">
          Independence you can{" "}
          <span className="text-at-gold">verify</span> beats independence
          you are asked to believe.
        </p>
      </header>

      <hr className="border-0 border-t border-at-rule mb-16" />

      {/* § 01 — OWNERSHIP ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 01 · Who owns this</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            Built and funded by a peptide seller.
          </span>
        </h2>
        <div className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm">
          <p>
            PeptidesDB is built and funded by the founder of{" "}
            <strong className="text-at-ink">CertaPeptides</strong>, a company
            that sells research peptides. We are stating that in the first
            sentence on purpose. The peptide market runs on{" "}
            <em>&ldquo;trust me&rdquo;</em> — so we built the thing that lets
            you verify instead, including verifying us.
          </p>
          <p>
            A conflict of interest that is hidden is a liability. A conflict of
            interest that is disclosed, firewalled, and independently checkable
            is something no anonymous vendor blog will ever offer you. That is
            the whole design of this atlas.
          </p>
        </div>
      </section>

      {/* § 02 — THE FIREWALL ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 02 · The firewall</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            What the seller does not get.
          </span>
        </h2>
        <ul className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm list-disc pl-6 marker:text-at-ink-muted">
          <li>
            <strong className="text-at-ink">No editorial input.</strong>{" "}
            CertaPeptides does not choose which peptides appear, what the plates
            say, how evidence is rated, or which citations are used.
          </li>
          <li>
            <strong className="text-at-ink">No preferential coverage.</strong>{" "}
            Compounds CertaPeptides sells are held to the same evidence bar as
            everything else. There is no &ldquo;house favourite&rdquo; tier.
          </li>
          <li>
            <strong className="text-at-ink">
              No selling inside the atlas.
            </strong>{" "}
            A build-time gate (<code className="at-mono text-[13px] text-at-ink">audit-editorial.ts</code>)
            hard-blocks links to <code className="at-mono text-[13px] text-at-ink">certapeptides.com</code>{" "}
            and any &ldquo;buy&rdquo; language from appearing inside plate
            content. The firewall is not a promise — it fails the build.
          </li>
          <li>
            <strong className="text-at-ink">Symmetric verification.</strong>{" "}
            When lab-result provenance ships, CertaPeptides&rsquo; own batches
            are verified by the identical rules, and we publish that they are.
          </li>
        </ul>
      </section>

      {/* § 03 — HOW TO VERIFY US ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 03 · How to verify us</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            Don&rsquo;t trust the disclosure. Check it.
          </span>
        </h2>
        <div className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm">
          <p>
            Every plate is a YAML file in a public,{" "}
            <a
              href="https://github.com/peptidesdb/peptidesdb"
              target="_blank"
              rel="noopener noreferrer"
              className="at-link"
            >
              MIT-licensed repository
            </a>
            . Every change ships as a pull request you can read. Every claim
            carries a citation ID, or it is marked uncited.
          </p>
          <p>
            The citation audit that checks every reference against live PubMed
            is in that repo (<code className="at-mono text-[13px] text-at-ink">audit-citations.ts</code>).
            You can clone it and re-run it yourself — the reputation of
            &ldquo;every claim was checked&rdquo; is earned by being
            reproducible, not by being asserted. Read the{" "}
            <Link href="/methodology" className="at-link">
              methodology
            </Link>{" "}
            for how that works, and the{" "}
            <Link href="/corrections" className="at-link">
              corrections log
            </Link>{" "}
            for every fix we have made and why.
          </p>
          <p>
            The links <em>from</em> CertaPeptides product pages back to this
            atlas are marked{" "}
            <code className="at-mono text-[13px] text-at-ink">
              rel=&quot;sponsored nofollow&quot;
            </code>{" "}
            and labelled &ldquo;same owner.&rdquo; We pass ourselves zero search
            authority and we say so on the page.
          </p>
        </div>
      </section>

      {/* § 04 — WHERE THIS IS GOING ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block mb-2">§ 04 · Where this is going</span>
          <span className="at-display text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            Toward an owner that is not a vendor.
          </span>
        </h2>
        <div className="space-y-4 text-[16px] leading-[1.7] text-at-ink-warm">
          <p>
            The committed direction is to move the trademark and domain into a
            neutral, non-profit vehicle that licenses the dataset to{" "}
            <em>every</em> vendor — including CertaPeptides — on equal terms.
            The vendor stops owning the authority and holds a licence like
            anyone else. Announcing that direction early is itself a
            commitment; see the{" "}
            <Link href="/funding" className="at-link">
              funding page
            </Link>{" "}
            for the revenue model that has to stand up first.
          </p>
        </div>
      </section>

      {/* CALL TO ACTION ————————————————— */}
      <hr className="border-0 border-t-2 border-at-ink mb-12" />
      <footer className="text-center">
        <p className="at-folio mb-6">Read on</p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Link href="/about" className="at-folio hover:text-at-gold">
            About →
          </Link>
          <Link href="/funding" className="at-folio hover:text-at-gold">
            Funding →
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

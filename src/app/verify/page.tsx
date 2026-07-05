import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { allProvenance, purityKind } from "@/lib/provenance";

export const metadata: Metadata = {
  title: "Lab report registry",
  description:
    "A registry of third-party laboratory reports — HPLC purity and content assays tied to batch codes, each re-verifiable at the issuing lab.",
  alternates: { canonical: `${SITE_URL}/verify` },
};

export default function VerifyIndexPage() {
  const records = [...allProvenance()].sort((a, b) =>
    b.testDate.localeCompare(a.testDate),
  );

  return (
    <article className="mx-auto max-w-[880px] px-6 sm:px-16 py-16 sm:py-24">
      <header className="text-center mb-12 sm:mb-16">
        <p className="at-folio mb-6">The registry</p>
        <h1 className="at-display text-[56px] sm:text-[80px] leading-[0.95] mb-6">
          Lab reports
        </h1>
        <p className="at-display-italic text-[22px] sm:text-[26px] text-at-ink-soft max-w-[600px] mx-auto">
          Real measurements, tied to batch codes,{" "}
          <span className="text-at-gold">re-verifiable</span> at the issuing lab.
        </p>
      </header>

      <p className="text-[15px] leading-[1.7] text-at-ink-warm max-w-[640px] mx-auto text-center mb-4">
        Each row is a third-party laboratory report tied to a batch code. Open
        one to see the reported measurement and a link to re-check it at the
        issuing lab. This is the part of the atlas a competitor cannot fork — a
        report set is collected, not copied.
      </p>
      <p className="at-folio normal-case tracking-normal text-[13px] leading-[1.7] text-at-ink-soft max-w-[640px] mx-auto text-center mb-16">
        Seeded by a single vendor (CertaPeptides, contributor #1) and built to
        hold more. We do not call it an independent registry —{" "}
        <Link href="/independence" className="at-link">
          why
        </Link>
        .
      </p>

      <div className="border-t-2 border-at-ink">
        {records.map((r) => {
          const kind = purityKind(r);
          return (
            <Link
              key={r.reportCode}
              href={`/verify/${r.reportCode}`}
              className="group flex items-baseline gap-4 py-4 border-b border-at-rule hover:bg-at-bone-deep transition-colors"
            >
              <span className="at-mono text-[12px] text-at-ink-soft w-[92px] shrink-0">
                {r.testDate}
              </span>
              <span className="flex-1 min-w-0">
                <span className="text-[16px] text-at-ink group-hover:text-at-gold transition-colors">
                  {r.productName}
                </span>{" "}
                <span className="at-folio">{r.dosage}</span>
              </span>
              <span className="text-right shrink-0">
                {kind === "purity" ? (
                  <span className="at-display text-[22px]">
                    {r.purityHplc.toFixed(2)}
                    <span className="at-folio"> %</span>
                  </span>
                ) : (
                  <span className="at-folio">content assay</span>
                )}
              </span>
            </Link>
          );
        })}
      </div>

      <p className="at-folio normal-case tracking-normal text-[12px] text-at-ink-soft mt-6">
        {records.length} reports · issued by Janoshik Analytical ·
        re-verifiable at verify.janoshik.com
      </p>
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  allProvenance,
  provenanceByCode,
  purityKind,
  type ProvenanceRecord,
} from "@/lib/provenance";

export const dynamicParams = false;

export function generateStaticParams(): { reportCode: string }[] {
  return allProvenance().map((r) => ({ reportCode: r.reportCode }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ reportCode: string }>;
}): Promise<Metadata> {
  const { reportCode } = await params;
  const r = provenanceByCode(reportCode);
  if (!r) return { title: "Report not found" };
  return {
    title: `${r.productName} — lab report ${r.reportCode}`,
    description: `Third-party ${r.lab} report ${r.reportCode} for ${r.productName} ${r.dosage}, issued ${r.testDate}. Re-verifiable at the issuing lab.`,
    alternates: { canonical: `${SITE_URL}/verify/${r.reportCode}` },
  };
}

/* Factual structured data — states the measurement and attributes it to the
   issuing lab, with no rating/verdict. Deliberately NOT ClaimReview: a lab
   result is a measured fact, not a truth-score. The batch is a Product; the
   measurement is a PropertyValue; the report is a CreativeWork authored by the
   lab. The vendor appears only as visible provenance text, never as a schema
   claimant. */
function reportLd(r: ProvenanceRecord): object {
  const kind = purityKind(r);
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${r.productName} ${r.dosage} — batch report ${r.reportCode}`,
    category: "research compound batch",
    url: `${SITE_URL}/verify/${r.reportCode}`,
    subjectOf: {
      "@type": "CreativeWork",
      name: `${r.lab} report ${r.reportCode}`,
      author: { "@type": "Organization", name: r.lab, url: "https://janoshik.com" },
      datePublished: r.testDate,
      url: r.reportUrl,
    },
    additionalProperty:
      kind === "purity"
        ? {
            "@type": "PropertyValue",
            name: "HPLC purity",
            value: r.purityHplc,
            unitText: "PERCENT",
            measurementTechnique: "HPLC",
          }
        : {
            "@type": "PropertyValue",
            name: "Assay",
            value: "content quantification",
            measurementTechnique: "HPLC content analysis",
          },
  };
  return ld;
}

export default async function VerifyReportPage({
  params,
}: {
  params: Promise<{ reportCode: string }>;
}) {
  const { reportCode } = await params;
  const r = provenanceByCode(reportCode);
  if (!r) notFound();
  const kind = purityKind(r);

  return (
    <article className="mx-auto max-w-[720px] px-6 sm:px-16 py-16 sm:py-24">
      <JsonLd data={reportLd(r)} />

      <header className="mb-12">
        <p className="at-folio mb-4">
          Third-party lab report · {r.reportCode}
        </p>
        <h1 className="at-display text-[44px] sm:text-[64px] leading-[1.0] mb-3">
          {r.productName}
        </h1>
        <p className="at-display-italic text-[22px] text-at-ink-soft">
          {r.dosage} · {r.lab}
        </p>
      </header>

      <hr className="border-0 border-t-2 border-at-ink mb-12" />

      {/* The measurement */}
      <div className="mb-12">
        {kind === "purity" ? (
          <>
            <div className="at-folio mb-2">HPLC purity, as reported</div>
            <div className="at-display text-[72px] sm:text-[96px] leading-none text-at-ink">
              {r.purityHplc.toFixed(3)}
              <span className="at-display-italic text-[36px] text-at-ink-soft">
                %
              </span>
            </div>
            {r.scope === "purity+heavy-metals" && (
              <p className="at-folio mt-3 text-at-ink-soft">
                + Heavy metals panel on the same lot
              </p>
            )}
          </>
        ) : (
          <>
            <div className="at-folio mb-2">Assay type</div>
            <div className="at-display text-[40px] sm:text-[52px] leading-tight text-at-ink">
              Content quantification
            </div>
            <p className="text-[15px] text-at-ink-warm mt-3">
              A multi-component blend is measured by content per component
              rather than a single HPLC purity figure.
            </p>
          </>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12">
        <div>
          <dt className="at-folio mb-1">Report code</dt>
          <dd className="at-mono text-[15px] text-at-ink">{r.reportCode}</dd>
        </div>
        <div>
          <dt className="at-folio mb-1">Test date</dt>
          <dd className="at-mono text-[15px] text-at-ink">{r.testDate}</dd>
        </div>
        <div>
          <dt className="at-folio mb-1">Issuing lab</dt>
          <dd className="text-[15px] text-at-ink-warm">{r.lab}</dd>
        </div>
        <div>
          <dt className="at-folio mb-1">Submitted by</dt>
          <dd className="text-[15px] text-at-ink-warm">{r.vendor}</dd>
        </div>
      </dl>

      <a
        href={r.reportUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block at-folio border border-at-ink px-5 py-3 hover:bg-at-ink hover:text-at-bone transition-colors"
      >
        Re-verify at the issuing lab ↗
      </a>

      <div className="mt-12 pt-8 border-t border-at-rule space-y-4 text-[15px] leading-[1.7] text-at-ink-warm">
        <p>
          This page reports a fact and shows you where to re-check it. The
          measurement was made by <strong className="text-at-ink">{r.lab}</strong>,
          an independent laboratory; the report is re-verifiable at the link
          above using the report code. We do not issue a pass/fail verdict —
          the number is the lab&rsquo;s, and you can confirm it at the source.
        </p>
        <p className="text-at-ink-soft text-[14px]">
          The report was submitted by {r.vendor}. The registry is built to hold
          reports from multiple vendors; while it is seeded by a single vendor,
          we do not describe it as an independent registry — see{" "}
          <Link href="/independence" className="at-link">
            independence
          </Link>{" "}
          and{" "}
          <Link href="/methodology" className="at-link">
            methodology
          </Link>
          .
        </p>
      </div>

      <hr className="border-0 border-t border-at-rule mt-12 mb-6" />
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {r.slug && (
          <Link href={`/p/${r.slug}`} className="at-folio hover:text-at-gold">
            {r.productName} plate →
          </Link>
        )}
        <Link href="/verify" className="at-folio hover:text-at-gold">
          All lab reports →
        </Link>
      </div>
    </article>
  );
}

import "server-only";
import { z } from "zod";

/* =========================================================
   Third-party lab-result provenance registry.

   Real HPLC purity / content measurements tied to batch report
   codes, each independently re-verifiable at the issuing lab
   (verify.janoshik.com). This is the uncopyable data moat: a
   competitor can fork every plate and audit script, but not a
   growing ledger of lab reports it never collected.

   Architected multi-vendor from day one — every record carries a
   `vendor`. CertaPeptides is contributor #1. We do NOT market the
   registry as "independent" until genuinely arms-length vendors
   have published (Phase-2 gate). Verification here is FACTUAL —
   the reported measurement and where to re-check it — never a
   verdict.
   ========================================================= */

export const ProvenanceScope = z.enum([
  "purity",
  "purity+heavy-metals",
  "content",
]);
export type ProvenanceScope = z.infer<typeof ProvenanceScope>;

export const ProvenanceRecord = z.object({
  /** Stable report code — the /verify/[reportCode] permalink key (uppercase alnum). */
  reportCode: z
    .string()
    .regex(/^[A-Z0-9]{8,}$/, "report code must be uppercase alphanumeric"),
  reportId: z.string(),
  /** Deep link to the issuing lab's own report page. */
  reportUrl: z.string().url(),
  /** Peptide plate slug this batch belongs to, or null (e.g. a blend with no plate yet). */
  slug: z.string().nullable(),
  productName: z.string(),
  dosage: z.string(),
  /** Reported HPLC purity %. 0 = content-assay-only or pending (see scope). */
  purityHplc: z.number().min(0).max(100),
  scope: ProvenanceScope.default("purity"),
  /** ISO date the report was issued. */
  testDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** Issuing laboratory. */
  lab: z.string(),
  /** Contributing vendor. Multi-vendor by design; CertaPeptides is contributor #1. */
  vendor: z.string(),
}).refine((r) => r.purityHplc > 0 || r.scope === "content", {
  message:
    "purityHplc 0 is only valid for a content assay — pending reports are not published",
  path: ["purityHplc"],
});
export type ProvenanceRecord = z.infer<typeof ProvenanceRecord>;

/* Contributor #1: CertaPeptides. Reports issued by Janoshik Analytical
   (Czech Republic), each re-verifiable at verify.janoshik.com. Transcribed
   from the vendor's published report set; update as new reports arrive. */
const RECORDS: ProvenanceRecord[] = [
  { reportCode: "IT2JSP8AGYWZ", reportId: "123933", reportUrl: "https://verify.janoshik.com/tests/123933-Ipamorelin_10mg_IT2JSP8AGYWZ", slug: "ipamorelin", productName: "Ipamorelin", dosage: "10 mg", purityHplc: 99.766, scope: "purity", testDate: "2026-03-31", lab: "Janoshik Analytical", vendor: "CertaPeptides" },
  { reportCode: "FMUB79QCK7BX", reportId: "123934", reportUrl: "https://verify.janoshik.com/tests/123934-Epitalon_50mg_FMUB79QCK7BX", slug: "epitalon", productName: "Epitalon", dosage: "50 mg", purityHplc: 98.005, scope: "purity", testDate: "2026-03-31", lab: "Janoshik Analytical", vendor: "CertaPeptides" },
  { reportCode: "3N5W5GFN9ZJ9", reportId: "123935", reportUrl: "https://verify.janoshik.com/tests/123935-Selank_10mg_3N5W5GFN9ZJ9", slug: "selank", productName: "Selank", dosage: "10 mg", purityHplc: 99.788, scope: "purity", testDate: "2026-03-31", lab: "Janoshik Analytical", vendor: "CertaPeptides" },
  { reportCode: "4S6XFDXXP8VD", reportId: "123932", reportUrl: "https://verify.janoshik.com/tests/123932-Retatrutide_5mg_4S6XFDXXP8VD", slug: "retatrutide", productName: "Retatrutide", dosage: "5 mg", purityHplc: 99.702, scope: "purity", testDate: "2026-04-01", lab: "Janoshik Analytical", vendor: "CertaPeptides" },
  { reportCode: "U97KTF6W816F", reportId: "136726", reportUrl: "https://verify.janoshik.com/tests/136726-GHKCU_50mg_U97KTF6W816F", slug: "ghk-cu", productName: "GHK-Cu", dosage: "50 mg", purityHplc: 99.425, scope: "purity+heavy-metals", testDate: "2026-04-20", lab: "Janoshik Analytical", vendor: "CertaPeptides" },
  { reportCode: "JGERIBLDY5ZW", reportId: "136728", reportUrl: "https://verify.janoshik.com/tests/136728-BPC157_5mg_JGERIBLDY5ZW", slug: "bpc-157", productName: "BPC-157", dosage: "5 mg", purityHplc: 99.036, scope: "purity", testDate: "2026-04-20", lab: "Janoshik Analytical", vendor: "CertaPeptides" },
  { reportCode: "Z389R9WPGKD7", reportId: "136729", reportUrl: "https://verify.janoshik.com/tests/136729-BPC157_TB500_10mg_Z389R9WPGKD7", slug: null, productName: "BPC-157 + TB-500 blend", dosage: "10 mg", purityHplc: 0, scope: "content", testDate: "2026-04-21", lab: "Janoshik Analytical", vendor: "CertaPeptides" },
  { reportCode: "7A73FMWNNBXP", reportId: "136730", reportUrl: "https://verify.janoshik.com/tests/136730-GLOW_GHK_or_GHKCu_TB500_BPC157_70mg_7A73FMWNNBXP", slug: "glow-blend", productName: "Glow blend (GHK-Cu + BPC-157 + TB-500)", dosage: "70 mg", purityHplc: 0, scope: "content", testDate: "2026-04-21", lab: "Janoshik Analytical", vendor: "CertaPeptides" },
  { reportCode: "GMICDF2M1H9W", reportId: "155226", reportUrl: "https://verify.janoshik.com/tests/155226-Tirzepatide_5mg_GMICDF2M1H9W", slug: "tirzepatide", productName: "Tirzepatide", dosage: "5 mg", purityHplc: 99.502, scope: "purity", testDate: "2026-05-27", lab: "Janoshik Analytical", vendor: "CertaPeptides" },
  { reportCode: "71FKHYX63PB2", reportId: "155227", reportUrl: "https://verify.janoshik.com/tests/155227-Semaglutide_5mg_71FKHYX63PB2", slug: "semaglutide", productName: "Semaglutide", dosage: "5 mg", purityHplc: 99.262, scope: "purity", testDate: "2026-05-27", lab: "Janoshik Analytical", vendor: "CertaPeptides" },
  { reportCode: "MPLIPEKPNH78", reportId: "155230", reportUrl: "https://verify.janoshik.com/tests/155230-MOTSC_10mg_MPLIPEKPNH78", slug: "mots-c", productName: "MOTS-c", dosage: "10 mg", purityHplc: 99.301, scope: "purity", testDate: "2026-05-28", lab: "Janoshik Analytical", vendor: "CertaPeptides" },
  { reportCode: "52IY2XTLW8J4", reportId: "155231", reportUrl: "https://verify.janoshik.com/tests/155231-MT2_Melanotan_2_Acetate_10mg_52IY2XTLW8J4", slug: "melanotan-2", productName: "Melanotan-2 (MT-2 Acetate)", dosage: "10 mg", purityHplc: 99.719, scope: "purity", testDate: "2026-05-28", lab: "Janoshik Analytical", vendor: "CertaPeptides" },
  { reportCode: "XLZZ5KNA4P3I", reportId: "155232", reportUrl: "https://verify.janoshik.com/tests/155232-Semax_5mg_XLZZ5KNA4P3I", slug: "semax", productName: "Semax", dosage: "5 mg", purityHplc: 98.550, scope: "purity", testDate: "2026-05-28", lab: "Janoshik Analytical", vendor: "CertaPeptides" },
  { reportCode: "KEZEVYMKGX6L", reportId: "155233", reportUrl: "https://verify.janoshik.com/tests/155233-TB500_5mg_KEZEVYMKGX6L", slug: "tb-500", productName: "TB-500", dosage: "5 mg", purityHplc: 99.171, scope: "purity", testDate: "2026-05-28", lab: "Janoshik Analytical", vendor: "CertaPeptides" },
];

/* Validate once at module load + guard against duplicate report codes. */
const _validated = z.array(ProvenanceRecord).parse(RECORDS);
const _byCode = new Map<string, ProvenanceRecord>();
for (const r of _validated) {
  if (_byCode.has(r.reportCode)) {
    throw new Error(`[provenance] duplicate reportCode: ${r.reportCode}`);
  }
  _byCode.set(r.reportCode, r);
}

export function allProvenance(): ProvenanceRecord[] {
  return _validated;
}

export function provenanceByCode(code: string): ProvenanceRecord | null {
  return _byCode.get(code) ?? null;
}

export function provenanceForSlug(slug: string): ProvenanceRecord[] {
  return _validated.filter((r) => r.slug === slug);
}

/** How a report's purity should read — the value, a content assay, or pending. */
export function purityKind(
  r: Pick<ProvenanceRecord, "purityHplc" | "scope">,
): "purity" | "content" | "pending" {
  if (r.purityHplc > 0) return "purity";
  if (r.scope === "content") return "content";
  return "pending";
}

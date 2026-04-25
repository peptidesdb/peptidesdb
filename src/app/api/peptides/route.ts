import { NextResponse } from "next/server";
import { loadAllPeptides } from "@/lib/content";

export const dynamic = "force-static";

/**
 * GET /api/peptides — list of all peptides (slim form).
 * Returns: [{ slug, name, peptide_class, summary, evidence_level, maturity }]
 */
export async function GET() {
  const peptides = loadAllPeptides().map((p) => ({
    slug: p.slug,
    name: p.name,
    peptide_class: p.peptide_class,
    classification: p.classification,
    categories: p.categories,
    color: p.color,
    summary: p.summary,
    evidence_level: p.evidence_level,
    maturity: p.maturity,
    fda_approved: p.fda_approved,
    last_reviewed: p.last_reviewed,
  }));
  return NextResponse.json(
    { count: peptides.length, peptides },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}

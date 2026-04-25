import { NextResponse } from "next/server";
import { getPeptide, loadAllPeptides } from "@/lib/content";

export const dynamic = "force-static";

export function generateStaticParams() {
  return loadAllPeptides().map((p) => ({ slug: p.slug }));
}

/**
 * GET /api/peptides/[slug] — full peptide profile JSON.
 * Returns the full Peptide schema. Cached at the edge.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const p = getPeptide(slug);
  if (!p) {
    return NextResponse.json(
      { error: "peptide not found", slug },
      { status: 404 }
    );
  }
  return NextResponse.json(p, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

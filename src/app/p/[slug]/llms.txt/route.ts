import { getPeptide, loadAllPeptides } from "@/lib/content";
import { peptideToMarkdown } from "@/lib/peptide-markdown";

export const dynamic = "force-static";
export const dynamicParams = false;

/**
 * /p/<slug>/llms.txt — the plate as clean markdown for AI crawlers.
 * Serves the same gated, cited content as the page (see peptide-markdown.ts),
 * not the raw /ask corpus. Answer engines ingest markdown more reliably than
 * rendered HTML.
 */
export function generateStaticParams() {
  return loadAllPeptides().map((p) => ({ slug: p.slug }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const p = getPeptide(slug);
  if (!p) return new Response("Not found", { status: 404 });
  return new Response(peptideToMarkdown(p), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

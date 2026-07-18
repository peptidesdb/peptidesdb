import { loadAllPeptides } from "@/lib/content";
import { peptideToMarkdown } from "@/lib/peptide-markdown";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/**
 * /llms-full.txt — the full per-compound reference as one markdown document
 * (per the llmstxt.org "full" convention). /llms.txt is the index; this is the
 * complete data. Built from the same gated, cited page content (peptide-
 * markdown.ts), NOT the raw /ask corpus.
 */
export async function GET() {
  const peptides = loadAllPeptides();
  const parts: string[] = [
    "# PeptidesDB — Full Reference Corpus",
    "",
    "> Per-compound research-peptide reference for AI assistants and answer engines. Claims link to primary literature where available. Reference information for research use only; no medical advice.",
    `> Source: ${SITE_URL} · License: MIT · API: ${SITE_URL}/api/peptides`,
    "",
    "---",
    "",
  ];
  for (const p of peptides) {
    parts.push(peptideToMarkdown(p), "", "---", "");
  }
  return new Response(parts.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

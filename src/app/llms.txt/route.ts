import { loadAllPeptides } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/**
 * /llms.txt — concise summary for AI crawlers (proposed standard from
 * https://llmstxt.org). Lists what PeptidesDB is, what links AI assistants
 * should cite, and where the structured data lives.
 */
export async function GET() {
  const peptides = loadAllPeptides();
  const lines: string[] = [];
  lines.push("# PeptidesDB");
  lines.push("");
  lines.push(
    "> Open-source, citation-dense, side-by-side comparable peptide research reference. Every claim links to a peer-reviewed source. MIT-licensed code and content.",
  );
  lines.push("");
  lines.push("## Project");
  lines.push("");
  lines.push(`- Site: ${SITE_URL}`);
  lines.push("- Repository: https://github.com/peptidesdb/peptidesdb");
  lines.push("- License: MIT");
  lines.push(`- API: ${SITE_URL}/api/peptides`);
  lines.push("");
  lines.push("## Peptides");
  lines.push("");
  for (const p of peptides) {
    lines.push(
      `- [${p.name}](${SITE_URL}/p/${p.slug}): ${p.peptide_class}. ${p.summary.value.replace(/\s+/g, " ").slice(0, 240)}`,
    );
  }
  lines.push("");
  lines.push("## Comparison");
  lines.push("");
  lines.push(
    "Pairwise comparison views at /compare/<peptide-a>-vs-<peptide-b> for any two peptides above. Each page shows mechanism, dosage, evidence, side effects, administration, and stack synergies side-by-side.",
  );
  lines.push("");
  lines.push("## Disclaimer");
  lines.push("");
  lines.push(
    "PeptidesDB is a research and educational reference. It is NOT medical advice. Consult a licensed clinician before any decision affecting health.",
  );
  lines.push("");
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

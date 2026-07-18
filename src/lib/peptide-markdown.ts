import "server-only";
import type { Peptide } from "./schemas/peptide";
import { buildQuickFacts, buildFaq, displayClass } from "./answer-blocks";
import { citationsUsedBy } from "./peptide-cites";
import { CITATIONS } from "@/generated/citations";
import { citationLabel, citationUrl } from "./citations";
import { molecularForSlug } from "./molecular";
import { SITE_URL } from "./site";

/* =========================================================
   Plate → markdown for AI crawlers (/p/<slug>/llms.txt, /llms-full.txt).

   Serves the SAME gated, cited content as the rendered page (factual quick
   facts, cited mechanism, gated FAQ, plate reference list) — NOT the raw
   internal /ask corpus, which dumps every uncited dosage/administration row.
   Per-item citations are inlined; the closing list is labelled as the plate's
   reference list (not a per-claim map). (Codex review 2026-07-18.)
   ========================================================= */

function inlineCites(ids: string[]): string {
  return ids.length ? " " + ids.map((id) => `[${id}]`).join(" ") : "";
}

export function peptideToMarkdown(p: Peptide): string {
  const L: string[] = [];
  L.push(`# ${p.name} (${displayClass(p.peptide_class)})`);
  if (p.aliases?.length) L.push(`Also known as: ${p.aliases.join(", ")}`);
  const mol = molecularForSlug(p.slug);
  if (mol) {
    L.push(`Formula ${mol.formula} · ${mol.molecularWeight} g/mol · PubChem CID ${mol.pubchemCid}`);
  }
  L.push("");

  L.push("## Quick facts");
  for (const f of buildQuickFacts(p)) L.push(`- ${f.term}: ${f.value}${inlineCites(f.cite)}`);
  L.push("");

  // Mechanism only when single-compound AND cited (matches the FAQ gate).
  const mt = p.mechanism?.primary_target;
  if (!p.is_blend && mt?.value && (mt.cite?.length ?? 0) > 0) {
    L.push("## Mechanism");
    L.push(`- Primary target: ${mt.value}${inlineCites(mt.cite)}`);
    const pw = p.mechanism.pathway;
    if (pw?.value && (pw.cite?.length ?? 0) > 0) L.push(`- Pathway: ${pw.value}${inlineCites(pw.cite)}`);
    const dz = p.mechanism.downstream_effect;
    if (dz?.value && (dz.cite?.length ?? 0) > 0) L.push(`- Downstream effect: ${dz.value}${inlineCites(dz.cite)}`);
    L.push("");
  }

  const faqs = buildFaq(p);
  if (faqs.length) {
    L.push("## FAQ");
    for (const f of faqs) {
      L.push(`### ${f.q}`);
      L.push(f.a + inlineCites(f.cite));
      L.push("");
    }
  }

  const cites = citationsUsedBy(p);
  if (cites.length) {
    L.push("## References cited on this plate");
    for (const id of cites) {
      const c = CITATIONS[id];
      if (c) L.push(`- [${id}] ${citationLabel(c)} — ${c.title} (${citationUrl(c)})`);
    }
    L.push("");
  }

  L.push(`Source: ${SITE_URL}/p/${p.slug}`);
  L.push("Reference information for research use only. No medical advice.");
  return L.join("\n");
}

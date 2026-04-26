import "server-only";
import { loadAllPeptides } from "./content";
import { CITATIONS } from "@/generated/citations";
import { citationLabel, citationUrl } from "./citations";
import type { CitableValue, Peptide } from "./schemas/peptide";

/* =========================================================
   "Ask PeptidesDB" RAG corpus.
   For 30 peptides, full-text in-context is feasible — no
   embeddings, no vector DB. We flatten each peptide profile
   into a paragraph-size chunk + cite list, score keyword
   relevance, and pass the top-K chunks to Claude with strict
   "only use this content" instructions.
   ========================================================= */

export interface CorpusChunk {
  slug: string;
  name: string;
  text: string;
  cites: string[];
}

function citeText(v: CitableValue | undefined): string {
  if (!v) return "";
  return v.value;
}

function flattenPeptide(p: Peptide): CorpusChunk {
  const lines: string[] = [];
  lines.push(`# ${p.name} (${p.peptide_class})`);
  lines.push(`Slug: ${p.slug} | Evidence: ${p.evidence_level} | FDA-approved: ${p.fda_approved ? "yes" : "no"}`);
  lines.push(p.summary.value);
  lines.push("");
  lines.push("## Hero stats");
  for (const stat of p.hero_stats) {
    lines.push(`- ${stat.label}: ${stat.value}`);
  }
  lines.push(`Route: ${p.hero_route.value}`);
  lines.push("");
  lines.push("## Mechanism");
  lines.push(`- Primary target: ${citeText(p.mechanism.primary_target)}`);
  lines.push(`- Pathway: ${citeText(p.mechanism.pathway)}`);
  lines.push(`- Downstream effect: ${citeText(p.mechanism.downstream_effect)}`);
  if (p.mechanism.origin) lines.push(`- Origin: ${citeText(p.mechanism.origin)}`);
  if (p.mechanism.feedback_intact) lines.push(`- Feedback intact: ${citeText(p.mechanism.feedback_intact)}`);
  if (p.mechanism.antibody_development)
    lines.push(`- Antibody development: ${citeText(p.mechanism.antibody_development)}`);
  lines.push("");
  lines.push("## Dosage");
  for (const row of p.dosage.rows) {
    const note = row.notes ? ` (${row.notes.value})` : "";
    lines.push(`- ${row.parameter}: ${citeText(row.value)}${note}`);
  }
  lines.push("");
  if (p.fat_loss) {
    lines.push("## Fat-loss / metabolic evidence");
    lines.push(`Evidence strength: ${p.fat_loss.evidence_strength}/100. ${citeText(p.fat_loss.evidence_meta)}`);
    for (const row of p.fat_loss.rows) {
      lines.push(`- ${row.parameter}: ${citeText(row.value)}`);
    }
    lines.push("");
  }
  lines.push("## Side effects + safety");
  for (const row of p.side_effects.rows) {
    const sev = row.severity ? `[${row.severity}] ` : "";
    lines.push(`- ${sev}${row.parameter}: ${citeText(row.value)}`);
  }
  if (p.side_effects.contraindications_absolute?.length) {
    lines.push("Absolute contraindications:");
    for (const c of p.side_effects.contraindications_absolute) lines.push(`  - ${c.value}`);
  }
  if (p.side_effects.contraindications_relative?.length) {
    lines.push("Relative contraindications:");
    for (const c of p.side_effects.contraindications_relative) lines.push(`  - ${c.value}`);
  }
  lines.push("");
  lines.push("## Administration");
  for (const step of p.administration.steps) {
    lines.push(`- ${step.title}: ${step.body}`);
  }
  lines.push("");
  if (p.synergy?.stacks.length) {
    lines.push("## Documented synergies");
    for (const stack of p.synergy.stacks) {
      lines.push(`- ${p.name} + ${stack.partner_label} (${stack.synergy} synergy)`);
      lines.push(`  Rationale: ${stack.rationale}`);
      lines.push(`  Primary benefit: ${stack.primary_benefit}`);
    }
  }

  // Aggregate every cite ID referenced in this peptide
  const citeSet = new Set<string>();
  function collect(v: CitableValue | undefined) {
    if (!v) return;
    for (const c of v.cite ?? []) citeSet.add(c);
  }
  collect(p.summary);
  collect(p.hero_route);
  for (const stat of p.hero_stats) {
    for (const c of stat.cite ?? []) citeSet.add(c);
  }
  collect(p.mechanism.primary_target);
  collect(p.mechanism.pathway);
  collect(p.mechanism.downstream_effect);
  collect(p.mechanism.origin);
  collect(p.mechanism.feedback_intact);
  collect(p.mechanism.antibody_development);
  for (const row of p.dosage.rows) {
    collect(row.value);
    if (row.notes) collect(row.notes);
  }
  if (p.fat_loss) {
    collect(p.fat_loss.evidence_meta);
    for (const row of p.fat_loss.rows) {
      collect(row.value);
      if (row.notes) collect(row.notes);
    }
  }
  for (const row of p.side_effects.rows) {
    collect(row.value);
    if (row.notes) collect(row.notes);
  }
  for (const c of p.side_effects.contraindications_absolute ?? []) collect(c);
  for (const c of p.side_effects.contraindications_relative ?? []) collect(c);
  for (const step of p.administration.steps) {
    for (const c of step.cite ?? []) citeSet.add(c);
  }
  if (p.synergy) {
    for (const stack of p.synergy.stacks) {
      for (const c of stack.cite ?? []) citeSet.add(c);
    }
  }

  return {
    slug: p.slug,
    name: p.name,
    text: lines.join("\n"),
    cites: [...citeSet],
  };
}

let _corpus: CorpusChunk[] | null = null;

export function getCorpus(): CorpusChunk[] {
  if (_corpus) return _corpus;
  _corpus = loadAllPeptides().map(flattenPeptide);
  return _corpus;
}

/**
 * Token-overlap relevance ranker. Trades sophistication for being
 * deterministic + fast + zero-cost. Returns top-K chunks for a query.
 */
export function rankByQuery(query: string, k: number = 6): CorpusChunk[] {
  const corpus = getCorpus();
  const tokens = query
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter((t) => t.length > 2);
  if (tokens.length === 0) return corpus.slice(0, k);

  const scored = corpus.map((c) => {
    const lower = c.text.toLowerCase();
    let score = 0;
    for (const t of tokens) {
      const occ = lower.split(t).length - 1;
      score += occ;
      // Boost when token matches the peptide name / slug
      if (c.name.toLowerCase().includes(t)) score += 5;
      if (c.slug.includes(t)) score += 5;
    }
    return { c, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored
    .filter((s) => s.score > 0)
    .slice(0, k)
    .map((s) => s.c);
}

/** Format the citation appendix the model can reference. */
export function citationAppendix(usedCiteIds: Set<string>): string {
  const lines: string[] = [];
  for (const id of [...usedCiteIds].sort()) {
    const cite = CITATIONS[id];
    if (!cite) continue;
    lines.push(`[${id}] ${citationLabel(cite)} — ${cite.title} (${cite.journal ?? cite.type}, ${cite.year}). ${citationUrl(cite)}`);
  }
  return lines.join("\n");
}

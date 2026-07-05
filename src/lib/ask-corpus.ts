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

/* ---------------------------------------------------------
   Query normalization + entity index. Every peptide name, slug,
   and alias is mapped to its slug, normalized so "BPC-157",
   "bpc 157", and "bpc-157" all resolve. Used to PIN any peptide
   named in the query so a multi-entity comparison ("semaglutide
   vs tirzepatide") always retrieves both, regardless of how the
   token frequencies fall out.
   --------------------------------------------------------- */
function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function tokenize(s: string): string[] {
  return normalize(s)
    .split(" ")
    .filter((t) => t.length > 2);
}

/* Normalized name/slug/alias -> the slug(s) that key can name. Values are
   arrays because aliases collide across peptides (e.g. both "epitalon" and the
   variant "n-acetyl-epitalon-amidate" answer to "epitalon", and "kedg" names
   both crystagen and testagen); we pin ALL candidates instead of silently
   overwriting. A key that is a peptide's OWN name/slug is listed first so the
   directly-named peptide always pins. `maxWords` is the longest key length so
   the query scan window covers multi-word names ("N-Acetyl Epitalon Amidate"). */
interface EntityIndex {
  map: Map<string, string[]>;
  maxWords: number;
}
let _entityIndex: EntityIndex | null = null;
function getEntityIndex(): EntityIndex {
  if (_entityIndex) return _entityIndex;
  const map = new Map<string, string[]>();
  let maxWords = 1;
  const add = (key: string, slug: string, isSelf: boolean) => {
    const norm = normalize(key);
    if (norm.length < 2) return;
    maxWords = Math.max(maxWords, norm.split(" ").length);
    const cur = map.get(norm);
    if (!cur) {
      map.set(norm, [slug]);
    } else if (!cur.includes(slug)) {
      // Own-name/slug matches pin first; alias-only matches append.
      if (isSelf) cur.unshift(slug);
      else cur.push(slug);
    }
  };
  for (const p of loadAllPeptides()) {
    add(p.name, p.slug, true);
    add(p.slug, p.slug, true);
    add(p.slug.replace(/-/g, " "), p.slug, true);
    for (const alias of p.aliases ?? []) add(alias, p.slug, false);
  }
  _entityIndex = { map, maxWords };
  return _entityIndex;
}

/** Slugs of every peptide named or aliased anywhere in the query. */
function detectEntities(query: string): string[] {
  const { map, maxWords } = getEntityIndex();
  const words = normalize(query).split(" ").filter(Boolean);
  const found = new Set<string>();
  // Slide windows up to the longest indexed key so multi-word names and
  // hyphenated slugs both resolve.
  for (let n = 1; n <= maxWords; n++) {
    for (let i = 0; i + n <= words.length; i++) {
      const slugs = map.get(words.slice(i, i + n).join(" "));
      if (slugs) for (const s of slugs) found.add(s);
    }
  }
  return [...found];
}

/* ---------------------------------------------------------
   Inverse document frequency — down-weights tokens that occur
   in many plates ("weight", "loss", "dose") so they stop
   flooding the ranker, and up-weights discriminating terms.
   Computed once over the corpus and cached.
   --------------------------------------------------------- */
let _idf: Map<string, number> | null = null;
function getIdf(): Map<string, number> {
  if (_idf) return _idf;
  const corpus = getCorpus();
  const n = corpus.length;
  const df = new Map<string, number>();
  for (const c of corpus) {
    for (const t of new Set(tokenize(c.text))) {
      df.set(t, (df.get(t) ?? 0) + 1);
    }
  }
  const idf = new Map<string, number>();
  for (const [t, d] of df) idf.set(t, Math.log((n + 1) / (d + 1)) + 1);
  _idf = idf;
  return idf;
}

/* Hard ceiling on retrieved chunks (~800 tokens each) so a query naming many
   peptides can never balloon the model context. Pinned entities fill first, up
   to this cap; TF-IDF fills the remaining slots. */
const MAX_CHUNKS = 10;

/**
 * TF-IDF relevance ranker with entity pinning. Deterministic, fast,
 * zero-cost. Any peptide named in the query is force-included; the remaining
 * slots are filled by TF-IDF score. Never returns more than MAX_CHUNKS chunks,
 * regardless of how many entities the query names.
 */
export function rankByQuery(query: string, k: number = 8): CorpusChunk[] {
  const corpus = getCorpus();
  const idf = getIdf();
  const tokens = tokenize(query);
  const pinned = detectEntities(query);

  const scored = corpus.map((c) => {
    const lower = c.text.toLowerCase();
    const name = c.name.toLowerCase();
    let score = 0;
    for (const t of tokens) {
      const weight = idf.get(t) ?? 1;
      const occ = lower.split(t).length - 1;
      if (occ > 0) score += Math.log(1 + occ) * weight;
      if (name.includes(t)) score += 4 * weight;
    }
    return { c, score };
  });
  scored.sort((a, b) => b.score - a.score);

  const out: CorpusChunk[] = [];
  const seen = new Set<string>();
  // Pinned entities first — a named peptide is never dropped — but bounded by
  // the ceiling so a pathological many-entity query can't flood the context.
  for (const slug of pinned) {
    if (out.length >= MAX_CHUNKS) break;
    const chunk = corpus.find((c) => c.slug === slug);
    if (chunk && !seen.has(slug)) {
      out.push(chunk);
      seen.add(slug);
    }
  }
  const target = Math.min(MAX_CHUNKS, Math.max(k, out.length));
  for (const { c, score } of scored) {
    if (out.length >= target) break;
    if (score <= 0 || seen.has(c.slug)) continue;
    out.push(c);
    seen.add(c.slug);
  }
  return out;
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

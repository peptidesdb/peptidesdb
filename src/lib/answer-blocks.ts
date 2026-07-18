import "server-only";
import type { Peptide } from "./schemas/peptide";

/* =========================================================
   Answer-shaped blocks — Quick facts + FAQ.

   Derived strictly from existing YAML fields. Integrity rules (Codex review
   2026-07-18, two rounds):
   - NO EXTRACTED DOSE. The dosage rows mix anecdotal/community ranges with
     citations to studies that used DIFFERENT values (e.g. BPC-157 shows an
     anecdotal 250–500 mcg/day range while the cited Phase-2 study used 1 mg
     IV/day), and the disambiguating `note` is lost on extraction. A stripped
     "studied at X [cite]" claim would misrepresent the source, so dose is NOT
     surfaced in Quick-facts / FAQ / markdown. The full dosage TABLE (with its
     notes + citations preserving that nuance) stays on the plate page.
   - No block asserts "cited"/"in the literature" unless the field has cite[].
   - HALF-LIFE: only a hero-stat half-life that is QUANTITATIVE (contains a
     digit) — never qualitative prose like "Hours".
   - SIDE EFFECTS: FAQ only includes CITED rows; omitted if none are cited.
   - BLENDS (is_blend): skip the single-compound mechanism answer.
   - FDA: `fda_approved` is US-scope; "not FDA-approved in the US", never
     "not approved for human use" (some compounds are approved abroad).

   Compliance: RUO throughout — reference framing, never dosing content.
   ========================================================= */

export interface Fact {
  term: string;
  value: string;
  cite: string[];
}

export interface Faq {
  q: string;
  a: string;
  cite: string[];
}

const EVIDENCE_LABEL: Record<Peptide["evidence_level"], string> = {
  "fda-approved": "FDA-approved",
  "phase-3": "Phase 3 clinical",
  "phase-2": "Phase 2 clinical",
  "phase-1": "Phase 1 clinical",
  "animal-strong": "Strong animal evidence",
  "animal-mechanistic": "Mechanistic animal evidence",
  "human-mechanistic": "Human mechanistic evidence",
  theoretical: "Theoretical / early",
};

/** Half-life from a hero stat, but ONLY when quantitative (contains a digit) —
 *  never qualitative prose like "Hours". */
function halfLife(p: Peptide): { value: string; cite: string[] } | null {
  const hs = p.hero_stats.find((s) => /half.?life/i.test(s.label));
  if (hs && /\d/.test(hs.value) && (hs.cite?.length ?? 0) > 0) {
    return { value: hs.value, cite: hs.cite };
  }
  return null;
}

/** US-FDA status line (fda_approved is US-scope). */
function regulatoryStatus(p: Peptide): string {
  // No approval YEAR — approval_year mixes US/EU dates across the corpus, and
  // this line is US-scoped; asserting a specific year risks being wrong.
  return p.fda_approved ? "FDA-approved (US)" : "Not FDA-approved (US) — research use only";
}

/** Class label with any trailing route parenthetical stripped, e.g.
 *  "Ghrelin Receptor Agonist (oral)" -> "Ghrelin Receptor Agonist". Use
 *  everywhere peptide_class is rendered so no route hint leaks. */
export function displayClass(cls: string): string {
  return cls.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

/** Definition-list of the facts an answer engine most often needs. Each fact
 *  carries only the citations of the field it came from (may be empty). */
export function buildQuickFacts(p: Peptide): Fact[] {
  // Only non-advisory factual metadata. NO summary (shown in the hero above),
  // NO dose, NO route/schedule; displayClass strips any route parenthetical.
  const facts: Fact[] = [{ term: "Class", value: displayClass(p.peptide_class), cite: [] }];
  const hl = halfLife(p);
  if (hl) facts.push({ term: "Half-life", value: hl.value, cite: hl.cite });
  facts.push({
    term: "Evidence level",
    value: EVIDENCE_LABEL[p.evidence_level] ?? p.evidence_level,
    cite: [],
  });
  facts.push({ term: "Regulatory status", value: regulatoryStatus(p), cite: [] });
  return facts;
}

/** FAQ derived from cited/well-formed fields. Question phrasing targets the
 *  winnable per-compound query cluster; answers stay reference-only (RUO). */
export function buildFaq(p: Peptide): Faq[] {
  const name = p.name;
  // Every FAQ answer must be factual (FDA/class) OR carry a citation — uncited
  // descriptive/medical prose is never emitted into FAQPage structured data.
  // Compliance-first: only factual (FDA) or fully-cited, non-advisory answers.
  // Summary + side-effect prose are NOT emitted — even cited, they carry
  // route/schedule/actionable language that must not enter FAQPage structured
  // data. (Codex review 2026-07-18, rounds 3-4.)
  const faqs: Faq[] = [];

  const hl = halfLife(p);
  if (hl) {
    faqs.push({
      q: `What is the half-life of ${name}?`,
      a: `The reported half-life of ${name} is ${hl.value}.`,
      cite: hl.cite,
    });
  }

  // Single-compound mechanism only (blends render malformed); pathway appended
  // only when it too is cited.
  const mt = p.mechanism?.primary_target;
  if (!p.is_blend && mt?.value && (mt.cite?.length ?? 0) > 0) {
    const pw = p.mechanism.pathway;
    const pwOk = Boolean(pw?.value && (pw.cite?.length ?? 0) > 0);
    faqs.push({
      q: `How does ${name} work?`,
      a: `${name} acts on ${mt.value}${pwOk ? `, signalling via ${pw!.value}` : ""}.`,
      cite: [...mt.cite, ...(pwOk ? pw!.cite : [])],
    });
  }

  faqs.push({
    q: `Is ${name} FDA-approved?`,
    a: p.fda_approved
      ? `Yes — ${name} is approved by the US FDA.`
      : `${name} is not FDA-approved in the United States and is handled as a research compound (research use only). Regulatory status may differ in other jurisdictions.`,
    cite: [],
  });

  return faqs;
}

/** Related plates by shared categories (then same class), for the internal
 *  link graph. Deterministic: sorted by shared-category count desc, then name. */
export function relatedPeptides(p: Peptide, all: Peptide[], n = 6): Peptide[] {
  const cats = new Set(p.categories);
  const scored = all
    .filter((x) => x.slug !== p.slug)
    .map((x) => {
      const shared = x.categories.filter((c) => cats.has(c)).length;
      const sameClass = x.peptide_class === p.peptide_class ? 1 : 0;
      return { x, score: shared * 10 + sameClass };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.x.name.localeCompare(b.x.name));
  return scored.slice(0, n).map((s) => s.x);
}

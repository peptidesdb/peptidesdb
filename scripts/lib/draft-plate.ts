/**
 * PlateDrafter — Claude-backed first-pass authoring of a peptide plate.
 *
 * Scope: produce a Zod-valid `Peptide` YAML plus the matching new
 * `Citation` registry entries, GROUNDED in real PubMed papers we
 * pre-fetched and handed to Claude. The output is `auto-drafted`
 * maturity by definition — every plate flows through the editorial
 * workflow at docs/designs/peptide-editorial-workflow.md before promote.
 *
 * Architecture
 * ------------
 *   1. Caller pre-fetches a list of candidate PubMed papers (via
 *      scripts/lib/pubmed-client) and assigns each a provisional
 *      citation_id of the form `<lastname-year>`.
 *   2. PlateDrafter.draft() builds a system+user prompt that:
 *        a. Describes the Peptide schema in plain prose
 *        b. Lists each candidate with id, PMID, title, year, abstract
 *        c. Includes a known-good plate as a style example
 *        d. Forbids inventing PMIDs or citation IDs not in the list
 *   3. Claude returns a JSON document. We parse it, validate against
 *      the Peptide Zod schema, and retry once with the validation
 *      error appended if the first attempt fails.
 *   4. Caller post-processes: extract every USED cite_id from the
 *      validated peptide, return matching `Citation` entries built
 *      from the candidate metadata so the caller can append them to
 *      content/refs.yaml.
 *
 * Cost (claude-sonnet-4-5 default)
 * --------------------------------
 *   ~$0.005-0.010 per plate at typical input/output sizes. Full Wave 1
 *   (17 plates) ≈ $0.10. Full corpus (60 plates) ≈ $0.40. Negligible
 *   compared to claim-linker's per-claim verification cost.
 */

import yaml from "js-yaml";
import { Peptide } from "../../src/lib/schemas/peptide";
import type { Peptide as PeptideType } from "../../src/lib/schemas/peptide";
import type { Citation } from "../../src/lib/schemas/citation";
import type { PubmedRecord } from "./pubmed-client";
import type { AnthropicLike } from "./claim-linker";

/** A candidate paper handed to Claude. The `citation_id` is what the
 *  drafter must use in any cite[] arrays — Claude does not invent IDs. */
export interface Candidate {
  citation_id: string;
  pmid: string;
  title: string;
  year: number | null;
  authors: string;
  abstract: string;
}

export interface DraftPlateOptions {
  /** Display name, e.g., "Cagrilintide". */
  name: string;
  /** URL slug, e.g., "cagrilintide". Defaults to slugify(name). */
  slug?: string;
  /** 1-3 sentences of editorial guidance that ride alongside the schema. */
  brief?: string;
  /** Candidate papers, pre-resolved by the caller. */
  candidates: Candidate[];
  /** A known-good plate the drafter can imitate (recommended: tesamorelin). */
  styleExample: PeptideType;
  /** Anthropic client. */
  anthropic: AnthropicLike;
  /** Default `claude-sonnet-4-5` — better at structured YAML/JSON than Haiku. */
  model?: string;
  /** Max attempts on Zod validation failure. Default 2. */
  maxAttempts?: number;
  /** Optional logger. */
  log?: (msg: string) => void;
}

export interface DraftPlateResult {
  /** Validated Peptide ready to serialize. */
  peptide: PeptideType;
  /** YAML serialization of `peptide` for writing to disk. */
  yaml: string;
  /** Citations to append to content/refs.yaml — only the candidates
   *  that the draft actually USED. */
  newCitations: Citation[];
  /** Non-fatal issues (unused candidates, retries used, etc.). */
  warnings: string[];
}

const SYSTEM_PROMPT = `You are a peptide research librarian drafting a profile for peptidesdb.org, an atlas of research peptides where every claim must be backed by a real PubMed paper.

Your job: given a peptide name, a brief, and a list of CANDIDATE PubMed papers we have already pre-fetched for you, produce a JSON document matching the Peptide schema described below.

HARD RULES:
- Use ONLY the candidate papers listed in the user message for citations. Do not invent PMIDs or citation IDs.
- Reference candidates by their \`citation_id\` (the id we provided), never by raw PMID.
- If a section has no supporting candidate, leave its \`cite\` array empty. We mark uncited claims explicitly.
- maturity must be "auto-drafted". evidence_level must be one of the enum values listed below.
- Citable fields use the explicit object form: { value: "...", cite: ["id"] }. Plain strings are reserved for decorative labels.

OUTPUT: a single JSON object inside one \`\`\`json fenced block. No preamble, no commentary.

Match the style example's prose voice. Atlas voice: terse, hairline, no superlatives, no marketing copy.`;

const SCHEMA_DESCRIPTION = `
Peptide schema (TypeScript Zod, abridged):

{
  schema_version: 1,
  slug: string (lowercase + hyphens),
  name: string,
  peptide_class: string,
  classification?: string,
  categories: string[],
  aliases: string[],
  color: "blue" | "green" | "purple" | "amber" | "rose" | "cyan" | "teal",
  evidence_level: "fda-approved" | "phase-3" | "phase-2" | "phase-1" | "animal-strong" | "animal-mechanistic" | "human-mechanistic" | "theoretical",
  fda_approved: boolean,
  approval_year?: number,
  last_reviewed: string (YYYY-MM-DD),

  summary: { value: string, cite: string[] },
  hero_route: { value: string, cite: string[] },
  hero_stats: [3 × { value: string, label: string, cite: string[] }],

  mechanism: {
    primary_target: { value, cite },
    pathway: { value, cite },
    downstream_effect: { value, cite },
    origin?: { value, cite },
    feedback_intact?: { value, cite },
    antibody_development?: { value, cite },
    receptor_class?: { value, cite },
    half_life_basis?: { value, cite },
    extra_rows?: [{ key: string, value: { value, cite } }],
    diagram?: [{ kind: "node" | "arrow" | "outcome", text: { value, cite } }],
  },

  dosage: { rows: [{ parameter: string, value: { value, cite }, notes?: { value, cite }, severity?: "mild"|"moderate"|"severe" }] },

  fat_loss?: {
    evidence_strength: number (0-100),
    evidence_level: <enum>,
    evidence_meta: { value, cite },
    rows: [<TableRow>],
  },

  side_effects: {
    rows: [<TableRow>],
    contraindications_absolute?: [{ value, cite }],
    contraindications_relative?: [{ value, cite }],
  },

  administration: {
    steps: [{ title: string, body: string, cite: string[] }],
  },

  synergy?: {
    stacks: [{
      partner_slug: string, partner_label: string,
      synergy: "strong"|"moderate"|"weak"|"multi-pathway",
      rationale: string (≥40 chars),
      protocol: { [key: string]: string },
      primary_benefit: string (≥4 chars),
      cite: string[],
    }],
  },

  description_md?: string,
  maturity: "auto-drafted",
  contributors: string[] (GitHub handles only),
}
`.trim();

export class PlateDrafter {
  async draft(opts: DraftPlateOptions): Promise<DraftPlateResult> {
    const log = opts.log ?? (() => {});
    const slug = opts.slug ?? slugify(opts.name);
    const maxAttempts = opts.maxAttempts ?? 2;
    const model = opts.model ?? "claude-sonnet-4-5";
    const warnings: string[] = [];

    const userPrompt = buildUserPrompt(opts, slug);

    let lastError: string | null = null;
    let parsed: unknown = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      log(`[drafter] ${slug}: attempt ${attempt}/${maxAttempts}`);
      const messages = [{ role: "user" as const, content: userPrompt }];
      if (lastError) {
        messages.push({
          role: "user" as const,
          content: `The previous draft failed Zod validation:\n\n${lastError}\n\nPlease re-emit the corrected JSON, preserving everything else.`,
        });
      }

      const response = await opts.anthropic.messages.create({
        model,
        max_tokens: 8000,
        system: SYSTEM_PROMPT + "\n\n" + SCHEMA_DESCRIPTION,
        messages,
      });
      const text = response.content.find((c) => c.type === "text")?.text ?? "";
      const jsonStr = extractJsonBlock(text);
      if (!jsonStr) {
        lastError = "No JSON block found in response.";
        continue;
      }

      try {
        parsed = JSON.parse(jsonStr);
      } catch (e) {
        lastError = `JSON parse failed: ${(e as Error).message}`;
        continue;
      }

      const result = Peptide.safeParse(parsed);
      if (result.success) {
        if (attempt > 1) warnings.push(`succeeded on attempt ${attempt}`);
        const peptide = result.data;
        const newCitations = collectCitedCandidates(peptide, opts.candidates, warnings);
        return {
          peptide,
          yaml: yaml.dump(peptide, { lineWidth: 100, noRefs: true }),
          newCitations,
          warnings,
        };
      }
      lastError = formatZodError(result.error);
    }

    throw new Error(
      `[drafter] ${slug}: gave up after ${maxAttempts} attempts. Last error:\n${lastError}`,
    );
  }
}

/** Extract the first \`\`\`json ... \`\`\` block, or fall back to the first
 *  balanced JSON object in the text. */
export function extractJsonBlock(text: string): string | null {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence && fence[1].trim()) return fence[1].trim();

  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

/** Walk the validated peptide, collect every cite_id used, look up each
 *  in the candidate list, and emit a `Citation` ready for refs.yaml. */
function collectCitedCandidates(
  peptide: PeptideType,
  candidates: Candidate[],
  warnings: string[],
): Citation[] {
  const usedIds = collectAllCiteIds(peptide);
  const byId = new Map(candidates.map((c) => [c.citation_id, c]));
  const citations: Citation[] = [];

  for (const id of usedIds) {
    const cand = byId.get(id);
    if (!cand) {
      warnings.push(`cite "${id}" used in draft but not in candidate list — caller must reconcile`);
      continue;
    }
    citations.push({
      id: cand.citation_id,
      type: "journal",
      title: cand.title,
      year: cand.year ?? new Date().getFullYear(),
      pmid: cand.pmid,
      authors: cand.authors ? [cand.authors] : undefined,
    });
  }

  const unusedCount = candidates.filter((c) => !usedIds.has(c.citation_id)).length;
  if (unusedCount > 0) {
    warnings.push(`${unusedCount} candidate(s) provided but not cited by the draft`);
  }
  return citations;
}

function collectAllCiteIds(peptide: PeptideType): Set<string> {
  const ids = new Set<string>();
  function visit(n: unknown): void {
    if (!n) return;
    if (Array.isArray(n)) {
      n.forEach(visit);
      return;
    }
    if (typeof n !== "object") return;
    const obj = n as Record<string, unknown>;
    const cite = obj.cite;
    if (Array.isArray(cite)) for (const id of cite) if (typeof id === "string" && id) ids.add(id);
    for (const v of Object.values(obj)) visit(v);
  }
  visit(peptide as unknown);
  return ids;
}

function buildUserPrompt(opts: DraftPlateOptions, slug: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const candidatesBlock = opts.candidates
    .map((c, i) => {
      const head = `[${i + 1}] id="${c.citation_id}" pmid=${c.pmid} year=${c.year ?? "?"} authors="${c.authors}"`;
      return `${head}\n    title: ${c.title}\n    abstract: ${c.abstract.replace(/\n+/g, " ").slice(0, 1500)}`;
    })
    .join("\n\n");

  const styleYaml = yaml.dump(opts.styleExample, { lineWidth: 100, noRefs: true });

  return [
    `Peptide name: ${opts.name}`,
    `Suggested slug: ${slug}`,
    `last_reviewed: ${today}`,
    "",
    opts.brief ? `Editorial brief:\n${opts.brief}` : "Editorial brief: (none — work from the candidate papers).",
    "",
    `Candidate papers (use these IDs in cite[] only — do not invent):`,
    "",
    candidatesBlock,
    "",
    `Style example (one of our existing plates — match this voice and structure):`,
    "",
    "```yaml",
    styleYaml,
    "```",
    "",
    `Now produce the JSON for the new "${opts.name}" plate.`,
  ].join("\n");
}

/** Convert "MOTS-c" → "mots-c", "BPC-157" → "bpc-157", "Glutathione 1500mg" → "glutathione". */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b\d+\s*m[gc]g?\b/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}

/** Convert PubmedRecord to a Candidate with a generated citation_id. */
export function recordToCandidate(record: PubmedRecord, abstract: string): Candidate {
  const id = generateCitationId(record);
  return {
    citation_id: id,
    pmid: record.pmid,
    title: record.title,
    year: record.year,
    authors: record.firstAuthor ?? "Unknown",
    abstract,
  };
}

/** Build a `lastname-year` citation_id from a PubmedRecord. */
export function generateCitationId(r: PubmedRecord): string {
  const lastName = (r.firstAuthor ?? "anon").split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, "");
  const year = r.year ?? "0000";
  return `${lastName || "anon"}-${year}`;
}

function formatZodError(err: { issues?: unknown[]; message?: string }): string {
  if (!err.issues || !Array.isArray(err.issues)) return err.message ?? "Unknown error";
  return err.issues
    .slice(0, 8)
    .map((iss) => {
      const i = iss as { path?: unknown[]; message?: string };
      const path = Array.isArray(i.path) ? i.path.join(".") : "(root)";
      return `  - ${path}: ${i.message ?? "(no message)"}`;
    })
    .join("\n");
}

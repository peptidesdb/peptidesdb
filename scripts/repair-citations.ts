#!/usr/bin/env bun
/**
 * repair-citations — propose PMID/title fixes for failing entries in
 * content/refs.yaml. NEVER modifies the file; produces a structured
 * markdown proposal at docs/designs/citation-repair-<date>.md.
 *
 * Workflow
 * --------
 *   1. Run audit:citations to find failing entries.
 *   2. For each failure, classify:
 *      - HIGH-CONFIDENCE TITLE-ONLY FIX: PMID already matches (Dice ≥ 0.70
 *        with our title) — same paper, our title is just abbreviated.
 *        Propose: keep PMID, replace our title with PubMed's canonical.
 *      - PMID REPLACEMENT CANDIDATE: search PubMed by our title; if top
 *        result has Dice ≥ 0.85 AND year is within ±1, propose: replace
 *        PMID + title.
 *      - MANUAL REVIEW REQUIRED: no candidate confident enough; surface
 *        the top-3 search results so a human can pick.
 *   3. Write the proposal as markdown for human review.
 *
 * Usage:
 *   bun run scripts/repair-citations.ts
 *   PUBMED_API_KEY=... bun run scripts/repair-citations.ts  # 10 req/s
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { CitationRegistry, type Citation } from "../src/lib/schemas/citation";
import {
  PubmedClient,
  TITLE_MATCH_THRESHOLD,
  diceCoefficient,
  type PubmedRecord,
} from "./lib/pubmed-client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REFS_PATH = join(__dirname, "..", "content", "refs.yaml");
const OUT_PATH = join(__dirname, "..", "docs", "designs", "citation-repair-2026-04-26.md");

/** Probably-the-same-paper threshold. Below 0.85 (audit gate) but above
 *  the wrong-paper noise floor (~0.5). Reserve for "title abbreviation"
 *  repairs only. */
const ABBREVIATION_THRESHOLD = 0.70;

type Proposal =
  | {
      kind: "title-only";
      id: string;
      pmid: string;
      currentTitle: string;
      proposedTitle: string;
      diceScore: number;
    }
  | {
      kind: "pmid-replacement";
      id: string;
      currentPmid: string | null;
      currentTitle: string;
      proposedPmid: string;
      proposedTitle: string;
      diceScore: number;
      yearOurs: number;
      yearProposed: number | null;
    }
  | {
      kind: "manual-review";
      id: string;
      currentPmid: string | null;
      currentTitle: string;
      yearOurs: number;
      candidates: Array<{
        pmid: string;
        title: string;
        year: number | null;
        diceScore: number;
      }>;
    };

async function main(): Promise<void> {
  const raw = readFileSync(REFS_PATH, "utf-8");
  const parsed = yaml.load(raw);
  const result = CitationRegistry.safeParse(parsed);
  if (!result.success) {
    console.error("[repair] refs.yaml failed schema validation:", result.error.message);
    process.exit(1);
  }
  const registry = result.data;

  const client = new PubmedClient({
    apiKey: process.env.PUBMED_API_KEY,
    log: (msg) => console.error(msg),
    cacheDir: join(__dirname, "..", ".pubmed-cache"),
  });

  const entries = Object.entries(registry).filter(([, c]) => c.pmid);
  console.log(`[repair] auditing ${entries.length} PMIDs to find failures…`);

  const proposals: Proposal[] = [];

  for (const [id, citation] of entries) {
    const proposal = await classify(client, id, citation);
    if (proposal) {
      proposals.push(proposal);
      console.log(`[repair]   ${id}: ${proposal.kind}`);
    }
  }

  console.log(`[repair] done. ${proposals.length} proposals generated.`);
  writeFileSync(OUT_PATH, renderMarkdown(proposals), "utf-8");
  console.log(`[repair] wrote proposals to ${OUT_PATH}`);
}

async function classify(
  client: PubmedClient,
  id: string,
  citation: Citation,
): Promise<Proposal | null> {
  const currentPmid = citation.pmid!;
  const currentRecord = await client.verifyPmid(currentPmid);

  // Case 1: PMID resolves AND title matches (≥0.85) → no repair needed.
  if (currentRecord) {
    const score = diceCoefficient(citation.title, currentRecord.title);
    if (score >= TITLE_MATCH_THRESHOLD) return null;

    // Case 2: PMID resolves AND title score in [0.70, 0.85) → likely
    // the same paper, our title is just abbreviated. Auto-update title.
    if (score >= ABBREVIATION_THRESHOLD) {
      return {
        kind: "title-only",
        id,
        pmid: currentPmid,
        currentTitle: citation.title,
        proposedTitle: currentRecord.title,
        diceScore: score,
      };
    }
    // Else fall through: PMID resolves but to a wrong paper. Search.
  }

  // Case 3 + 4: PMID either doesn't resolve OR resolves to a wrong paper.
  // Search PubMed using our title to find candidates.
  const candidatePmids = await client.searchPubmed(citation.title, 5);
  const candidates: Array<{ record: PubmedRecord; score: number }> = [];
  for (const pmid of candidatePmids) {
    const record = await client.verifyPmid(pmid);
    if (!record) continue;
    candidates.push({
      record,
      score: diceCoefficient(citation.title, record.title),
    });
  }
  candidates.sort((a, b) => b.score - a.score);

  // Case 3: Top candidate is high-confidence (Dice ≥0.85 AND year ±1).
  const top = candidates[0];
  if (
    top &&
    top.score >= TITLE_MATCH_THRESHOLD &&
    top.record.year !== null &&
    Math.abs(citation.year - top.record.year) <= 1
  ) {
    return {
      kind: "pmid-replacement",
      id,
      currentPmid: currentPmid,
      currentTitle: citation.title,
      proposedPmid: top.record.pmid,
      proposedTitle: top.record.title,
      diceScore: top.score,
      yearOurs: citation.year,
      yearProposed: top.record.year,
    };
  }

  // Case 4: Manual review — no candidate confident enough. Surface top-3.
  return {
    kind: "manual-review",
    id,
    currentPmid: currentPmid,
    currentTitle: citation.title,
    yearOurs: citation.year,
    candidates: candidates.slice(0, 3).map(({ record, score }) => ({
      pmid: record.pmid,
      title: record.title,
      year: record.year,
      diceScore: score,
    })),
  };
}

function renderMarkdown(proposals: Proposal[]): string {
  const titleOnly = proposals.filter((p) => p.kind === "title-only");
  const pmidReplace = proposals.filter((p) => p.kind === "pmid-replacement");
  const manual = proposals.filter((p) => p.kind === "manual-review");

  const lines: string[] = [];
  lines.push("# Citation Repair Proposals — refs.yaml audit follow-up");
  lines.push("");
  lines.push(`> Generated 2026-04-26 by \`bun run scripts/repair-citations.ts\` after Phase 1 audit.`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- **Title-only fixes (auto-applicable)**: ${titleOnly.length}`);
  lines.push(`- **PMID replacements (high-confidence search match)**: ${pmidReplace.length}`);
  lines.push(`- **Manual review required**: ${manual.length}`);
  lines.push(`- **Total proposals**: ${proposals.length}`);
  lines.push("");

  // Title-only — safe auto-fixes.
  if (titleOnly.length > 0) {
    lines.push("## Title-only fixes (safe to auto-apply)");
    lines.push("");
    lines.push("These citations have the **correct PMID** — our stored title is just abbreviated. Same paper. Update title in refs.yaml to PubMed's canonical form.");
    lines.push("");
    for (const p of titleOnly) {
      if (p.kind !== "title-only") continue;
      lines.push(`### ${p.id} (PMID ${p.pmid}, Dice=${p.diceScore.toFixed(3)})`);
      lines.push("");
      lines.push(`- **Current title**: \`${p.currentTitle}\``);
      lines.push(`- **PubMed title**:  \`${p.proposedTitle}\``);
      lines.push("");
    }
  }

  // PMID replacement — high confidence but worth a glance.
  if (pmidReplace.length > 0) {
    lines.push("## PMID replacements (high-confidence search match)");
    lines.push("");
    lines.push("Search by our title returned a candidate with Dice ≥ 0.85 and year within ±1. Propose: replace `pmid` + `title` in refs.yaml.");
    lines.push("");
    for (const p of pmidReplace) {
      if (p.kind !== "pmid-replacement") continue;
      lines.push(`### ${p.id}`);
      lines.push("");
      lines.push(`- **Current**: PMID \`${p.currentPmid}\` (year ${p.yearOurs})`);
      lines.push(`  - Title: \`${p.currentTitle}\``);
      lines.push(`- **Proposed**: PMID \`${p.proposedPmid}\` (year ${p.yearProposed}, Dice=${p.diceScore.toFixed(3)})`);
      lines.push(`  - Title: \`${p.proposedTitle}\``);
      lines.push("");
    }
  }

  // Manual review — show top 3 candidates.
  if (manual.length > 0) {
    lines.push("## Manual review required");
    lines.push("");
    lines.push("Search by our title returned no high-confidence candidate. Either the original paper isn't in PubMed, or our title is too vague to find it via title-search. Top-3 candidates listed for human evaluation.");
    lines.push("");
    for (const p of manual) {
      if (p.kind !== "manual-review") continue;
      lines.push(`### ${p.id}`);
      lines.push("");
      lines.push(`- **Current PMID**: \`${p.currentPmid ?? "(none)"}\``);
      lines.push(`- **Current title**: \`${p.currentTitle}\``);
      lines.push(`- **Current year**: ${p.yearOurs}`);
      lines.push("");
      if (p.candidates.length === 0) {
        lines.push("**No candidates returned by PubMed search.** This citation may need to be deleted, or the source manually located via DOI / Google Scholar.");
        lines.push("");
      } else {
        lines.push("**Top candidates from PubMed search by our title**:");
        lines.push("");
        for (const c of p.candidates) {
          lines.push(`1. PMID \`${c.pmid}\` (year ${c.year ?? "?"}, Dice=${c.diceScore.toFixed(3)})`);
          lines.push(`   - \`${c.title}\``);
        }
        lines.push("");
      }
    }
  }

  return lines.join("\n");
}

main().catch((e) => {
  console.error("[repair] unexpected error:", e);
  process.exit(1);
});

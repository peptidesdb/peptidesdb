#!/usr/bin/env bun
/**
 * audit:claims — verify that the cited PMIDs for each claim in a peptide
 * YAML actually support the claim. Uses scripts/lib/claim-linker.ts to
 * walk claims, fetch abstracts, and score with Claude Haiku.
 *
 * The claim-linker is a SIGNAL, not a GATE — this script always exits 0.
 * Output is a per-plate markdown report at docs/audits/claim-link-<slug>-
 * <date>.md, intended to inform human review before a plate is promoted
 * past `auto-drafted`.
 *
 * Usage
 * -----
 *   bun run audit:claims                 # all plates (skips _template.yaml)
 *   bun run audit:claims tesamorelin     # just tesamorelin
 *
 * Env
 * ---
 *   ANTHROPIC_API_KEY  required — Anthropic API key (get from console)
 *   PUBMED_API_KEY     optional — bumps NCBI rate limit 3 → 10 req/s
 *   CLAIM_MODEL        optional — Anthropic model (defaults to Haiku)
 */

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import Anthropic from "@anthropic-ai/sdk";
import { CitationRegistry } from "../src/lib/schemas/citation";
import { Peptide } from "../src/lib/schemas/peptide";
import { PubmedClient } from "./lib/pubmed-client";
import { ClaimLinker, extractClaims, type ClaimScore } from "./lib/claim-linker";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REFS_PATH = join(__dirname, "..", "content", "refs.yaml");
const PEPTIDES_DIR = join(__dirname, "..", "content", "peptides");
const REPORTS_DIR = join(__dirname, "..", "docs", "audits");

const TODAY = new Date().toISOString().slice(0, 10);

async function main(): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[audit:claims] ANTHROPIC_API_KEY not set. Get one at https://console.anthropic.com/");
    process.exit(1);
  }

  const target = process.argv[2];
  const slugs = target ? [target] : listAllSlugs();
  if (slugs.length === 0) {
    console.error("[audit:claims] no peptide YAMLs found.");
    process.exit(1);
  }

  const registry = loadRegistry();
  const pubmed = new PubmedClient({
    apiKey: process.env.PUBMED_API_KEY,
    log: (m) => console.error(m),
    cacheDir: join(__dirname, "..", ".pubmed-cache"),
  });
  const anthropic = new Anthropic({ apiKey });
  const linker = new ClaimLinker({
    pubmed,
    anthropic: anthropic as unknown as ConstructorParameters<typeof ClaimLinker>[0]["anthropic"],
    registry,
    model: process.env.CLAIM_MODEL ?? "claude-haiku-4-5",
    log: (m) => console.error(m),
  });

  mkdirSync(REPORTS_DIR, { recursive: true });

  let totalUnsupported = 0;
  let totalPartial = 0;

  for (const slug of slugs) {
    const peptide = loadPeptide(slug);
    if (!peptide) continue;

    const claims = extractClaims(peptide);
    console.log(`[audit:claims] ${slug}: scoring ${claims.length} claims…`);
    if (claims.length === 0) {
      console.log(`[audit:claims] ${slug}: no cited claims, skipping.`);
      continue;
    }

    const scores = await linker.scoreClaims(claims);
    const reportPath = writeReport(slug, scores);

    const counts = bucketCounts(scores);
    console.log(
      `[audit:claims] ${slug}: ok=${counts.ok}, partial=${counts.partial}, unsupported=${counts.unsupported}, skipped=${counts.skipped}. → ${basename(reportPath)}`,
    );

    totalUnsupported += counts.unsupported;
    totalPartial += counts.partial;
  }

  console.log(
    `\n[audit:claims] done. ${slugs.length} plate(s). unsupported=${totalUnsupported}, partial=${totalPartial}. Reports in docs/audits/.`,
  );
}

function listAllSlugs(): string[] {
  return readdirSync(PEPTIDES_DIR)
    .filter((f) => f.endsWith(".yaml") && !f.startsWith("_"))
    .map((f) => f.replace(/\.yaml$/, ""));
}

function loadPeptide(slug: string): Peptide | null {
  const path = join(PEPTIDES_DIR, `${slug}.yaml`);
  let raw: string;
  try {
    raw = readFileSync(path, "utf-8");
  } catch {
    console.error(`[audit:claims] file not found: ${path}`);
    return null;
  }
  const parsed = yaml.load(raw);
  const result = Peptide.safeParse(parsed);
  if (!result.success) {
    console.error(`[audit:claims] ${slug}.yaml failed Zod parse — skipping.`);
    return null;
  }
  return result.data;
}

function loadRegistry() {
  const raw = readFileSync(REFS_PATH, "utf-8");
  const parsed = yaml.load(raw);
  return CitationRegistry.parse(parsed);
}

function bucketCounts(scores: ClaimScore[]): {
  ok: number;
  partial: number;
  unsupported: number;
  skipped: number;
} {
  const counts = { ok: 0, partial: 0, unsupported: 0, skipped: 0 };
  for (const s of scores) counts[s.verdict] += 1;
  return counts;
}

function writeReport(slug: string, scores: ClaimScore[]): string {
  const reportPath = join(REPORTS_DIR, `claim-link-${slug}-${TODAY}.md`);
  const counts = bucketCounts(scores);
  const lines: string[] = [];

  lines.push(`# Claim-link audit: ${slug}`);
  lines.push("");
  lines.push(`> Generated ${TODAY} by \`bun run audit:claims ${slug}\`. Model: ${process.env.CLAIM_MODEL ?? "claude-haiku-4-5"}.`);
  lines.push(">");
  lines.push("> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Total claims with citations: ${scores.length}`);
  lines.push(`- ✅ ok (score ≥ 0.85): ${counts.ok}`);
  lines.push(`- ⚠️ partial (0.6–0.85): ${counts.partial}`);
  lines.push(`- ❌ unsupported (< 0.6): ${counts.unsupported}`);
  lines.push(`- — skipped (no PMIDs available): ${counts.skipped}`);
  lines.push("");

  const unsupported = scores.filter((s) => s.verdict === "unsupported");
  const partial = scores.filter((s) => s.verdict === "partial");
  const skipped = scores.filter((s) => s.verdict === "skipped");
  const ok = scores.filter((s) => s.verdict === "ok");

  if (unsupported.length > 0) {
    lines.push("## ❌ Unsupported (P0 — must fix or remove citation)");
    lines.push("");
    for (const s of unsupported) renderClaim(lines, s, true);
  }

  if (partial.length > 0) {
    lines.push("## ⚠️ Partial (P1 — human review)");
    lines.push("");
    for (const s of partial) renderClaim(lines, s, true);
  }

  if (skipped.length > 0) {
    lines.push("## — Skipped (citation has no PMID — author-time DOI lookup needed)");
    lines.push("");
    for (const s of skipped) {
      lines.push(`- **${s.path}**: ${s.claim_text}`);
      lines.push(`  - Citations: ${s.cite_ids.join(", ")}`);
    }
    lines.push("");
  }

  if (ok.length > 0) {
    lines.push("## ✅ OK (collapsed for brevity)");
    lines.push("");
    for (const s of ok) {
      lines.push(`- **${s.path}**: ${s.claim_text} *(score=${s.score?.toFixed(2)})*`);
    }
    lines.push("");
  }

  writeFileSync(reportPath, lines.join("\n"), "utf-8");
  return reportPath;
}

function renderClaim(lines: string[], s: ClaimScore, includeRationale: boolean): void {
  lines.push(`### ${s.path}`);
  lines.push("");
  lines.push(`- **Claim**: ${s.claim_text}`);
  lines.push(`- **Score**: ${s.score?.toFixed(2) ?? "—"}`);
  lines.push(
    `- **Citations**: ${s.resolved.map((r) => `${r.citation_id}${r.pmid ? ` (PMID ${r.pmid})` : " (no PMID)"}`).join(", ")}`,
  );
  if (includeRationale && s.rationale) {
    lines.push(`- **Rationale**: ${s.rationale}`);
  }
  lines.push("");
}

main().catch((e) => {
  console.error("[audit:claims] unexpected error:", e);
  process.exit(1);
});

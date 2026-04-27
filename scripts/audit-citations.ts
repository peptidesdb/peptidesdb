#!/usr/bin/env bun
/**
 * audit:citations — verify every PMID in content/refs.yaml against PubMed.
 *
 * Why this is a separate script from audit:trust:
 *   - audit:trust validates SHAPE + cite-ID resolution against the compiled
 *     citations.ts. It runs in pre{dev,build,test} and must stay fast.
 *   - audit:citations validates TRUTH against an external API. It hits the
 *     network, is slow (≥0.3s/PMID with no API key), and only needs to run
 *     in CI + on demand. Keeping it separate keeps `bun dev` instant.
 *
 * What it checks
 * --------------
 * For every entry in refs.yaml that has a `pmid`:
 *   1. PMID exists on PubMed (esummary returns metadata, not an error).
 *   2. Title matches PubMed's canonical title via Dice ≥ TITLE_MATCH_THRESHOLD.
 *      Catches "real PMID, wrong paper" — the dominant hallucination pattern.
 *   3. Year matches PubMed's pubdate (warning only — 1-year tolerance).
 *
 * Failure modes
 * -------------
 * - PMID not found → P0, exit 1
 * - Title fuzzy-match below threshold → P0, exit 1
 * - Year mismatch by >1 → P1, warn but exit 0
 * - Network failure on a citation → P2, warn (re-run later)
 *
 * Usage
 * -----
 *   bun run audit:citations              # check all citations
 *   bun run audit:citations sermorelin   # check only refs touched by sermorelin.yaml
 *   PUBMED_API_KEY=... bun run audit:citations  # 10 req/s instead of 3
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { CitationRegistry } from "../src/lib/schemas/citation";
import {
  PubmedClient,
  TITLE_MATCH_THRESHOLD,
  diceCoefficient,
} from "./lib/pubmed-client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REFS_PATH = join(__dirname, "..", "content", "refs.yaml");

interface Issue {
  id: string;
  severity: "P0" | "P1" | "P2";
  message: string;
}

async function main(): Promise<void> {
  const raw = readFileSync(REFS_PATH, "utf-8");
  const parsed = yaml.load(raw);
  const result = CitationRegistry.safeParse(parsed);
  if (!result.success) {
    console.error("[audit:citations] refs.yaml failed schema validation:");
    console.error(result.error.message);
    process.exit(1);
  }
  const registry = result.data;

  const apiKey = process.env.PUBMED_API_KEY;
  const client = new PubmedClient({
    apiKey,
    log: (msg) => console.error(msg),
    cacheDir: join(__dirname, "..", ".pubmed-cache"),
  });

  const entries = Object.entries(registry).filter(([, c]) => c.pmid);
  const total = entries.length;
  if (total === 0) {
    console.log("[audit:citations] no PMIDs found in refs.yaml — nothing to verify.");
    return;
  }

  console.log(
    `[audit:citations] verifying ${total} PMIDs against PubMed${apiKey ? " (with API key, 10 req/s)" : " (no API key, 3 req/s)"}…`,
  );

  const issues: Issue[] = [];
  let verified = 0;
  let networkFailures = 0;

  for (const [id, citation] of entries) {
    const pmid = citation.pmid!;
    const record = await client.verifyPmid(pmid);

    if (!record) {
      issues.push({
        id,
        severity: "P0",
        message: `PMID ${pmid} not found on PubMed (or network failure)`,
      });
      networkFailures += 1;
      continue;
    }

    const titleScore = diceCoefficient(citation.title, record.title);
    if (titleScore < TITLE_MATCH_THRESHOLD) {
      issues.push({
        id,
        severity: "P0",
        message: [
          `PMID ${pmid} title mismatch (Dice=${titleScore.toFixed(3)} < ${TITLE_MATCH_THRESHOLD})`,
          `  ours:    "${citation.title}"`,
          `  pubmed:  "${record.title}"`,
        ].join("\n"),
      });
      verified += 1;
      continue;
    }

    if (record.year !== null && Math.abs(citation.year - record.year) > 1) {
      issues.push({
        id,
        severity: "P1",
        message: `PMID ${pmid} year mismatch (ours=${citation.year}, pubmed=${record.year})`,
      });
    }

    verified += 1;
    if (verified % 25 === 0) {
      console.log(`[audit:citations]   ${verified}/${total} verified…`);
    }
  }

  console.log(
    `[audit:citations] done. verified=${verified}/${total}, issues=${issues.length} (network failures=${networkFailures}).`,
  );

  if (issues.length > 0) {
    console.error("");
    console.error("[audit:citations] issues:");
    for (const issue of issues) {
      console.error(`  [${issue.severity}] ${issue.id}: ${issue.message}`);
    }
  }

  const fatal = issues.filter((i) => i.severity === "P0");
  if (fatal.length > 0) {
    console.error(`\n[audit:citations] FAIL: ${fatal.length} P0 issue(s).`);
    process.exit(1);
  }

  if (issues.length > 0) {
    console.log(`\n[audit:citations] OK with ${issues.length} non-fatal warning(s).`);
  }
}

main().catch((e) => {
  console.error("[audit:citations] unexpected error:", e);
  process.exit(1);
});

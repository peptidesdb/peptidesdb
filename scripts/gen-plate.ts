#!/usr/bin/env bun
/**
 * gen:plate — first-pass authoring of a peptide profile.
 *
 * Pipeline (Phases 1, 2, 3 composed):
 *   1. Search PubMed for the peptide name (top-N candidates)
 *   2. Fetch each candidate's abstract via efetch
 *   3. Hand candidates + a style example to PlateDrafter (Phase 3)
 *   4. Validate output against the Zod Peptide schema (with one retry)
 *   5. Write content/peptides/<slug>.yaml + append new entries to refs.yaml
 *   6. Run audit:trust + audit:citations as informational gates
 *
 * Output is `maturity: auto-drafted` by definition. Every plate flows
 * through the editorial workflow at docs/designs/peptide-editorial-
 * workflow.md before promotion.
 *
 * Usage
 * -----
 *   bun run gen:plate "Cagrilintide"
 *   bun run gen:plate "Cagrilintide" --slug=cagrilintide
 *   bun run gen:plate "AOD-9604" --keywords="AOD-9604 lipolysis fragment human growth hormone"
 *   bun run gen:plate "Cagrilintide" --brief="Amylin analog tested with semaglutide for weight loss."
 *   bun run gen:plate "BPC-157" --style=bpc-157 --force
 *   bun run gen:plate "Tesofensine" --model=claude-sonnet-4-5 --candidates=15
 *
 * Env
 * ---
 *   ANTHROPIC_API_KEY  required — Anthropic API key
 *   PUBMED_API_KEY     optional — bumps NCBI rate limit 3 → 10 req/s
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import Anthropic from "@anthropic-ai/sdk";
import { CitationRegistry, type Citation } from "../src/lib/schemas/citation";
import { Peptide } from "../src/lib/schemas/peptide";
import { PubmedClient } from "./lib/pubmed-client";
import {
  PlateDrafter,
  recordToCandidate,
  slugify,
  type Candidate,
} from "./lib/draft-plate";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REFS_PATH = join(__dirname, "..", "content", "refs.yaml");
const PEPTIDES_DIR = join(__dirname, "..", "content", "peptides");

export interface ParsedArgs {
  name: string;
  slug?: string;
  brief?: string;
  keywords?: string;
  style: string;
  candidates: number;
  /** Comma-separated PMIDs to pin into the candidate pool (deduped vs search). */
  seedPmids: string[];
  model: string;
  force: boolean;
}

export function parseArgs(argv: string[] = process.argv.slice(2)): ParsedArgs {
  if (argv.length === 0 || argv[0].startsWith("--")) {
    console.error('Usage: bun run gen:plate "<peptide name>" [--slug=...] [--brief="..."] [--keywords="..."] [--seed-pmids="<pmid,pmid,...>"] [--style=tesamorelin] [--candidates=10] [--model=claude-sonnet-4-5] [--force]');
    process.exit(1);
  }
  const args: ParsedArgs = {
    name: argv[0],
    style: "tesamorelin",
    candidates: 10,
    seedPmids: [],
    model: "claude-sonnet-4-5",
    force: false,
  };
  for (const arg of argv.slice(1)) {
    if (arg === "--force") args.force = true;
    else if (arg.startsWith("--slug=")) args.slug = arg.slice(7);
    else if (arg.startsWith("--brief=")) args.brief = arg.slice(8);
    else if (arg.startsWith("--keywords=")) args.keywords = arg.slice(11);
    else if (arg.startsWith("--seed-pmids=")) {
      args.seedPmids = arg
        .slice(13)
        .split(/[,\s]+/)
        .map((s) => s.trim())
        .filter((s) => /^\d+$/.test(s));
    }
    else if (arg.startsWith("--style=")) args.style = arg.slice(8);
    else if (arg.startsWith("--candidates=")) args.candidates = Number(arg.slice(13));
    else if (arg.startsWith("--model=")) args.model = arg.slice(8);
    else {
      console.error(`Unknown argument: ${arg}`);
      process.exit(1);
    }
  }
  return args;
}

async function main(): Promise<void> {
  const args = parseArgs();
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[gen:plate] ANTHROPIC_API_KEY not set. Get one at https://console.anthropic.com/");
    process.exit(1);
  }

  const slug = args.slug ?? slugify(args.name);
  const peptidePath = join(PEPTIDES_DIR, `${slug}.yaml`);
  if (existsSync(peptidePath) && !args.force) {
    console.error(
      `[gen:plate] ${peptidePath} already exists. Use --force to overwrite (or pick a different --slug).`,
    );
    process.exit(1);
  }

  const registry = loadRegistry();
  const styleExample = loadStyleExample(args.style);

  const pubmed = new PubmedClient({
    apiKey: process.env.PUBMED_API_KEY,
    log: (m) => console.error(m),
    cacheDir: join(__dirname, "..", ".pubmed-cache"),
  });
  const anthropic = new Anthropic({ apiKey });

  // Phase 1: search PubMed for candidate papers + merge any seeded PMIDs.
  const query = args.keywords ?? args.name;
  console.log(`[gen:plate] searching PubMed for "${query}" (top ${args.candidates})…`);
  const searchPmids = await pubmed.searchPubmed(query, args.candidates);
  console.log(`[gen:plate]   search found ${searchPmids.length} PMID(s).`);

  // Seed PMIDs are pinned at the front of the candidate list — when the
  // operator knows the foundational papers (Lee 2002 myostatin KO, Goldspink
  // MGF papers, etc.) that PubMed search misses on a given query, they can
  // pass --seed-pmids="11823860,12027450,15282204" to ensure those land in
  // the candidate pool. Search results follow, deduped against the seeds.
  const seedSet = new Set(args.seedPmids);
  const dedupedSearch = searchPmids.filter((p) => !seedSet.has(p));
  const pmids = [...args.seedPmids, ...dedupedSearch];

  if (args.seedPmids.length > 0) {
    console.log(`[gen:plate]   pinned ${args.seedPmids.length} seed PMID(s) at front of pool.`);
  }
  if (pmids.length === 0) {
    console.error(`[gen:plate] no candidates (search returned 0 and no --seed-pmids). Refine --keywords or supply seeds.`);
    process.exit(1);
  }
  console.log(`[gen:plate]   total candidate pool: ${pmids.length}.`);

  // Phase 2: fetch metadata + abstracts. PubmedClient's rate limiter handles pacing.
  console.log(`[gen:plate] fetching metadata + abstracts…`);
  const candidates: Candidate[] = [];
  for (const pmid of pmids) {
    const record = await pubmed.verifyPmid(pmid);
    if (!record) continue;
    const abstract = await pubmed.fetchAbstract(pmid);
    candidates.push(recordToCandidate(record, abstract ?? "(abstract unavailable)"));
  }
  console.log(`[gen:plate]   resolved ${candidates.length}/${pmids.length} with metadata.`);
  if (candidates.length === 0) {
    console.error("[gen:plate] could not resolve any candidate metadata. Aborting.");
    process.exit(1);
  }

  // Phase 3: draft.
  console.log(`[gen:plate] drafting via ${args.model}…`);
  const drafter = new PlateDrafter();
  const result = await drafter.draft({
    name: args.name,
    slug,
    brief: args.brief,
    candidates,
    styleExample,
    anthropic: anthropic as unknown as ConstructorParameters<typeof PlateDrafter>[0],
    model: args.model,
    log: (m) => console.error(m),
  });

  // Write peptide YAML.
  writeFileSync(peptidePath, result.yaml, "utf-8");
  console.log(`[gen:plate] wrote ${peptidePath}`);

  // Append new citations to refs.yaml (skip ones already present).
  const newRefs = result.newCitations.filter((c) => !registry[c.id]);
  if (newRefs.length > 0) {
    appendCitations(newRefs);
    console.log(`[gen:plate] appended ${newRefs.length} new citation(s) to refs.yaml`);
  }
  const skipped = result.newCitations.length - newRefs.length;
  if (skipped > 0) console.log(`[gen:plate]   ${skipped} citation(s) already in refs.yaml (kept existing).`);

  // Regenerate src/generated/citations.ts so audit:trust sees the new IDs.
  // Without this, the next audit run fails with "unresolved ref" for every
  // newly appended citation — caught during the cagrilintide calibration
  // (2026-04-27). execFileSync is used to avoid shell-injection vectors;
  // the literal command + arg array is interpreted by Node directly.
  if (newRefs.length > 0) {
    const projectRoot = join(__dirname, "..");
    execFileSync("node", ["scripts/generate-citations.mjs"], {
      cwd: projectRoot,
      stdio: "inherit",
    });
  }

  // Warnings.
  for (const w of result.warnings) console.log(`[gen:plate] WARN: ${w}`);

  console.log("");
  console.log(`[gen:plate] done. Next:`);
  console.log(`  1. bun run audit:trust         (schema + citation-resolution gate)`);
  console.log(`  2. bun run audit:citations     (PMID truthfulness against PubMed)`);
  console.log(`  3. ANTHROPIC_API_KEY=... bun run audit:claims ${slug}   (per-claim verification)`);
  console.log(`  4. Review ${peptidePath} manually before promoting maturity past auto-drafted.`);
}

function loadRegistry() {
  const raw = readFileSync(REFS_PATH, "utf-8");
  return CitationRegistry.parse(yaml.load(raw));
}

function loadStyleExample(slug: string) {
  const path = join(PEPTIDES_DIR, `${slug}.yaml`);
  if (!existsSync(path)) {
    console.error(`[gen:plate] style example not found: ${path}. Pick a different --style.`);
    process.exit(1);
  }
  const raw = readFileSync(path, "utf-8");
  const result = Peptide.safeParse(yaml.load(raw));
  if (!result.success) {
    console.error(`[gen:plate] style example ${slug}.yaml failed Zod parse — choose a different one.`);
    process.exit(1);
  }
  return result.data;
}

/** Append citations to refs.yaml as a YAML block. We don't re-serialize
 *  the whole file (refs.yaml has hand-tuned order + comments); instead
 *  we emit each new entry under a clearly-marked appended block. */
function appendCitations(citations: Citation[]): void {
  const today = new Date().toISOString().slice(0, 10);
  const block = [
    "",
    `# === Appended by gen:plate on ${today} ===`,
    ...citations.map((c) => yaml.dump({ [c.id]: c }, { lineWidth: 100, noRefs: true }).trim()),
  ].join("\n\n");
  const current = readFileSync(REFS_PATH, "utf-8");
  writeFileSync(REFS_PATH, current.trimEnd() + "\n" + block + "\n", "utf-8");
}

// Only run main() when executed directly. `import.meta.main` is true when
// this file is the entry point (bun run scripts/gen-plate.ts) and false
// when imported (e.g. by test/lib/gen-plate-args.test.ts).
if (import.meta.main) {
  main().catch((e) => {
    console.error("[gen:plate] unexpected error:", e);
    process.exit(1);
  });
}

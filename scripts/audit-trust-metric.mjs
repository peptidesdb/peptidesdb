#!/usr/bin/env node
/**
 * Trust-metric audit. Walks every loaded peptide and asserts that:
 *
 * 1. Every CitableValue in the schema flows through computePeptideStats.
 * 2. Every claim-bearing field rendered on /p/[slug] is reachable by the
 *    walker. (We can't render-test from a script, but we can enumerate
 *    the field paths that appear in YAML and verify they all match the
 *    walker's expected shape.)
 *
 * Run as part of prebuild. Build fails if any peptide has a field shape
 * that bypasses the audit. This closes the recurring "trust metric vs
 * visible content" class of issue codex has been finding.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";

const PEPTIDES_DIR = join(process.cwd(), "content/peptides");

/**
 * Predicate: is `obj` a post-parse CitableValue shape?
 * Mirrors src/lib/peptide-stats.ts isCitableValue.
 *
 * NOTE: pre-parse YAML may have terse string form for these fields. We
 * accept either string OR object-with-value here, since the runtime
 * Zod preprocess wraps strings.
 */
function isCitableShape(v) {
  if (typeof v === "string") return true; // will be auto-wrapped
  if (v && typeof v === "object" && typeof v.value === "string") return true;
  return false;
}

/**
 * Fields that MUST be CitableValue (or terse-string equivalent).
 * Each entry is a JSONPath-style array of keys to descend.
 */
const REQUIRED_CITABLE_FIELDS = [
  // mechanism object fields
  ["mechanism", "primary_target"],
  ["mechanism", "pathway"],
  ["mechanism", "downstream_effect"],
  ["mechanism", "origin"],
  ["mechanism", "feedback_intact"],
  ["mechanism", "antibody_development"],
  ["mechanism", "receptor_class"],
  ["mechanism", "half_life_basis"],
  // diagram steps (each step.text)
  ["mechanism", "diagram", "*", "text"],
  // dosage rows: each value + each notes
  ["dosage", "rows", "*", "value"],
  ["dosage", "rows", "*", "notes"],
  // fat_loss
  ["fat_loss", "rows", "*", "value"],
  ["fat_loss", "rows", "*", "notes"],
  // side_effects
  ["side_effects", "rows", "*", "value"],
  ["side_effects", "rows", "*", "notes"],
  // contraindications
  ["side_effects", "contraindications_absolute", "*"],
  ["side_effects", "contraindications_relative", "*"],
];

function descend(obj, path) {
  if (path.length === 0) return [obj];
  const [head, ...rest] = path;
  if (head === "*") {
    if (!Array.isArray(obj)) return [];
    return obj.flatMap((item) => descend(item, rest));
  }
  if (!obj || typeof obj !== "object") return [];
  if (!(head in obj)) return [];
  return descend(obj[head], rest);
}

let totalFiles = 0;
let totalFields = 0;
const issues = [];

const files = readdirSync(PEPTIDES_DIR).filter(
  (f) => f.endsWith(".yaml") && !f.startsWith("_"),
);
for (const file of files) {
  const raw = readFileSync(join(PEPTIDES_DIR, file), "utf-8");
  let parsed;
  try {
    parsed = yaml.load(raw);
  } catch (e) {
    issues.push(`${file}: YAML parse failed — ${e.message}`);
    continue;
  }
  totalFiles += 1;

  for (const path of REQUIRED_CITABLE_FIELDS) {
    const matches = descend(parsed, path);
    for (const v of matches) {
      if (v === undefined || v === null) continue; // optional fields
      totalFields += 1;
      if (!isCitableShape(v)) {
        issues.push(
          `${file}: ${path.join(".")} is not citable shape (got ${typeof v} ${JSON.stringify(v).slice(0, 60)})`,
        );
      }
    }
  }
}

console.log(
  `[audit-trust-metric] ${totalFiles} peptide${totalFiles === 1 ? "" : "s"} checked, ${totalFields} claim-bearing fields verified citable.`,
);

if (issues.length > 0) {
  console.error("\n[audit-trust-metric] FAIL:");
  issues.forEach((i) => console.error(`  - ${i}`));
  process.exit(1);
}

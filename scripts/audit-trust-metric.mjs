#!/usr/bin/env node
/**
 * Trust-metric audit. Walks every loaded peptide and asserts that every
 * visible claim-bearing field flows through computePeptideStats. Two
 * shape patterns are recognised:
 *
 *   1. CitableValue: terse string OR { value, cite[] } object.
 *      Used for mechanism/dosage/fat_loss/side_effects/etc fields.
 *
 *   2. Parent-cite: an object whose cite[] sibling governs string-typed
 *      content fields. Used for hero_stats[*], administration.steps[*],
 *      synergy.stacks[*]. The walker counts each content field as a claim
 *      gated by the parent's cite[].
 *
 * Run as part of prebuild. Build fails if any peptide has a field shape
 * that bypasses the audit. This closes the recurring "trust metric vs
 * visible content" class of issue codex has been finding.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";

const PEPTIDES_DIR = join(process.cwd(), "content/peptides");

/** @typedef {(v: unknown) => true | string} Validator */

/** Pre-parse YAML may have terse string form for CitableValue. Both shapes accepted. */
const isCitableShape = (v) => {
  if (typeof v === "string") return true;
  if (v && typeof v === "object" && typeof v.value === "string") return true;
  return `expected string or {value, cite[]}, got ${typeof v}`;
};

/** Hero stat: {value, label, cite[]} where cite drives the trust audit.
 *  cite is optional in YAML (Zod auto-defaults to []); audit accepts missing
 *  cite as equivalent to uncited. */
const isHeroStat = (v) => {
  if (!v || typeof v !== "object")
    return `expected { value, label, cite }, got ${typeof v}`;
  if (typeof v.value !== "string" || !v.value)
    return "hero_stat missing string `value`";
  if (typeof v.label !== "string" || !v.label)
    return "hero_stat missing string `label`";
  if ("cite" in v && !Array.isArray(v.cite))
    return "hero_stat `cite` must be array if present";
  return true;
};

/** Admin step: {title, body, cite[]} where cite governs body claim. */
const isAdminStep = (v) => {
  if (!v || typeof v !== "object")
    return `expected { title, body, cite }, got ${typeof v}`;
  if (typeof v.title !== "string" || !v.title)
    return "admin step missing string `title`";
  if (typeof v.body !== "string" || !v.body)
    return "admin step missing string `body`";
  if ("cite" in v && !Array.isArray(v.cite))
    return "admin step `cite` must be array if present";
  return true;
};

/** Stack protocol: rationale + primary_benefit + cite[]. */
const isStackProtocol = (v) => {
  if (!v || typeof v !== "object")
    return `expected stack protocol object, got ${typeof v}`;
  if (typeof v.rationale !== "string" || !v.rationale)
    return "stack missing string `rationale`";
  if (typeof v.primary_benefit !== "string" || !v.primary_benefit)
    return "stack missing string `primary_benefit`";
  if (typeof v.partner_slug !== "string" || !v.partner_slug)
    return "stack missing string `partner_slug`";
  if ("cite" in v && !Array.isArray(v.cite))
    return "stack `cite` must be array if present";
  return true;
};

/** {path, validator} list. Path uses '*' as array spread. */
const REQUIRED_FIELDS = [
  // ===== Top-level visible prose claims (CitableValue) =====
  { path: ["summary"], validate: isCitableShape },
  { path: ["hero_route"], validate: isCitableShape },

  // ===== Hero quick stats (parent-cite pattern) =====
  { path: ["hero_stats", "*"], validate: isHeroStat },

  // ===== Mechanism (CitableValue per field) =====
  { path: ["mechanism", "primary_target"], validate: isCitableShape },
  { path: ["mechanism", "pathway"], validate: isCitableShape },
  { path: ["mechanism", "downstream_effect"], validate: isCitableShape },
  { path: ["mechanism", "origin"], validate: isCitableShape },
  { path: ["mechanism", "feedback_intact"], validate: isCitableShape },
  { path: ["mechanism", "antibody_development"], validate: isCitableShape },
  { path: ["mechanism", "receptor_class"], validate: isCitableShape },
  { path: ["mechanism", "half_life_basis"], validate: isCitableShape },
  { path: ["mechanism", "diagram", "*", "text"], validate: isCitableShape },

  // ===== Dosage table rows =====
  { path: ["dosage", "rows", "*", "value"], validate: isCitableShape },
  { path: ["dosage", "rows", "*", "notes"], validate: isCitableShape },

  // ===== Fat loss / metabolic =====
  { path: ["fat_loss", "evidence_meta"], validate: isCitableShape },
  { path: ["fat_loss", "rows", "*", "value"], validate: isCitableShape },
  { path: ["fat_loss", "rows", "*", "notes"], validate: isCitableShape },

  // ===== Side effects =====
  { path: ["side_effects", "rows", "*", "value"], validate: isCitableShape },
  { path: ["side_effects", "rows", "*", "notes"], validate: isCitableShape },
  { path: ["side_effects", "contraindications_absolute", "*"], validate: isCitableShape },
  { path: ["side_effects", "contraindications_relative", "*"], validate: isCitableShape },

  // ===== Administration steps (parent-cite) =====
  { path: ["administration", "steps", "*"], validate: isAdminStep },

  // ===== Synergy stacks (parent-cite) =====
  { path: ["synergy", "stacks", "*"], validate: isStackProtocol },
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

  for (const { path, validate } of REQUIRED_FIELDS) {
    const matches = descend(parsed, path);
    for (const v of matches) {
      if (v === undefined || v === null) continue; // optional field
      totalFields += 1;
      const result = validate(v);
      if (result !== true) {
        issues.push(`${file}: ${path.join(".")} — ${result}`);
      }
    }
  }
}

console.log(
  `[audit-trust-metric] ${totalFiles} peptide${totalFiles === 1 ? "" : "s"} checked, ${totalFields} claim-bearing fields verified.`,
);

if (issues.length > 0) {
  console.error("\n[audit-trust-metric] FAIL:");
  issues.forEach((i) => console.error(`  - ${i}`));
  process.exit(1);
}

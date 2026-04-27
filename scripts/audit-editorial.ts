#!/usr/bin/env bun
/**
 * audit:editorial — scan every plate's prose for known editorial /
 * compliance violations.
 *
 * Catches the systematic issues that survive into auto-drafted plates:
 * medical claims, dosing recommendations for humans, marketing
 * superlatives, first-person voice, vendor links, etc. Voice nuance
 * (rhythm, atlas tone) still needs a human pass — this is the
 * deterministic floor.
 *
 * Severity buckets
 * ----------------
 * P0  hard-violation: medical claim, dosing recommendation, vendor
 *     link, first-person, marketing superlative. Must fix or trim.
 * P1  review: hedging that's too vague, "may help" / "shows promise"
 *     style framing, non-research wellness framing.
 *
 * Output
 * ------
 * Markdown report at docs/audits/editorial-audit-<date>.md, plus a
 * stdout summary. Always exits 0 (signal, not gate — same pattern as
 * audit:claims).
 */

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PEPTIDES_DIR = join(__dirname, "..", "content", "peptides");
const REPORT_DIR = join(__dirname, "..", "docs", "audits");
const TODAY = new Date().toISOString().slice(0, 10);

interface Pattern {
  id: string;
  severity: "P0" | "P1";
  description: string;
  /** Word-boundary regex matched against text fields. */
  regex: RegExp;
  /** Skip when the matched text contains any of these (false-positive guards). */
  unlessNear?: RegExp;
}

const PATTERNS: Pattern[] = [
  // ----- P0: hard violations -----
  {
    // Case-sensitive: matches "we|our|us|We|Our|Us" but NOT all-caps "US"
    // (the United States abbreviation appears constantly in atlas plates
    // — FDA approvals, US/EU filings — and is not first-person).
    id: "first-person-we",
    severity: "P0",
    description: "First-person plural ('we', 'our', 'us') — atlas is third-person reference.",
    regex: /\b(?:we|our|us|We|Our|Us)\b/g,
  },
  {
    // Match only clear first-person constructions, not standalone "I"
    // (which appears in "Type I", "Phase I", "Schedule I", "pro-collagen I",
    // "MHC class I", etc. as a roman-numeral / classification token).
    id: "first-person-i",
    severity: "P0",
    description: "First-person construction ('I think/believe/found') — atlas is third-person.",
    regex: /\bI (?:think|believe|found|noticed|observed|conclude|propose|suggest|recommend|argue|hypothesize|note|saw|tested)\b|\bin my (?:view|opinion|experience|own)\b|\bfrom my (?:research|experience|reading|view)\b|\bto my (?:knowledge|surprise)\b/g,
  },
  {
    id: "vendor-link",
    severity: "P0",
    description: "Direct vendor/storefront URL in plate text — atlas is non-commercial.",
    regex: /\bcertapeptides\.com\b|\bbuy now\b|\border (?:at|from|here)\b|\bavailable for purchase\b|\bpurchase from\b/gi,
  },
  {
    id: "medical-cure-claim",
    severity: "P0",
    description: "Disease-cure claim. Atlas can describe research findings, not curative claims.",
    regex: /\b(cures?|cured|curative|miracle|panacea|complete remission|breakthrough cure)\b/gi,
  },
  {
    id: "medical-treats-direct",
    severity: "P0",
    description: "Direct treatment claim ('treats X', 'remedy for X') without research framing.",
    regex: /\b(?:treats|treating|remedies|remedies for|works as a treatment for|effective treatment for|definitive treatment)\b/gi,
    unlessNear: /\b(approved|RCT|trial|FDA|EMA|registered|indicated|labeled|labelled)\b/i,
  },
  {
    id: "human-dosing-recommendation",
    severity: "P0",
    description: "Direct human-dosing recommendation — atlas is for research peptides only.",
    regex: /\b(?:recommended|suggested) (?:dose|dosing|dosage|amount) (?:for (?:patients|users|individuals|people|adults|men|women))?\b|\busers? (?:should|need to) (?:take|inject|administer)\b|\bpatients should (?:take|use|inject)\b/gi,
  },
  {
    id: "marketing-superlative",
    severity: "P0",
    description: "Marketing copy / superlative — atlas voice is hairline, not hyped.",
    regex: /\b(revolutionary|groundbreaking|cutting[- ]edge|unprecedented|miraculous|game[- ]changing|best[- ]in[- ]class|world[- ]leading|premier|premium-grade|state[- ]of[- ]the[- ]art)\b/gi,
  },

  // ----- P1: review-worthy hedging / vagueness -----
  {
    id: "shows-promise",
    severity: "P1",
    description: "'Shows promise / potential' — vague clinical framing; specify what was measured.",
    regex: /\bshows? (?:great )?promise\b|\bshows? potential\b|\bpromising results\b/gi,
  },
  {
    id: "may-help-vague",
    severity: "P1",
    description: "'May help' without object — too vague for atlas voice. Name the mechanism or outcome.",
    regex: /\bmay help\b(?!.{0,80}\b(?:reduce|increase|inhibit|activate|protect|stimulate|prevent|slow|enhance|maintain|preserve|restore|regulate|modulate|support)\b)/gi,
  },
  {
    // "youthful" appears in legitimate Khavinson telomerase/homeostasis
    // contexts ("toward youthful baseline" = return to younger physiologic
    // levels). Only flag the clearly-wellness collocations.
    id: "wellness-framing",
    severity: "P1",
    description: "Wellness / biohacking framing — atlas is research reference, not lifestyle.",
    regex: /\b(biohacking|wellness journey|lifestyle peptide|anti[- ]aging miracle|optimal performance lifestyle|youthful (?:appearance|skin|glow|look|feel)|look (?:younger|youthful))\b/gi,
  },
  {
    id: "alternative-medicine",
    severity: "P1",
    description: "'Alternative medicine' framing — atlas presents evidence neutrally.",
    regex: /\balternative (?:medicine|therapy|treatment)\b|\bnatural alternative to\b/gi,
  },
];

interface Finding {
  slug: string;
  path: string;
  patternId: string;
  severity: "P0" | "P1";
  description: string;
  excerpt: string;
}

function findInText(slug: string, path: string, text: string, out: Finding[]): void {
  if (!text || typeof text !== "string") return;
  for (const pattern of PATTERNS) {
    for (const match of text.matchAll(pattern.regex)) {
      const matchStart = match.index ?? 0;
      const ctxStart = Math.max(0, matchStart - 30);
      const ctxEnd = Math.min(text.length, matchStart + match[0].length + 30);
      const excerpt = text.slice(ctxStart, ctxEnd).replace(/\s+/g, " ").trim();

      // Skip false positives
      if (pattern.unlessNear) {
        const window = text.slice(Math.max(0, matchStart - 60), matchStart + match[0].length + 60);
        if (pattern.unlessNear.test(window)) continue;
      }

      out.push({
        slug,
        path,
        patternId: pattern.id,
        severity: pattern.severity,
        description: pattern.description,
        excerpt,
      });
    }
  }
}

/** Collect every text-bearing field in a peptide YAML. */
function collectTexts(p: unknown, out: Array<{ path: string; text: string }>, basePath = ""): void {
  if (!p) return;
  if (typeof p === "string") {
    if (basePath) out.push({ path: basePath, text: p });
    return;
  }
  if (Array.isArray(p)) {
    p.forEach((item, i) => collectTexts(item, out, `${basePath}[${i}]`));
    return;
  }
  if (typeof p !== "object") return;
  const obj = p as Record<string, unknown>;
  for (const [k, v] of Object.entries(obj)) {
    // Skip cite arrays + identifier / metadata fields
    if (k === "cite" || k === "slug" || k === "schema_version" || k === "color" ||
        k === "fda_approved" || k === "approval_year" || k === "evidence_level" ||
        k === "evidence_strength" || k === "maturity" || k === "categories" ||
        k === "aliases" || k === "contributors" || k === "last_reviewed" ||
        k === "partner_slug" || k === "kind" || k === "severity" || k === "badge") continue;
    if (k === "name" && basePath === "") continue;
    const newPath = basePath ? `${basePath}.${k}` : k;
    collectTexts(v, out, newPath);
  }
}

function runOnPeptide(slug: string, doc: unknown): Finding[] {
  const findings: Finding[] = [];
  const texts: Array<{ path: string; text: string }> = [];
  collectTexts(doc, texts);
  for (const { path, text } of texts) {
    findInText(slug, path, text, findings);
  }
  return findings;
}

function renderReport(allFindings: Finding[], plateCount: number): string {
  const lines: string[] = [];
  const byPlate = new Map<string, Finding[]>();
  for (const f of allFindings) {
    if (!byPlate.has(f.slug)) byPlate.set(f.slug, []);
    byPlate.get(f.slug)!.push(f);
  }
  const byPattern = new Map<string, number>();
  for (const f of allFindings) byPattern.set(f.patternId, (byPattern.get(f.patternId) ?? 0) + 1);

  const p0 = allFindings.filter((f) => f.severity === "P0").length;
  const p1 = allFindings.filter((f) => f.severity === "P1").length;

  lines.push(`# Editorial audit — ${TODAY}`);
  lines.push("");
  lines.push(`> Generated by \`bun run audit:editorial\`. Signal-only — never blocks deploys.`);
  lines.push(`> Pattern logic: scripts/audit-editorial.ts. False positives expected; review each flag.`);
  lines.push("");

  lines.push("## Summary");
  lines.push("");
  lines.push(`- Plates scanned: ${plateCount}`);
  lines.push(`- Plates with findings: ${byPlate.size}`);
  lines.push(`- Total findings: ${allFindings.length}  (P0: ${p0}, P1: ${p1})`);
  lines.push("");

  lines.push("### Findings by pattern");
  lines.push("");
  lines.push("| Pattern | Count | Severity |");
  lines.push("|---|---:|---|");
  for (const pat of PATTERNS) {
    const count = byPattern.get(pat.id) ?? 0;
    if (count > 0) {
      lines.push(`| \`${pat.id}\` | ${count} | ${pat.severity} |`);
    }
  }
  lines.push("");

  if (byPlate.size > 0) {
    lines.push("## Findings by plate");
    lines.push("");
    const platesSorted = [...byPlate.keys()].sort();
    for (const slug of platesSorted) {
      const findings = byPlate.get(slug)!;
      const platP0 = findings.filter((f) => f.severity === "P0").length;
      const platP1 = findings.filter((f) => f.severity === "P1").length;
      lines.push(`### ${slug}  (P0: ${platP0}, P1: ${platP1})`);
      lines.push("");
      for (const f of findings) {
        lines.push(`- **[${f.severity}] ${f.patternId}** at \`${f.path}\``);
        lines.push(`  - Excerpt: \`${f.excerpt}\``);
        lines.push(`  - Why: ${f.description}`);
      }
      lines.push("");
    }
  } else {
    lines.push("## ✅ No findings — atlas is clean.");
    lines.push("");
  }

  return lines.join("\n");
}

async function main(): Promise<void> {
  const slugs = readdirSync(PEPTIDES_DIR)
    .filter((f) => f.endsWith(".yaml") && !f.startsWith("_"))
    .map((f) => f.replace(/\.yaml$/, ""))
    .sort();

  console.log(`[audit:editorial] scanning ${slugs.length} plates…`);

  const allFindings: Finding[] = [];
  for (const slug of slugs) {
    const path = join(PEPTIDES_DIR, `${slug}.yaml`);
    let doc: unknown;
    try {
      doc = yaml.load(readFileSync(path, "utf-8"));
    } catch (e) {
      console.error(`[audit:editorial] ${slug}.yaml: parse failed — ${(e as Error).message}`);
      continue;
    }
    const findings = runOnPeptide(slug, doc);
    allFindings.push(...findings);
  }

  mkdirSync(REPORT_DIR, { recursive: true });
  const reportPath = join(REPORT_DIR, `editorial-audit-${TODAY}.md`);
  writeFileSync(reportPath, renderReport(allFindings, slugs.length), "utf-8");

  const p0 = allFindings.filter((f) => f.severity === "P0").length;
  const p1 = allFindings.filter((f) => f.severity === "P1").length;
  console.log(`[audit:editorial] ${allFindings.length} findings (P0: ${p0}, P1: ${p1}).`);
  console.log(`[audit:editorial] report → ${reportPath}`);
}

main().catch((e) => {
  console.error("[audit:editorial] error:", e);
  process.exit(1);
});

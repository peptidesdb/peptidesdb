import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import { Peptide } from "./schemas/peptide";
import { CitationRegistry } from "./schemas/citation";
import { CITATIONS } from "@/generated/citations";

/* =========================================================
   Content loaders (SERVER ONLY)
   Run at build (and dev) — every YAML is parsed and validated
   exactly once per process. Build crashes if any file is invalid,
   which is the desired behavior: bad content never reaches prod.
   `server-only` import prevents accidental client imports.
   ========================================================= */

const CONTENT_ROOT = join(process.cwd(), "content");
const PEPTIDES_DIR = join(CONTENT_ROOT, "peptides");

let _peptidesCache: Peptide[] | null = null;

/** Load + validate every peptide YAML. Cached for the process. */
export function loadAllPeptides(): Peptide[] {
  if (_peptidesCache) return _peptidesCache;

  const files = readdirSync(PEPTIDES_DIR).filter(
    (f) => f.endsWith(".yaml") && !f.startsWith("_"),
  );
  const peptides: Peptide[] = files.map((file) => {
    const path = join(PEPTIDES_DIR, file);
    const raw = readFileSync(path, "utf-8");
    let parsed: unknown;
    try {
      parsed = yaml.load(raw);
    } catch (e) {
      throw new Error(`YAML parse failed: ${file}\n${(e as Error).message}`);
    }
    const result = Peptide.safeParse(parsed);
    if (!result.success) {
      throw new Error(
        `Schema violation in ${file}:\n${JSON.stringify(result.error.issues, null, 2)}`
      );
    }
    const fileSlug = file.replace(/\.yaml$/, "");
    if (result.data.slug !== fileSlug) {
      throw new Error(
        `Slug mismatch in ${file}: file is "${fileSlug}" but yaml.slug is "${result.data.slug}"`
      );
    }
    return result.data;
  });

  // Slug uniqueness
  const slugs = new Set<string>();
  for (const p of peptides) {
    if (slugs.has(p.slug)) {
      throw new Error(`Duplicate peptide slug: ${p.slug}`);
    }
    slugs.add(p.slug);
  }

  // Synergy partner_slug foreign-key check — every stack partner
  // must resolve to a peptide in the catalog. Prevents dead links.
  const missingPartners: { peptide: string; partner: string }[] = [];
  for (const p of peptides) {
    if (!p.synergy) continue;
    for (const stack of p.synergy.stacks) {
      if (!slugs.has(stack.partner_slug)) {
        missingPartners.push({ peptide: p.slug, partner: stack.partner_slug });
      }
    }
  }
  if (missingPartners.length > 0) {
    throw new Error(
      `Synergy partner_slug refs do not resolve to a known peptide:\n${missingPartners
        .map((m) => `  - ${m.peptide}.synergy → ${m.partner}`)
        .join("\n")}`,
    );
  }

  // Citation resolution check — every cite must exist in the registry
  const registry = CitationRegistry.parse(CITATIONS);
  const refIds = new Set(Object.keys(registry));
  const missing: { peptide: string; ref: string }[] = [];
  for (const p of peptides) {
    walkCitableValues(p, (citeRefs) => {
      for (const r of citeRefs) {
        if (!refIds.has(r)) missing.push({ peptide: p.slug, ref: r });
      }
    });
  }
  if (missing.length > 0) {
    throw new Error(
      `Unresolved citations (add to content/refs.yaml then run gen:citations):\n${missing
        .map((m) => `  - ${m.peptide} → ${m.ref}`)
        .join("\n")}`
    );
  }

  // Each refs entry's id must match its key
  for (const [key, cite] of Object.entries(registry)) {
    if (cite.id !== key) {
      throw new Error(
        `refs.yaml: key "${key}" does not match its citation.id "${cite.id}"`
      );
    }
  }

  peptides.sort((a, b) => a.name.localeCompare(b.name));
  _peptidesCache = peptides;
  return peptides;
}

/** Get a single peptide by slug, or undefined. */
export function getPeptide(slug: string): Peptide | undefined {
  return loadAllPeptides().find((p) => p.slug === slug);
}

/* ---------------------------------------------------------
   Internal: walk a peptide and yield every cite[] array.
   --------------------------------------------------------- */
type CiteWalker = (refs: string[]) => void;

function walkCitableValues(node: unknown, visit: CiteWalker): void {
  if (!node) return;
  if (Array.isArray(node)) {
    for (const item of node) walkCitableValues(item, visit);
    return;
  }
  if (typeof node === "object") {
    const obj = node as Record<string, unknown>;
    if (Array.isArray(obj.cite) && obj.cite.every((x) => typeof x === "string")) {
      visit(obj.cite as string[]);
    }
    for (const v of Object.values(obj)) walkCitableValues(v, visit);
  }
}

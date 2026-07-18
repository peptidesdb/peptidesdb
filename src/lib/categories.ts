import "server-only";
import { loadAllPeptides } from "./content";
import type { Peptide } from "./schemas/peptide";

/* =========================================================
   Category hubs — class-level landing pages.

   Only a CURATED set of substantive categories become hub pages. The YAML
   carries ~180 category tags, most with 1-2 members; turning all of them into
   pages would be thin-content spam. These 9 map to real class-level search
   intent ("GLP-1 peptides", "healing peptides", "GH secretagogues") and each
   has enough member plates to be a genuine index page. Intros are short and
   derived — no fabricated claims; the value is the class-level title + the
   internal-link hub, not invented prose.
   ========================================================= */

export interface HubCategory {
  slug: string;
  label: string;
  blurb: string;
  /** Extra category slugs that also belong in this hub (e.g. "healing" for the
   *  wound-healing hub, so the flagship BPC-157 is included). */
  aliases?: string[];
}

export const HUB_CATEGORIES: HubCategory[] = [
  { slug: "glp-1", label: "GLP-1 & Incretin Peptides", blurb: "GLP-1 receptor agonists and incretin peptides in metabolic research." },
  { slug: "gh-axis", label: "Growth-Hormone Axis Peptides", blurb: "Growth-hormone secretagogues and GH-axis research peptides — GHRH analogues, GHRPs, and related compounds." },
  { slug: "weight-management", label: "Metabolic & Weight-Research Peptides", blurb: "Peptides studied in body-weight and metabolic-regulation research." },
  { slug: "lipolytic", label: "Lipolysis-Research Peptides", blurb: "Peptides studied for lipolysis and fat-metabolism research.", aliases: ["fat-loss"] },
  { slug: "wound-healing", label: "Tissue-Repair Research Peptides", blurb: "Peptides studied for tissue repair and wound-healing research.", aliases: ["healing", "tissue-repair", "tissue-regeneration", "tendon-ligament"] },
  { slug: "neuroprotective", label: "Neuroprotection-Research Peptides", blurb: "Peptides studied for neuroprotection and nervous-system research." },
  { slug: "anti-aging", label: "Longevity & Aging-Research Peptides", blurb: "Peptides studied in aging, cellular-senescence, and longevity research." },
  { slug: "bioregulator", label: "Peptide Bioregulators", blurb: "Short peptide bioregulators from the Khavinson research tradition." },
  { slug: "cognitive", label: "Cognition-Research Peptides", blurb: "Peptides studied for cognition, memory, and neurotrophic research.", aliases: ["nootropic", "neurotrophic"] },
];

const _byslug = new Map(HUB_CATEGORIES.map((c) => [c.slug, c]));

export function hubCategory(slug: string): HubCategory | null {
  return _byslug.get(slug) ?? null;
}

/** Member plates of a category, name-sorted. */
export function peptidesInCategory(slug: string): Peptide[] {
  const hub = _byslug.get(slug);
  const match = new Set([slug, ...(hub?.aliases ?? [])]);
  return loadAllPeptides()
    .filter((p) => p.categories.some((c) => match.has(c)))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** The hub categories a given peptide belongs to (for plate → hub links). */
export function hubsForPeptide(p: Peptide): HubCategory[] {
  return HUB_CATEGORIES.filter((c) =>
    [c.slug, ...(c.aliases ?? [])].some((s) => p.categories.includes(s)),
  );
}

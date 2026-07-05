import "server-only";

/* =========================================================
   Molecular identity for entity resolution + AI citation.

   Per-compound external identifiers (PubChem CID → sameAs) plus
   molecular formula and weight. This is what lets an AI answer
   engine resolve "which BPC-157" to a canonical database entry
   and cite it. Values fetched from PubChem and kept as committed,
   versioned data; add a row as coverage grows.

   TB-500 is mapped to thymosin β-4 (the full-length parent),
   matching how it is described across the atlas.
   ========================================================= */

export interface MolecularData {
  slug: string;
  /** PubChem Compound ID. */
  pubchemCid: number;
  /** Molecular formula, e.g. "C62H98N16O22". */
  formula: string;
  /** Average molecular weight in daltons (g/mol), per PubChem. */
  molecularWeight: number;
  /** Wikidata entity QID, matched by PubChem CID (P662). Optional — not all
   *  compounds are in Wikidata. */
  wikidataQid?: string;
}

const DATA: MolecularData[] = [
  { slug: "semaglutide", pubchemCid: 56843331, formula: "C187H291N45O59", molecularWeight: 4114, wikidataQid: "Q27261089" },
  { slug: "tirzepatide", pubchemCid: 156588324, formula: "C225H348N48O68", molecularWeight: 4813, wikidataQid: "Q108324770" },
  { slug: "liraglutide", pubchemCid: 16134956, formula: "C172H265N43O51", molecularWeight: 3751, wikidataQid: "Q2526479" },
  { slug: "cagrilintide", pubchemCid: 171397054, formula: "C194H312N54O59S2", molecularWeight: 4409 },
  { slug: "survodutide", pubchemCid: 168429725, formula: "C192H289N47O61", molecularWeight: 4232, wikidataQid: "Q123907235" },
  { slug: "mazdutide", pubchemCid: 167312357, formula: "C207H317N45O65", molecularWeight: 4476, wikidataQid: "Q123248554" },
  { slug: "bpc-157", pubchemCid: 9941957, formula: "C62H98N16O22", molecularWeight: 1419.5, wikidataQid: "Q27270252" },
  { slug: "tb-500", pubchemCid: 45382195, formula: "C212H350N56O78S", molecularWeight: 4963 },
  { slug: "ghk-cu", pubchemCid: 139035031, formula: "C14H21CuN6O4-", molecularWeight: 400.9 },
  { slug: "cjc-1295", pubchemCid: 91971820, formula: "C165H269N47O46", molecularWeight: 3647.2 },
  { slug: "ipamorelin", pubchemCid: 9831659, formula: "C38H49N9O5", molecularWeight: 711.9, wikidataQid: "Q76414523" },
  { slug: "sermorelin", pubchemCid: 16132413, formula: "C149H246N44O42S", molecularWeight: 3357.9, wikidataQid: "Q7455005" },
  { slug: "tesamorelin", pubchemCid: 16137828, formula: "C221H366N72O67S", molecularWeight: 5136, wikidataQid: "Q7705415" },
  { slug: "mk-677", pubchemCid: 178024, formula: "C27H36N4O5S", molecularWeight: 528.7, wikidataQid: "Q5984942" },
  { slug: "mots-c", pubchemCid: 146675088, formula: "C101H152N28O22S2", molecularWeight: 2174.6 },
  { slug: "semax", pubchemCid: 9811102, formula: "C37H51N9O10S", molecularWeight: 813.9 },
  { slug: "selank", pubchemCid: 11765600, formula: "C33H57N11O9", molecularWeight: 751.9, wikidataQid: "Q5810370" },
  { slug: "epitalon", pubchemCid: 219042, formula: "C14H22N4O9", molecularWeight: 390.35, wikidataQid: "Q27285389" },
  { slug: "pt-141", pubchemCid: 9941379, formula: "C50H68N14O10", molecularWeight: 1025.2, wikidataQid: "Q415353" },
  { slug: "melanotan-2", pubchemCid: 92432, formula: "C50H69N15O9", molecularWeight: 1024.2, wikidataQid: "Q423855" },
];

const _bySlug = new Map(DATA.map((d) => [d.slug, d]));

export function molecularForSlug(slug: string): MolecularData | null {
  return _bySlug.get(slug) ?? null;
}

export function allMolecular(): MolecularData[] {
  return DATA;
}

export function pubchemUrl(cid: number): string {
  return `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`;
}

export function wikidataUrl(qid: string): string {
  return `https://www.wikidata.org/wiki/${qid}`;
}

/** All external-database URLs for a compound, for schema.org sameAs. */
export function sameAsUrls(m: MolecularData): string[] {
  const urls = [pubchemUrl(m.pubchemCid)];
  if (m.wikidataQid) urls.push(wikidataUrl(m.wikidataQid));
  return urls;
}

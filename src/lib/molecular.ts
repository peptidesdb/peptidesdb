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

  // Added 2026-07-18 — PubChem entity expansion (audit R5); verified via PubChem synonyms/sequence + MW sanity-check.
  { slug: "5-amino-1mq", pubchemCid: 950107, formula: "C10H11N2+", molecularWeight: 159.21 },
  { slug: "adipotide", pubchemCid: 163360068, formula: "C111H206N36O28S2", molecularWeight: 2557.2, wikidataQid: "Q4682946" },
  { slug: "ahk-cu", pubchemCid: 168431292, formula: "C15H24ClCuN6O4-", molecularWeight: 451.39 },
  { slug: "aod-9604", pubchemCid: 71300630, formula: "C78H123N23O23S2", molecularWeight: 1815.1, wikidataQid: "Q72443552" },
  { slug: "ara-290", pubchemCid: 91810664, formula: "C51H84N16O21", molecularWeight: 1257.3, wikidataQid: "Q27273306" },
  { slug: "dermorphin", pubchemCid: 5485199, formula: "C40H50N8O10", molecularWeight: 802.9, wikidataQid: "Q1771654" },
  { slug: "dihexa", pubchemCid: 129010512, formula: "C27H44N4O5", molecularWeight: 504.7, wikidataQid: "Q21098991" },
  { slug: "dsip", pubchemCid: 68816, formula: "C35H48N10O15", molecularWeight: 848.8, wikidataQid: "Q5254800" },
  { slug: "foxo4", pubchemCid: 167312269, formula: "C228H388N86O64", molecularWeight: 5358 },
  { slug: "ghrp-2", pubchemCid: 6918245, formula: "C45H55N9O6", molecularWeight: 818, wikidataQid: "Q21098924" },
  { slug: "ghrp-6", pubchemCid: 4345065, formula: "C46H56N12O6", molecularWeight: 873, wikidataQid: "Q27077800" },
  { slug: "glp-1-7-37", pubchemCid: 16133830, formula: "C151H228N40O47", molecularWeight: 3355.7 },
  { slug: "glutathione", pubchemCid: 124886, formula: "C10H17N3O6S", molecularWeight: 307.33, wikidataQid: "Q116907" },
  { slug: "gonadorelin", pubchemCid: 638793, formula: "C55H75N17O13", molecularWeight: 1182.3, wikidataQid: "Q20817116" },
  { slug: "hexarelin", pubchemCid: 6918297, formula: "C47H58N12O6", molecularWeight: 887, wikidataQid: "Q21098927" },
  { slug: "hgh-fragment-176-191", pubchemCid: 172966176, formula: "C80H127N23O24S2", molecularWeight: 1859.1 },
  { slug: "humanin", pubchemCid: 16131438, formula: "C119H204N34O32S2", molecularWeight: 2687.2, wikidataQid: "Q27077999" },
  { slug: "kisspeptin-10", pubchemCid: 25240297, formula: "C63H83N17O14", molecularWeight: 1302.4 },
  { slug: "kpv", pubchemCid: 125672, formula: "C16H30N4O4", molecularWeight: 342.43 },
  { slug: "ll-37", pubchemCid: 16198951, formula: "C205H340N60O53", molecularWeight: 4493 },
  { slug: "matrixyl", pubchemCid: 9897237, formula: "C39H75N7O10", molecularWeight: 802.1 },
  { slug: "mt-1", pubchemCid: 16197727, formula: "C78H111N21O19", molecularWeight: 1646.8, wikidataQid: "Q410794" },
  { slug: "oxytocin", pubchemCid: 439302, formula: "C43H66N12O12S2", molecularWeight: 1007.2, wikidataQid: "Q169960" },
  { slug: "pe-22-28", pubchemCid: 165437303, formula: "C35H55N11O9", molecularWeight: 773.9 },
  { slug: "pinealon", pubchemCid: 10273502, formula: "C15H26N6O8", molecularWeight: 418.4 },
  { slug: "pnc-27", pubchemCid: 16201774, formula: "C188H293N53O44S", molecularWeight: 4032 },
  { slug: "prostamax", pubchemCid: 9848296, formula: "C20H33N5O9", molecularWeight: 487.5 },
  { slug: "ptd-dbm", pubchemCid: 176453931, formula: "C124H225N61O28S2", molecularWeight: 3082.6 },
  { slug: "snap-8", pubchemCid: 76283482, formula: "C41H70N16O16S", molecularWeight: 1075.2, wikidataQid: "Q27270653" },
  { slug: "ss-31", pubchemCid: 11764719, formula: "C32H49N9O5", molecularWeight: 639.8, wikidataQid: "Q27269822" },
  { slug: "teriparatide", pubchemCid: 16133850, formula: "C181H291N55O51S2", molecularWeight: 4118, wikidataQid: "Q411781" },
  { slug: "tesofensine", pubchemCid: 11370864, formula: "C17H23Cl2NO", molecularWeight: 328.3, wikidataQid: "Q7705544" },
  { slug: "thymosin-alpha-1", pubchemCid: 16130571, formula: "C129H215N33O55", molecularWeight: 3108.3, wikidataQid: "Q20817234" },
  { slug: "triptorelin", pubchemCid: 25074470, formula: "C64H82N18O13", molecularWeight: 1311.4, wikidataQid: "Q1992452" },
  { slug: "vesugen", pubchemCid: 87571363, formula: "C15H26N4O8", molecularWeight: 390.39 },
  { slug: "vilon", pubchemCid: 7010502, formula: "C11H21N3O5", molecularWeight: 275.3 },
  { slug: "vip", pubchemCid: 53314964, formula: "C147H237N43O43S", molecularWeight: 3326.8, wikidataQid: "Q414964" },
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

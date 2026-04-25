import type { Citation } from "./schemas/citation";

/* =========================================================
   Citation utilities (client + server safe).
   No fs / no Node imports — these helpers run anywhere.
   ========================================================= */

/**
 * Resolve a Citation to a public URL.
 * Order: PMID → DOI → NCT → explicit url → fallback /refs/<id>.
 */
export function citationUrl(cite: Citation): string {
  if (cite.pmid) return `https://pubmed.ncbi.nlm.nih.gov/${cite.pmid}/`;
  if (cite.doi) return `https://doi.org/${cite.doi}`;
  if (cite.nct) return `https://clinicaltrials.gov/study/${cite.nct}`;
  if (cite.url) return cite.url;
  return `/refs/${cite.id}`;
}

/** Vancouver-style short label: "Falutz 2007". */
export function citationLabel(cite: Citation): string {
  const author = cite.authors?.[0]?.split(" ")[0] ?? cite.title.slice(0, 30);
  return `${author} ${cite.year}`;
}

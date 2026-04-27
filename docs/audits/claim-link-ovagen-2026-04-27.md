# Claim-link audit: ovagen

> Generated 2026-04-27 by `bun run audit:claims ovagen`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 5
- ✅ ok (score ≥ 0.85): 0
- ⚠️ partial (0.6–0.85): 4
- ❌ unsupported (< 0.6): 1
- — skipped (no PMIDs available): 0

## ❌ Unsupported (P0 — must fix or remove citation)

### mechanism.pathway

- **Claim**: Pathway: Tissue-specific peptide → Nuclear chromatin binding → Gene expression modulation → Cellular differentiation
- **Score**: 0.15
- **Citations**: khavinson-2002 (PMID 12420072), riadnova-2001 (PMID 11450441)
- **Rationale**: Neither abstract substantively supports the claimed pathway. Paper [1] discusses peptide effects on thymocyte proliferation via sphingomyelin signaling, not nuclear chromatin binding or gene expression modulation. Paper [2] describes affinity chromatography of nucleoprotein complexes but does not address the sequential pathway linking tissue-specific peptides to cellular differentiation through chromatin binding and gene expression.

## ⚠️ Partial (P1 — human review)

### mechanism.origin

- **Claim**: Origin / discovery: Extracted from bovine/porcine ovarian tissue; short synthetic peptides (2–4 amino acids)
- **Score**: 0.65
- **Citations**: khavinson-2002 (PMID 12420072)
- **Rationale**: Abstract [1] confirms that these are synthetic peptides of 2-4 amino acids (Vilon: 2 aa, Epithalon: 4 aa, Cortagen: 4 aa), but does not mention extraction from bovine/porcine ovarian tissue or discuss their origin/discovery. The claim is partially supported regarding peptide composition but lacks support for the extraction source.

### mechanism.receptor_class

- **Claim**: Receptor class: Nuclear chromatin complexes; affinity chromatography demonstrates tissue-selective nucleoprotein binding
- **Score**: 0.72
- **Citations**: riadnova-2001 (PMID 11450441)
- **Rationale**: Abstract [1] directly demonstrates affinity chromatography of nucleoprotein complexes and shows tissue-selective binding (brain vs. liver nucleoproteins bind differently to cerebral cortex membranes), but does not explicitly characterize these complexes as 'nuclear chromatin complexes' or discuss them as a 'receptor class.'

### mechanism.diagram[3].text

- **Claim**: Mechanism diagram step: ↓ Tissue-specific nucleoprotein binding
- **Score**: 0.72
- **Citations**: riadnova-2001 (PMID 11450441)
- **Rationale**: Abstract [1] demonstrates tissue-specific nucleoprotein binding by showing that nucleoprotein complexes from brain have greater selectivity for cerebral cortex membranes than those from liver, directly supporting the claim of tissue-specific nucleoprotein binding as a mechanistic step.

### mechanism.diagram[5].text

- **Claim**: Mechanism diagram step: ↓ Cellular differentiation, apoptosis regulation
- **Score**: 0.72
- **Citations**: khavinson-2010 (PMID 21246099)
- **Rationale**: Abstract [1] addresses apoptosis regulation (explicitly measuring apoptosis parameters), which directly matches half of the claimed mechanism step. However, there is no mention of cellular differentiation in the abstract, so the claim is only partially supported.

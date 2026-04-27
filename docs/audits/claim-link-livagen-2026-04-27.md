# Claim-link audit: livagen

> Generated 2026-04-27 by `bun run audit:claims livagen`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 17
- ✅ ok (score ≥ 0.85): 16
- ⚠️ partial (0.6–0.85): 0
- ❌ unsupported (< 0.6): 1
- — skipped (no PMIDs available): 0

## ❌ Unsupported (P0 — must fix or remove citation)

### hero_stats[1]

- **Claim**: Routes tested: Oral / SQ
- **Score**: 0.35
- **Citations**: timofeeva-2005 (PMID 16075683), khavinson-2001 (PMID 11713572)
- **Rationale**: Abstract [1] explicitly mentions oral (per os) administration of Livagen, but neither abstract discusses subcutaneous (SQ) routes. The claim requires evidence for both routes tested, but only one is substantiated.

## ✅ OK (collapsed for brevity)

- **summary**: Summary: Synthetic tetrapeptide (Lys-Glu-Asp-Ala) developed in the Khavinson bioregulator tradition for liver tissue support. Animal models demonstrate hepatoprotective effects in fibrosis, acute and chronic hepatitis, with tissue-specific stimulation of hepatocyte protein synthesis and age-dependent normalization of digestive enzyme activity. Resists hydrolysis by intestinal peptidases; oral administration viable. *(score=0.92)*
- **hero_stats[0]**: Dipeptidase inhibition: 50% *(score=0.95)*
- **hero_stats[2]**: Target tissue: Liver *(score=0.90)*
- **mechanism.primary_target**: Primary target: Hepatocyte protein synthesis machinery *(score=0.85)*
- **mechanism.pathway**: Pathway: Tissue-specific bioregulator → Hepatocyte stimulation → Protein synthesis normalization *(score=0.92)*
- **mechanism.half_life_basis**: Half-life basis: Resists intestinal peptidase hydrolysis; weakly hydrolyzed *(score=0.92)*
- **mechanism.diagram[3].text**: Mechanism diagram step: ↓ Protein synthesis ↑ (aged), circadian amplitude ↑ *(score=0.85)*
- **mechanism.diagram[4].text**: Mechanism diagram step: Hepatoprotection, enzyme normalization, fibrosis attenuation *(score=0.88)*
- **dosage.rows[0].value**: Dosage value: Not specified in abstracts; 2-week administration protocol *(score=0.85)*
- **dosage.rows[1].value**: Dosage value: 2 weeks (enzyme study); up to 24 months (cell culture) *(score=0.85)*
- **dosage.rows[3].value**: Dosage value: Animal models (rats, 1–24 months age); in vitro hepatocyte culture *(score=0.92)*
- **dosage.rows[2].notes**: Dosage notes: Resists peptidase hydrolysis, enabling oral bioavailability. *(score=0.85)*
- **side_effects.rows[2].value**: Side effect: Weakly hydrolyzed; minimal breakdown by intestinal enzymes *(score=0.95)*
- **administration.steps[0]**: Route selection: Oral administration supported by peptidase resistance. Subcutaneous route used in organotypic culture experiments. *(score=0.85)*
- **administration.steps[1]**: Timing: No specific timing documented. Two-week protocols used in animal models with daily administration. *(score=0.90)*
- **administration.steps[2]**: Age-dependent response: Elderly individuals may exhibit different enzyme normalization patterns than younger cohorts, based on rat age-stratified findings. *(score=0.92)*

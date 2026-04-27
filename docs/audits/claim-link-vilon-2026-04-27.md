# Claim-link audit: vilon

> Generated 2026-04-27 by `bun run audit:claims vilon`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 7
- ✅ ok (score ≥ 0.85): 7
- ⚠️ partial (0.6–0.85): 0
- ❌ unsupported (< 0.6): 0
- — skipped (no PMIDs available): 0

## ✅ OK (collapsed for brevity)

- **hero_stats[1]**: Stimulates: T-helper *(score=0.95)*
- **hero_stats[2]**: Model basis: Mouse *(score=0.95)*
- **mechanism.downstream_effect**: Downstream effect: Enhanced T-cell differentiation (CD4+, CD8+, B-cells), thymocyte proliferation, modulated IL-1β comitogenic activity, proposed chromatin decondensation in aged lymphocytes *(score=0.92)*
- **mechanism.origin**: Origin / discovery: Synthetic dipeptide derived from Khavinson thymic peptide extraction studies (Thymalin fraction) *(score=0.92)*
- **mechanism.diagram[2].text**: Mechanism diagram step: Sphingomyelinase ↑ *(score=0.85)*
- **mechanism.diagram[4].text**: Mechanism diagram step: CD5+ precursors → CD4+, CD8+, B-cells *(score=0.92)*
- **synergy.stacks[1]**: Stack with thymalin: Thymalin is the parent polypeptide complex from which Vilon was isolated. Both target immune differentiation, but Thymalin is a complex mixture (multiple peptides), whereas Vilon is a purified dipeptide. Morozov & Khavinson (1997) described Vilon as a synthetic successor designed to replicate Thymalin's immunomodulatory effects with greater specificity. Redundant in practice; no published combination studies. (primary benefit: Redundant — both target T-cell differentiation) *(score=0.90)*

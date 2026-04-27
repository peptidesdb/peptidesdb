# Claim-link audit: crystagen

> Generated 2026-04-27 by `bun run audit:claims crystagen`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 7
- ✅ ok (score ≥ 0.85): 7
- ⚠️ partial (0.6–0.85): 0
- ❌ unsupported (< 0.6): 0
- — skipped (no PMIDs available): 0

## ✅ OK (collapsed for brevity)

- **hero_stats[0]**: Primary target: B-cell *(score=0.85)*
- **hero_stats[1]**: Tissue specificity: Spleen *(score=0.95)*
- **mechanism.primary_target**: Primary target: B-lymphocytes in splenic tissue *(score=0.92)*
- **mechanism.pathway**: Pathway: B-cell activation → Immune modulation during aging *(score=0.85)*
- **mechanism.downstream_effect**: Downstream effect: B-cell activation via apoptosis reduction; no observed increase in splenic cell renewal *(score=0.85)*
- **synergy.stacks[0]**: Stack with vilon: Vilon (Lys-Glu) activates T-helper cells via apoptosis reduction, while Crystagen activates B-cells. Dual T/B immune modulation in aging models may provide complementary thymic-immune support within the Khavinson bioregulator framework. Both target splenic immune aging through distinct lymphocyte subsets. (primary benefit: Broader thymic-immune coverage (T-cell + B-cell)) *(score=0.92)*
- **synergy.stacks[1]**: Stack with timogen: Both Timogen and Crystagen activate B-cells, but via different mechanisms — Timogen enhances proliferation and reduces apoptosis, while Crystagen reduces apoptosis without proliferative enhancement. Overlapping B-cell targets may reduce additive benefit compared to T/B combinations. (primary benefit: Dual B-cell modulation pathways) *(score=0.92)*

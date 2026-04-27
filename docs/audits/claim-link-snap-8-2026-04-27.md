# Claim-link audit: snap-8

> Generated 2026-04-27 by `bun run audit:claims snap-8`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 6
- ✅ ok (score ≥ 0.85): 6
- ⚠️ partial (0.6–0.85): 0
- ❌ unsupported (< 0.6): 0
- — skipped (no PMIDs available): 0

## ✅ OK (collapsed for brevity)

- **dosage.rows[0].value**: Dosage value: 2–10% in cosmetic formulations *(score=0.92)*
- **dosage.rows[1].value**: Dosage value: Twice daily (morning and evening) *(score=0.95)*
- **dosage.rows[2].value**: Dosage value: 20–60 days for visible effect *(score=0.92)*
- **dosage.rows[6].value**: Dosage value: Visible reduction in wrinkle depth by day 20–28 *(score=0.85)*
- **side_effects.rows[2].value**: Side effect: Methionine residue susceptible to oxidation in formulation; may reduce efficacy *(score=0.92)*
- **side_effects.rows[3].value**: Side effect: Negligible; peptide remains in stratum corneum and epidermis *(score=0.92)*

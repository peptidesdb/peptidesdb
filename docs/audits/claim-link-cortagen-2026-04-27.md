# Claim-link audit: cortagen

> Generated 2026-04-27 by `bun run audit:claims cortagen`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 8
- ✅ ok (score ≥ 0.85): 8
- ⚠️ partial (0.6–0.85): 0
- ❌ unsupported (< 0.6): 0
- — skipped (no PMIDs available): 0

## ✅ OK (collapsed for brevity)

- **hero_stats[1]**: Antioxidant effect: ↓ LPO products *(score=0.95)*
- **mechanism.pathway**: Pathway: Antioxidant pathway modulation — suppression of LPO cascade, reduction of protein oxidative modification *(score=0.92)*
- **mechanism.downstream_effect**: Downstream effect: Decreased lipid peroxidation products, reduced oxidative protein damage, altered gene expression in cardiac tissue *(score=0.92)*
- **mechanism.origin**: Origin / discovery: Synthetic tetrapeptide derived from amino acid analysis of natural brain cortex peptide preparation Cortexin *(score=0.95)*
- **mechanism.diagram[4].text**: Mechanism diagram step: ↓ LPO products, ↓ oxidative protein damage *(score=0.92)*
- **dosage.rows[1].value**: Dosage value: 40-day injection course *(score=0.92)*
- **side_effects.rows[0].value**: Side effect: Suppression of antioxidant activity noted alongside LPO reduction *(score=0.95)*
- **side_effects.rows[1].value**: Side effect: No effect on immunity or hemostasis parameters in avian hypophysectomy model (unlike epithalon) *(score=0.90)*

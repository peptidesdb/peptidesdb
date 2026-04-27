# Claim-link audit: n-acetyl-epitalon-amidate

> Generated 2026-04-27 by `bun run audit:claims n-acetyl-epitalon-amidate`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 10
- ✅ ok (score ≥ 0.85): 9
- ⚠️ partial (0.6–0.85): 1
- ❌ unsupported (< 0.6): 0
- — skipped (no PMIDs available): 0

## ⚠️ Partial (P1 — human review)

### side_effects.rows[2].value

- **Claim**: Side effect: No cytotoxicity reported in human fetal fibroblast culture
- **Score**: 0.75
- **Citations**: khavinson-2004 (PMID 15455129)
- **Rationale**: Abstract [1] describes Epithalon treatment of human fetal fibroblasts without reporting cytotoxicity, consistent with the claim. However, the abstract focuses on telomerase expression and proliferative potential rather than explicitly addressing cytotoxicity assessment, so support is indirect rather than direct.

## ✅ OK (collapsed for brevity)

- **hero_stats[0]**: Extra divisions: 10 passages *(score=0.95)*
- **hero_stats[1]**: Enzyme induction: Telomerase+ *(score=0.92)*
- **mechanism.downstream_effect**: Downstream effect: Telomerase enzymatic activity induction, telomere elongation to early-passage length, extension of replicative lifespan in human somatic cells *(score=0.95)*
- **mechanism.receptor_class**: Receptor class: Direct DNA binding — not classical receptor-mediated; conformational complementarity to DNA double helix at promoter functional groups *(score=0.92)*
- **mechanism.diagram[1].text**: Mechanism diagram step: ↓ Complementary binding to DNA promoter *(score=0.92)*
- **mechanism.diagram[5].text**: Mechanism diagram step: ↓ Telomere elongation *(score=0.95)*
- **mechanism.diagram[6].text**: Mechanism diagram step: Overcoming Hayflick Limit · Extended Replicative Lifespan *(score=0.95)*
- **dosage.rows[2].value**: Dosage value: In vitro human cell culture *(score=0.92)*
- **dosage.rows[3].value**: Dosage value: Addition to human fetal fibroblast culture induced telomerase activity and telomere elongation to early-passage length *(score=0.95)*

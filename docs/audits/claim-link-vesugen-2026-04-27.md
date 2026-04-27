# Claim-link audit: vesugen

> Generated 2026-04-27 by `bun run audit:claims vesugen`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 4
- ✅ ok (score ≥ 0.85): 3
- ⚠️ partial (0.6–0.85): 0
- ❌ unsupported (< 0.6): 1
- — skipped (no PMIDs available): 0

## ❌ Unsupported (P0 — must fix or remove citation)

### hero_stats[1]

- **Claim**: Atherosclerotic tissue: Endothelin-1 ↓
- **Score**: 0.15
- **Citations**: kozlov-2016 (PMID 28539025)
- **Rationale**: The abstract describes endothelin-1 as INCREASED during atherosclerosis (not decreased), and states that KED peptide normalizes this elevated expression. The claim states endothelin-1 is down in atherosclerotic tissue, which contradicts the abstract's description of elevated endothelin-1 during atherosclerosis.

## ✅ OK (collapsed for brevity)

- **mechanism.downstream_effect**: Downstream effect: Normalised endothelin-1 expression in atherosclerotic/restenotic endothelium, restored connexin expression for cell-cell communication, enhanced proliferative capacity in senescent endothelial cultures *(score=0.92)*
- **mechanism.diagram[5].text**: Mechanism diagram step: ↓ Endothelin-1 normalised, connexin restored *(score=0.92)*
- **mechanism.diagram[6].text**: Mechanism diagram step: Vascular wall protection / endothelial function *(score=0.88)*

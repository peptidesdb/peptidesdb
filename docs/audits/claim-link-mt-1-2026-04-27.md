# Claim-link audit: mt-1

> Generated 2026-04-27 by `bun run audit:claims mt-1`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 9
- ✅ ok (score ≥ 0.85): 9
- ⚠️ partial (0.6–0.85): 0
- ❌ unsupported (< 0.6): 0
- — skipped (no PMIDs available): 0

## ✅ OK (collapsed for brevity)

- **summary**: Summary: Synthetic 13-amino-acid α-melanocyte-stimulating hormone (α-MSH) analogue, FDA-approved (2019, Scenesse) for erythropoietic protoporphyria. Acts on MC1R to stimulate melanin synthesis in melanocytes, enabling photoprotection in patients with severe photosensitivity. Distinguished from endogenous α-MSH by norleucine at position 4 and D-phenylalanine at position 7, conferring enhanced metabolic stability. Administered as subcutaneous implant. *(score=0.85)*
- **hero_stats[1]**: Peptide length: 13 AA *(score=0.95)*
- **mechanism.primary_target**: Primary target: Melanocortin-1 receptor (MC1R) on melanocytes *(score=0.85)*
- **mechanism.downstream_effect**: Downstream effect: Increased melanogenesis, photoprotection, reduced UV sensitivity *(score=0.85)*
- **mechanism.origin**: Origin / discovery: Synthetic 13-AA peptidomimetic with norleucine (position 4) and D-phenylalanine (position 7) substitutions for metabolic stability *(score=0.95)*
- **side_effects.rows[2].value**: Side effect: Generalised tanning (therapeutic effect), darkening of freckles/nevi *(score=0.92)*
- **side_effects.rows[3].value**: Side effect: Rapid pigmentation of existing nevi; new melanocytic lesions reported with unregulated use *(score=0.92)*
- **side_effects.rows[6].value**: Side effect: Impurity, infection, blood-borne virus transmission from illicit melanotan products *(score=0.92)*
- **side_effects.contraindications_relative[0]**: Relative contraindication: History of melanoma or atypical nevi (melanocortin receptor stimulation concern) *(score=0.87)*

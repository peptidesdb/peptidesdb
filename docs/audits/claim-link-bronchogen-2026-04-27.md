# Claim-link audit: bronchogen

> Generated 2026-04-27 by `bun run audit:claims bronchogen`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 13
- ✅ ok (score ≥ 0.85): 13
- ⚠️ partial (0.6–0.85): 0
- ❌ unsupported (< 0.6): 0
- — skipped (no PMIDs available): 0

## ✅ OK (collapsed for brevity)

- **hero_stats[0]**: Effective concentration: 0.05 ng/mL *(score=0.95)*
- **hero_stats[1]**: COPD model duration: 60 days *(score=0.95)*
- **hero_stats[2]**: Treatment course: 30 days *(score=0.92)*
- **mechanism.primary_target**: Primary target: Bronchial epithelial cells *(score=0.95)*
- **mechanism.downstream_effect**: Downstream effect: Reversal of goblet cell hyperplasia, squamous metaplasia elimination, restoration of ciliated epithelium, normalized secretory IgA and surfactant protein B production *(score=0.95)*
- **mechanism.diagram[4].text**: Mechanism diagram step: Ciliated cell restoration · Goblet cell normalization *(score=0.92)*
- **mechanism.diagram[5].text**: Mechanism diagram step: ↓ Neutrophilic inflammation · ↑ Secretory IgA *(score=0.92)*
- **dosage.rows[0].value**: Dosage value: 0.05 ng/mL *(score=0.95)*
- **dosage.rows[1].value**: Dosage value: 1 month (30 days) *(score=0.92)*
- **dosage.rows[2].value**: Dosage value: Animal models (rat) / organotypic culture *(score=0.85)*
- **dosage.rows[3].value**: Dosage value: NO₂-induced COPD (60-day intermittent exposure) *(score=0.95)*
- **administration.steps[1]**: Animal model protocol: In rat COPD models, tetrapeptide administered for 30-day course following 60-day NO₂ exposure. Route and exact dosing not specified in abstracts. *(score=0.92)*
- **administration.steps[2]**: Organotypic culture: Bronchial tissue explants from young (3-week) and aged (18-month) rats cultured in medium containing 0.05 ng/mL bronchogen, demonstrating tissue-specific stimulation. *(score=0.95)*

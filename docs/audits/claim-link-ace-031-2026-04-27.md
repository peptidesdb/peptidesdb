# Claim-link audit: ace-031

> Generated 2026-04-27 by `bun run audit:claims ace-031`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 8
- ✅ ok (score ≥ 0.85): 8
- ⚠️ partial (0.6–0.85): 0
- ❌ unsupported (< 0.6): 0
- — skipped (no PMIDs available): 0

## ✅ OK (collapsed for brevity)

- **hero_stats[2]**: Molecular weight: ~58.4 kDa *(score=0.95)*
- **mechanism.origin**: Origin / discovery: Recombinant fusion protein: human ActRIIB extracellular domain + IgG1-Fc fragment *(score=0.95)*
- **dosage.rows[1].value**: Dosage value: Variable purity; 12/14 tested products contained target protein plus contaminants *(score=0.95)*
- **dosage.rows[1].notes**: Dosage notes: SDS-PAGE revealed multiple protein bands; quality control absent. *(score=0.92)*
- **side_effects.rows[5].value**: Side effect: 12/14 tested products contained multiple unidentified proteins alongside ACE-031 *(score=0.95)*
- **side_effects.contraindications_absolute[3]**: Absolute contraindication: Use of non-pharmaceutical grade ACE-031 (contamination risk) *(score=0.92)*
- **administration.steps[1]**: Black market quality: 12 of 14 tested black market ACE-031 products contained the target protein but also carried multiple unidentified protein contaminants detectable by SDS-PAGE. Two products contained no ACVR2B-immunoreactive material. *(score=0.95)*
- **administration.steps[2]**: Detection in sport: ACE-031 is prohibited under WADA S4.3 (Myostatin Inhibitors). Gel electrophoresis and Western blotting using ACVR2B-specific antibodies can detect the ~58.4 kDa protein in biological samples. *(score=0.95)*

# Claim-link audit: ptd-dbm

> Generated 2026-04-27 by `bun run audit:claims ptd-dbm`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 8
- ✅ ok (score ≥ 0.85): 7
- ⚠️ partial (0.6–0.85): 1
- ❌ unsupported (< 0.6): 0
- — skipped (no PMIDs available): 0

## ⚠️ Partial (P1 — human review)

### administration.steps[1]

- **Claim**: Hair Regeneration Protocol (Animal Model): Topical application to scalp or wound site. Precise formulation not disclosed; studies used Cxxc5 knockout or direct peptide application in wound-induced hair neogenesis models.
- **Score**: 0.75
- **Citations**: ryu-2023 (PMID 36831222)
- **Rationale**: Abstract [1] confirms use of Cxxc5 knockout and direct peptide application (PTD-DBM) in wound-induced hair neogenesis models, supporting those specific methodological claims. However, the abstract does not describe topical scalp application protocols or provide formulation details, so the claim is partially but not fully substantiated.

## ✅ OK (collapsed for brevity)

- **summary**: Summary: Fusion peptide combining a protein transduction domain with a Dishevelled-binding motif. Inhibits CXXC5–Dishevelled interaction, activating Wnt/β-catenin signaling. Animal models demonstrate hair regeneration via PGD2-mediated pathway reversal and accelerated wound healing with reduced scar formation. *(score=0.90)*
- **hero_stats[0]**: Administration: Topical / SQ *(score=0.85)*
- **mechanism.pathway**: Pathway: Inhibit CXXC5 binding to Dishevelled → Release Wnt/β-catenin pathway inhibition *(score=0.92)*
- **dosage.rows[3].value**: Dosage value: Valproic acid (GSK-3β inhibitor) for wound healing synergy *(score=0.90)*
- **administration.steps[0]**: Wound Healing Protocol (Animal Model): Pyrogallol-functionalized hyaluronic acid (HA-PG) hydrogel patch loaded with PTD-DBM peptide, applied directly to wound bed. Adhesive hydrogel provides sustained release over multiple days. *(score=0.92)*
- **administration.steps[2]**: Combination Therapy: PTD-DBM + valproic acid (GSK-3β inhibitor) in HA-PG patch showed synergistic effect on scar reduction and regenerative wound healing. VPA enhances Wnt pathway activation downstream. *(score=0.92)*
- **synergy.stacks[0]**: Stack with valproic-acid: Valproic acid (GSK-3β inhibitor) synergizes with PTD-DBM by blocking downstream Wnt pathway inhibition. PTD-DBM releases Dishevelled from CXXC5 suppression, while VPA prevents GSK-3β-mediated β-catenin degradation. Combined, they maximize Wnt/β-catenin activation for regenerative wound healing and scar reduction. (primary benefit: Regenerative wound healing with minimal scar formation) *(score=0.92)*

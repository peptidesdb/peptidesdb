# Claim-link audit: gdf-8

> Generated 2026-04-27 by `bun run audit:claims gdf-8`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 21
- ✅ ok (score ≥ 0.85): 20
- ⚠️ partial (0.6–0.85): 1
- ❌ unsupported (< 0.6): 0
- — skipped (no PMIDs available): 0

## ⚠️ Partial (P1 — human review)

### side_effects.rows[2].value

- **Claim**: Side effect: No major safety concerns in mice; rare hypersensitivity possible
- **Score**: 0.75
- **Citations**: jacquez-2026 (PMID 41993333)
- **Rationale**: Abstract [1] directly states 'No major safety concerns were identified' in MS2.87-97-treated mice, supporting the first part of the claim. However, the abstract does not mention hypersensitivity reactions or any rare adverse events, so the second part about 'rare hypersensitivity possible' is not substantiated by the provided text.

## ✅ OK (collapsed for brevity)

- **summary**: Summary: TGF-β superfamily myokine that negatively regulates skeletal muscle growth. Genetic loss-of-function increases muscle mass, reduces adiposity, and improves metabolic health in mice and humans with no known adverse phenotypes. Primary research focus involves inhibition strategies (monoclonal antibodies, active immunotherapy, gene editing) rather than exogenous administration. Studied for sarcopenia, obesity, and muscle wasting conditions. *(score=0.92)*
- **hero_stats[1]**: Fat reduction (loss-of-function): ↓ Adiposity *(score=0.95)*
- **hero_stats[2]**: Phenotype (genetic null): No adverse *(score=0.92)*
- **mechanism.primary_target**: Primary target: Activin type II receptors (ActRIIA/B) on skeletal muscle *(score=0.92)*
- **mechanism.downstream_effect**: Downstream effect: Restricts muscle hypertrophy, limits satellite cell activation, increases proteolysis via ubiquitin-proteasome and autophagy pathways *(score=0.85)*
- **mechanism.origin**: Origin / discovery: Endogenous myokine secreted by skeletal muscle; circulates systemically as latent complex *(score=0.92)*
- **mechanism.feedback_intact**: Feedback loop: Yes — part of muscle-pituitary endocrine axis; muscle-derived MSTN influences FSH synthesis *(score=0.92)*
- **dosage.rows[2].value**: Dosage value: Active immunization protocol in mice — elicits anti-MSTN antibodies without GDF11 cross-reactivity *(score=0.92)*
- **dosage.rows[3].value**: Dosage value: Combined active immunization in GH-deficient mice *(score=0.92)*
- **dosage.rows[2].notes**: Dosage notes: Reduces body fat, increases muscle mass and grip strength; no major safety concerns in animal models. *(score=0.92)*
- **dosage.rows[3].notes**: Dosage notes: Improves skeletal muscle performance beyond single-target inhibition. *(score=0.88)*
- **fat_loss.evidence_meta**: Fat-loss evidence summary: Human genetic loss-of-function cohorts · Animal models with MSTN inhibition *(score=0.95)*
- **fat_loss.rows[1].value**: Fat-loss row value: Humans with MSTN function-disrupting variants have increased muscle mass, strength, and reduced adiposity *(score=0.95)*
- **fat_loss.rows[2].value**: Fat-loss row value: VLP-immunized mice: reduced age-associated weight gain, significantly lower body fat by DEXA *(score=0.95)*
- **fat_loss.rows[3].value**: Fat-loss row value: MSTN modulates myostatin-TAZ signaling; inhibition shifts adipose expansion toward hyperplasia *(score=0.92)*
- **fat_loss.rows[4].value**: Fat-loss row value: Improved metabolic health in genetic MSTN null models *(score=0.92)*
- **side_effects.rows[0].value**: Side effect: No known adverse phenotypes in humans or mice with MSTN loss-of-function *(score=0.95)*
- **side_effects.rows[3].value**: Side effect: No cardiac abnormalities detected in MSTN-immunized mice *(score=0.92)*
- **side_effects.rows[5].value**: Side effect: Circulating MSTN levels often fail to mirror intramuscular changes; clinical interpretation challenging *(score=0.95)*
- **administration.steps[2]**: VLP immunization protocol (animal model): MS2.87-97 VLP administered to mice elicits anti-MSTN antibodies targeting a discrete epitope in mature MSTN protein. Immunization schedule and dose optimized for sustained antibody response without GDF11 cross-reactivity. No human protocols established. *(score=0.92)*

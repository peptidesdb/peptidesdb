# Claim-link audit: dermorphin

> Generated 2026-04-27 by `bun run audit:claims dermorphin`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 16
- ✅ ok (score ≥ 0.85): 16
- ⚠️ partial (0.6–0.85): 0
- ❌ unsupported (< 0.6): 0
- — skipped (no PMIDs available): 0

## ✅ OK (collapsed for brevity)

- **summary**: Summary: Heptapeptide opioid (H-Tyr-D-Ala-Phe-Gly-Tyr-Pro-Ser-NH2) originally isolated from Phyllomedusa frog skin. Highly selective μ-opioid receptor agonist with ~30× potency of morphine. Contains naturally occurring D-alanine at position 2, conferring exceptional receptor selectivity and biostability. Research use only; controlled substance in many jurisdictions. *(score=0.92)*
- **hero_stats[1]**: Receptor type: μ-selective *(score=0.95)*
- **hero_stats[2]**: Unique feature: D-Ala² *(score=0.95)*
- **mechanism.primary_target**: Primary target: μ-opioid receptors (central and peripheral) *(score=0.92)*
- **mechanism.origin**: Origin / discovery: Phyllomedusa sauvagei and P. bicolor frog skin — gene-encoded with natural D-amino acid incorporation *(score=0.92)*
- **mechanism.antibody_development**: Antibody development: Site-directed antibodies produced for detection and purification *(score=0.95)*
- **mechanism.receptor_class**: Receptor class: μ-opioid receptor (high affinity, high selectivity) *(score=0.92)*
- **dosage.rows[2].value**: Dosage value: 5 pg/mL in equine plasma/urine *(score=0.95)*
- **dosage.rows[5].value**: Dosage value: Kambô ritual (P. bicolor skin) — violent emesis, vasodilation, fluid shifts, ADH dysregulation *(score=0.95)*
- **side_effects.rows[1].value**: Side effect: Analgesia (high-affinity sites), catalepsy (low-affinity sites) *(score=0.95)*
- **side_effects.rows[2].value**: Side effect: Violent emesis, vasodilation, profound fluid shifts, hyponatremia, ADH dysregulation, brain death (case report) *(score=0.95)*
- **side_effects.rows[3].value**: Side effect: GI motility inhibition (ileum > vas deferens in vitro) *(score=0.92)*
- **side_effects.rows[4].value**: Side effect: Two μ-receptor subtypes — differential behavioral effects (analgesia vs. catalepsy) *(score=0.95)*
- **side_effects.rows[5].value**: Side effect: Tyr³-Pro⁶ bond relatively unstable; endogenous enzymes may produce tetrapeptide fragments *(score=0.95)*
- **administration.steps[2]**: Analytical detection: High-throughput LC-MS/MS screens developed for anti-doping programs detect dermorphin and 17 related peptides in equine and human urine/plasma at limits as low as 5 pg/mL. *(score=0.95)*
- **administration.steps[3]**: Kambô ritual (traditional use): Application of Phyllomedusa bicolor skin secretions to superficial burns. Not recommended — associated with severe toxicity including violent emesis, hyponatremia, and documented case of brain death. *(score=0.95)*

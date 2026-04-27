# Claim-link audit: cagrilintide

> Generated 2026-04-27 by `bun run audit:claims cagrilintide`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 31
- ✅ ok (score ≥ 0.85): 31
- ⚠️ partial (0.6–0.85): 0
- ❌ unsupported (< 0.6): 0
- — skipped (no PMIDs available): 0

## ✅ OK (collapsed for brevity)

- **summary**: Summary: Long-acting amylin receptor agonist studied in combination with semaglutide (CagriSema) for obesity and type 2 diabetes. Acts centrally to induce satiety, suppress prandial glucagon, and reduce food intake. Phase 3 trials show 7.5% greater weight loss versus semaglutide monotherapy. Demonstrates dual AMYR/calcitonin-receptor agonism with extended half-life enabling once-weekly subcutaneous dosing. *(score=0.92)*
- **hero_route**: Administration route: SQ · Once Weekly *(score=0.92)*
- **hero_stats[0]**: Additional weight loss vs semaglutide: 7.5% *(score=0.92)*
- **hero_stats[1]**: Dosing frequency: Once weekly *(score=0.92)*
- **hero_stats[2]**: Receptor agonism: Dual AMYR/CTR *(score=0.95)*
- **mechanism.primary_target**: Primary target: Amylin receptor (AMYR) and calcitonin receptor (CTR) heterodimeric complexes *(score=0.90)*
- **mechanism.pathway**: Pathway: AMYR/CTR agonism → Central satiety signaling → Reduced food intake, delayed gastric emptying, suppressed glucagon *(score=0.92)*
- **mechanism.downstream_effect**: Downstream effect: Central satiety induction, prandial glucagon suppression, reduced caloric intake, weight loss, improved glycemic control *(score=0.92)*
- **mechanism.origin**: Origin / discovery: Second-generation non-aggregating long-acting amylin analogue designed for once-weekly dosing *(score=0.92)*
- **mechanism.receptor_class**: Receptor class: Dual AMYR/CTR agonist — heterodimeric calcitonin receptor complex *(score=0.92)*
- **mechanism.half_life_basis**: Half-life basis: Extended half-life design enabling once-weekly subcutaneous administration *(score=0.88)*
- **dosage.rows[0].value**: Dosage value: Cagrilintide 2.4 mg + Semaglutide 2.4 mg (CagriSema) *(score=0.95)*
- **dosage.rows[2].value**: Dosage value: Once weekly (subcutaneous) *(score=0.92)*
- **dosage.rows[3].value**: Dosage value: Phase 3 RCT (REDEFINE 5), meta-analysis of 3 RCTs (n=3545) *(score=0.92)*
- **dosage.rows[4].value**: Dosage value: 26–52 weeks in trials *(score=0.92)*
- **dosage.rows[5].value**: Dosage value: Subcutaneous injection *(score=0.92)*
- **fat_loss.evidence_meta**: Fat-loss evidence summary: Phase 3 RCT (REDEFINE 5) · Meta-analysis of 3 RCTs (n=3545) · 26–52 weeks *(score=0.92)*
- **fat_loss.rows[0].value**: Fat-loss row value: 7.47% greater percentage weight loss *(score=0.95)*
- **fat_loss.rows[1].value**: Fat-loss row value: Significantly greater absolute weight reduction *(score=0.90)*
- **fat_loss.rows[2].value**: Fat-loss row value: Central satiety induction *(score=0.92)*
- **fat_loss.rows[3].value**: Fat-loss row value: Significant BMI reduction vs comparator *(score=0.92)*
- **fat_loss.rows[4].value**: Fat-loss row value: Reduced fasting glucose and HbA1c *(score=0.85)*
- **fat_loss.rows[5].value**: Fat-loss row value: Improvements in total cholesterol, LDL-C, HDL-C, VLDL-C, triglycerides *(score=0.85)*
- **fat_loss.rows[7].value**: Fat-loss row value: In vitro effects on skeletal muscle mitochondria under metabolic stress conditions *(score=0.92)*
- **fat_loss.rows[8].value**: Fat-loss row value: Multi-pathway approach: amylin (satiety) + GLP-1 (incretin) *(score=0.92)*
- **fat_loss.rows[9].value**: Fat-loss row value: REDEFINE 5 (Yamauchi 2026) · Ahmed meta-analysis 2026 · Bailey review 2026 *(score=0.92)*
- **side_effects.rows[0].value**: Side effect: Nausea, diarrhea (common with incretin-based therapies) *(score=0.92)*
- **administration.steps[0]**: Dosing frequency: Once-weekly subcutaneous injection. Long-acting formulation designed for weekly administration schedule. *(score=0.92)*
- **administration.steps[1]**: Combination form: Co-formulated with semaglutide as CagriSema for single weekly injection combining amylin and GLP-1 receptor agonism. *(score=0.95)*
- **administration.steps[4]**: Dietary considerations: Nutritional monitoring recommended during treatment. Dietary management strategies important for tolerability and outcomes. *(score=0.95)*
- **synergy.stacks[0]**: Stack with semaglutide: Cagrilintide (amylin receptor agonist) and semaglutide (GLP-1 receptor agonist) act on distinct receptor systems to produce synergistic weight loss through complementary mechanisms — central satiety via amylin pathways plus incretin-mediated glucose control and appetite suppression via GLP-1. Co-formulated as CagriSema, this combination demonstrates 7.5% greater weight loss versus semaglutide monotherapy in Phase 3 trials with additional benefits on glycemic control and lipid parameters. (primary benefit: Enhanced weight loss, improved glycemic control, multi-pathway metabolic modulation) *(score=0.92)*

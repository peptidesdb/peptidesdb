# Claim-link audit: survodutide

> Generated 2026-04-27 by `bun run audit:claims survodutide`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 41
- ✅ ok (score ≥ 0.85): 24
- ⚠️ partial (0.6–0.85): 6
- ❌ unsupported (< 0.6): 11
- — skipped (no PMIDs available): 0

## ❌ Unsupported (P0 — must fix or remove citation)

### hero_route

- **Claim**: Administration route: SQ · Once Weekly
- **Score**: 0.00
- **Citations**: yathindra-2026 (PMID 41855048)
- **Rationale**: The cited abstract is a general review of survodutide's pharmacology and efficacy but contains no specific information about administration route (SQ) or dosing frequency (once weekly). The abstract does not substantiate the claim.

### hero_stats[0]

- **Claim**: Frequency: Once weekly
- **Score**: 0.00
- **Citations**: yathindra-2026 (PMID 41855048)
- **Rationale**: The cited abstract is a general review of survodutide's pharmacology and efficacy but contains no information about dosing frequency or administration schedules. The claim 'Frequency: Once weekly' is not addressed in the provided abstract.

### mechanism.half_life_basis

- **Claim**: Half-life basis: Extended half-life design enables once-weekly dosing
- **Score**: 0.00
- **Citations**: yathindra-2026 (PMID 41855048)
- **Rationale**: The cited abstract discusses survodutide's mechanism of action (GLP-1 and glucagon receptor agonism) and clinical benefits but contains no information about half-life, pharmacokinetics, or dosing frequency. The claim about extended half-life enabling once-weekly dosing is not addressed in the provided abstract.

### mechanism.diagram[5].text

- **Claim**: Mechanism diagram step: ↓ Lipid metabolism, energy expenditure ↑
- **Score**: 0.00
- **Citations**: long-2026 (PMID 41388343)
- **Rationale**: The abstract is unavailable; only bibliographic metadata is provided. Without the actual abstract text, it is impossible to verify whether it substantively supports the claim about decreased lipid metabolism and increased energy expenditure.

### dosage.rows[0].value

- **Claim**: Dosage value: Not yet disclosed (Phase 3 ongoing)
- **Score**: 0.00
- **Citations**: rubino-2026 (PMID 41704810)
- **Rationale**: The cited abstract discusses clinical trial simulation and design optimization for the SYNCHRONIZE phase 3 program but contains no information about survodutide dosage values. The claim about dosage disclosure cannot be evaluated from this abstract.

### dosage.rows[1].value

- **Claim**: Dosage value: Once weekly
- **Score**: 0.00
- **Citations**: yathindra-2026 (PMID 41855048)
- **Rationale**: The abstract is a general review of survodutide's pharmacology, efficacy, and safety but contains no specific dosage information or mention of a once-weekly dosing regimen.

### dosage.rows[3].value

- **Claim**: Dosage value: Phase 2 RCT (obesity) · Phase 3 ongoing
- **Score**: 0.35
- **Citations**: yathindra-2026 (PMID 41855048), rubino-2026 (PMID 41704810)
- **Rationale**: The cited abstracts mention Phase 3 SYNCHRONIZE trials ongoing for survodutide in obesity (Abstract 2), but neither abstract provides specific dosage values or details about Phase 2 RCT dosing. Abstract 1 is a general review mentioning 'early clinical trials' without dosage specifics. The claim's specific assertion about 'Dosage value' data is not substantiated by these abstracts.

### fat_loss.rows[0].value

- **Claim**: Fat-loss row value: Total body weight, visceral adipose tissue
- **Score**: 0.45
- **Citations**: yathindra-2026 (PMID 41855048)
- **Rationale**: The abstract discusses survodutide's effects on weight loss and metabolic markers in obesity treatment, but does not specifically address total body weight or visceral adipose tissue as measured outcomes. The claim appears to reference specific fat-loss measurement parameters that are not substantively detailed in this review abstract.

### side_effects.rows[2].value

- **Claim**: Side effect: Monitored in Phase 2/3; no unique safety signals reported
- **Score**: 0.45
- **Citations**: andonie-2026 (PMID 41466530)
- **Rationale**: The abstract discusses safety monitoring and outcomes (diarrhea, fatigue, nausea, serious adverse events) in Phase 2/3 trials, but does not specifically state that monitoring occurred in Phase 2/3 or that 'no unique safety signals' were reported. The abstract notes resmetirom had a 'more favourable safety profile' but lacks explicit confirmation of the claim's specific framing.

### side_effects.rows[4].value

- **Claim**: Side effect: Potential for tachycardia, increased blood pressure — theoretical glucagon effect
- **Score**: 0.45
- **Citations**: elmendorf-2026 (PMID 41478576)
- **Rationale**: The abstract discusses glucagon receptor agonism for obesity and diabetes treatment but does not substantively address cardiovascular side effects like tachycardia or increased blood pressure. While the abstract mentions that mechanistic data is limited and preclinical, it focuses on weight loss and energy expenditure mechanisms rather than adverse cardiovascular effects.

### administration.steps[2]

- **Claim**: Timing: Once weekly, same day each week. Can be administered at any time of day, with or without meals.
- **Score**: 0.00
- **Citations**: yathindra-2026 (PMID 41855048)
- **Rationale**: The cited abstract provides general information about survodutide's mechanism and clinical benefits, but contains no information about dosing schedule, timing, frequency, meal requirements, or time-of-day administration. The claim is not addressed in the abstract.

## ⚠️ Partial (P1 — human review)

### fat_loss.evidence_meta

- **Claim**: Fat-loss evidence summary: Phase 2 RCT in obesity · Phase 3 SYNCHRONIZE program ongoing
- **Score**: 0.75
- **Citations**: yathindra-2026 (PMID 41855048), rubino-2026 (PMID 41704810)
- **Rationale**: Abstract [2] directly confirms the SYNCHRONIZE phase 3 program is ongoing for survodutide in obesity. However, abstract [1] is a general review of survodutide that mentions 'early clinical trials' showing weight loss but does not specifically document a Phase 2 RCT in obesity as claimed. The claim's Phase 2 component is not substantively supported by the provided abstracts.

### fat_loss.rows[8].value

- **Claim**: Fat-loss row value: Network meta-analysis shows competitive efficacy in GRA class
- **Score**: 0.75
- **Citations**: abulehia-2026 (PMID 41787737)
- **Rationale**: Abstract [1] is a network meta-analysis of GRA (glucagon receptor agonist) class agents showing comparative efficacy data on weight/fat loss outcomes. However, the claim's phrasing 'Fat-loss row value' is vague/technical jargon not explicitly addressed in the abstract, which instead reports specific weight reduction metrics (kg and percent changes) across different GRA agents rather than a singular 'row value.'

### side_effects.rows[0].value

- **Claim**: Side effect: Diarrhea, nausea, fatigue — class effect of GLP-1 agonists
- **Score**: 0.72
- **Citations**: abulehia-2026 (PMID 41787737), andonie-2026 (PMID 41466530)
- **Rationale**: Paper [2] explicitly lists diarrhea, fatigue, and nausea as safety outcomes assessed for GRAs and notes that 'resmetirom showed a more favourable safety profile,' implying GRAs have these adverse effects. However, the abstract does not explicitly state the frequency, magnitude, or confirm these are class effects across all GLP-1 agonists—it only mentions them as outcomes studied in GRA trials.

### side_effects.rows[1].value

- **Claim**: Side effect: Network meta-analysis: comparable safety to other GRAs
- **Score**: 0.75
- **Citations**: abulehia-2026 (PMID 41787737)
- **Rationale**: Abstract [1] is a network meta-analysis of GRAs that directly addresses safety comparisons across agents (retatrutide, survodutide, mazdutide, cotadutide). It reports that mazdutide had the most favorable tolerability while retatrutide and cotadutide had comparatively lower tolerability, supporting the claim of comparable safety profiles between GRAs, though with some differentiation in tolerability rather than equivalence.

### synergy.stacks[0]

- **Claim**: Stack with resmetirom: Survodutide (GLP-1/glucagon dual agonist) and resmetirom (thyroid hormone receptor-β agonist) target complementary metabolic pathways in MASH treatment. Survodutide addresses weight loss and glucose metabolism via incretin and glucagon pathways, while resmetirom directly targets hepatic lipid metabolism via THR-β, reducing hepatic fat and improving fibrosis markers. Network meta-analysis demonstrates both agents reduce ALT/AST and MRI-PDFF through distinct mechanisms, suggesting potential for additive benefit in MASLD/MASH management. (primary benefit: Multi-pathway MASH resolution, hepatic fat reduction, metabolic improvement)
- **Score**: 0.72
- **Citations**: andonie-2026 (PMID 41466530), patil-2026 (PMID 41831171)
- **Rationale**: Abstract [1] provides a network meta-analysis directly comparing GRAs (including survodutide) and resmetirom, showing that GRAs reduce ALT and MRI-PDFF while resmetirom reduces AST and improves MASH resolution without worsening fibrosis, supporting the claim of distinct mechanisms and complementary effects. However, the abstract does not explicitly detail the specific mechanistic pathways (incretin/glucagon vs. THR-β) or explicitly claim additive benefit from combination therapy, only that the agents have different efficacy profiles.

### synergy.stacks[1]

- **Claim**: Stack with metformin: Survodutide improves glucose homeostasis via GLP-1 receptor agonism and increases energy expenditure via glucagon receptor activation. Metformin complements this through AMP-kinase activation, reducing hepatic gluconeogenesis and improving insulin sensitivity. The combination may address both weight loss and glycemic control in patients with type 2 diabetes and obesity, targeting overlapping metabolic dysfunction through distinct molecular pathways. (primary benefit: Enhanced glycemic control, weight loss, reduced hepatic glucose output)
- **Score**: 0.72
- **Citations**: yathindra-2026 (PMID 41855048), elmendorf-2026 (PMID 41478576)
- **Rationale**: Abstracts [1] and [2] substantively support survodutide's dual mechanism (GLP-1 and glucagon receptor agonism) and its effects on glucose metabolism, energy expenditure, and weight loss. However, neither abstract addresses metformin's role, AMP-kinase activation, hepatic gluconeogenesis reduction, or the specific synergistic effects of the combination—limiting support for the complete claim about the stack.

## ✅ OK (collapsed for brevity)

- **summary**: Summary: Dual GLP-1/glucagon receptor agonist developed by Boehringer Ingelheim and Zealand Pharma, currently in Phase 3 trials (SYNCHRONIZE program) for obesity and metabolic dysfunction-associated steatohepatitis (MASH). Phase 2 data demonstrated significant weight loss through reduced energy intake and increased energy expenditure. Acts centrally via circumventricular organs and peripherally on hepatic and pancreatic receptors. Once-weekly subcutaneous administration. *(score=0.92)*
- **hero_stats[1]**: Development stage: Phase 3 *(score=0.95)*
- **hero_stats[2]**: Dual target: GLP-1/GCGR *(score=0.95)*
- **mechanism.primary_target**: Primary target: GLP-1 receptor and glucagon receptor (GCGR) *(score=0.95)*
- **mechanism.pathway**: Pathway: Central: CVOs → hypothalamic appetite regulation. Peripheral: GLP-1R → incretin effect; GCGR → hepatic lipid metabolism, energy expenditure *(score=0.92)*
- **mechanism.downstream_effect**: Downstream effect: Decreased energy intake, increased energy expenditure, improved glucose homeostasis, hepatic fat reduction *(score=0.92)*
- **mechanism.receptor_class**: Receptor class: Class B G-protein-coupled receptors (GPCRs) *(score=0.92)*
- **mechanism.diagram[0].text**: Mechanism diagram step: Circumventricular Organs (CVOs) *(score=0.92)*
- **mechanism.diagram[1].text**: Mechanism diagram step: ↓ GLP-1R activation → appetite suppression *(score=0.92)*
- **mechanism.diagram[2].text**: Mechanism diagram step: Hypothalamic appetite centers *(score=0.92)*
- **mechanism.diagram[3].text**: Mechanism diagram step: ↓ Reduced energy intake *(score=0.92)*
- **mechanism.diagram[4].text**: Mechanism diagram step: Liver (Hepatic GCGR) *(score=0.90)*
- **mechanism.diagram[6].text**: Mechanism diagram step: Weight loss + metabolic improvement *(score=0.92)*
- **dosage.rows[2].value**: Dosage value: Subcutaneous *(score=0.85)*
- **dosage.rows[4].value**: Dosage value: Significant weight loss and metabolic marker improvement *(score=0.92)*
- **dosage.rows[5].value**: Dosage value: Under investigation for MASH-cirrhosis *(score=0.88)*
- **dosage.rows[0].notes**: Dosage notes: SYNCHRONIZE Phase 3 program underway. *(score=0.95)*
- **fat_loss.rows[1].value**: Fat-loss row value: Dual action: decreased energy intake + increased energy expenditure *(score=0.95)*
- **fat_loss.rows[2].value**: Fat-loss row value: Significant weight loss demonstrated *(score=0.85)*
- **fat_loss.rows[3].value**: Fat-loss row value: Improvements in ALT, AST, LDL levels; significant ALT reduction (MD -22.10 vs placebo) *(score=0.92)*
- **fat_loss.rows[4].value**: Fat-loss row value: Hepatic fat reduction demonstrated in MASH trials *(score=0.92)*
- **fat_loss.rows[5].value**: Fat-loss row value: Favorable efficacy profile vs other glucagon receptor agonists *(score=0.92)*
- **fat_loss.rows[6].value**: Fat-loss row value: Hepatic GCGR required for maximal weight loss and metabolic effects *(score=0.95)*
- **fat_loss.rows[7].value**: Fat-loss row value: Increased energy expenditure contributes to weight loss *(score=0.92)*

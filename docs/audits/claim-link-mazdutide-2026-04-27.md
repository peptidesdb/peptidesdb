# Claim-link audit: mazdutide

> Generated 2026-04-27 by `bun run audit:claims mazdutide`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 58
- ✅ ok (score ≥ 0.85): 18
- ⚠️ partial (0.6–0.85): 7
- ❌ unsupported (< 0.6): 33
- — skipped (no PMIDs available): 0

## ❌ Unsupported (P0 — must fix or remove citation)

### hero_stats[0]

- **Claim**: Weekly dose: 6 or 9 mg
- **Score**: 0.50
- **Citations**: ji-2026 (PMID 41875890)
- **Rationale**: The abstract mentions mazdutide 9 mg and notes that prior studies tested 4 and 6 mg doses, but does not explicitly state that the weekly dosing regimen consists of 6 or 9 mg doses. The claim requires confirmation that both 6 mg and 9 mg are standard weekly doses, which this abstract does not fully establish.

### mechanism.antibody_development

- **Claim**: Antibody development: Low immunogenicity reported in clinical trials; anti-drug antibodies monitored
- **Score**: 0.00
- **Citations**: ji-2026 (PMID 41875890)
- **Rationale**: The abstract describes a phase 2 trial of mazdutide focusing on weight loss and safety (nausea, diarrhea, vomiting), but contains no information about antibody development, immunogenicity, or anti-drug antibody monitoring.

### dosage.rows[0].value

- **Claim**: Dosage value: 3, 6, or 9 mg once weekly
- **Score**: 0.45
- **Citations**: ji-2026 (PMID 41875890), azam-2026 (PMID 41804840)
- **Rationale**: Abstract [1] explicitly mentions mazdutide 9 mg and 6 mg dosages, but only 9 mg is studied in that trial. Abstract [2] is a meta-analysis that discusses mazdutide efficacy generally and mentions dose-wise effects but does not specify the exact dosages of 3, 6, or 9 mg once weekly. Neither abstract directly supports the complete claim of all three dosage values (3, 6, or 9 mg) being used in once-weekly dosing schedules.

### dosage.rows[1].value

- **Claim**: Dosage value: 3 mg once weekly
- **Score**: 0.00
- **Citations**: ji-2026 (PMID 41875890)
- **Rationale**: The cited abstract discusses mazdutide 9 mg administered once weekly, not 3 mg. The claim specifies a 3 mg dosage, which is not mentioned in the provided abstract.

### dosage.rows[3].value

- **Claim**: Dosage value: Subcutaneous (abdomen or thigh)
- **Score**: 0.00
- **Citations**: ji-2026 (PMID 41875890)
- **Rationale**: The abstract describes a clinical trial of mazdutide 9 mg but does not mention the route of administration, dosage schedule, or specific injection sites (abdomen or thigh). The claim about subcutaneous dosage location is not addressed in the provided abstract.

### dosage.rows[6].value

- **Claim**: Dosage value: Phase 3 RCT
- **Score**: 0.15
- **Citations**: ji-2026 (PMID 41875890), azam-2026 (PMID 41804840)
- **Rationale**: The claim states 'Dosage value: Phase 3 RCT' but the cited papers only describe phase 2 trials. Paper [1] explicitly states it is 'a phase 2 randomized controlled trial,' and paper [2] is a meta-analysis of RCTs that includes phase 2 studies. Neither abstract mentions or supports a phase 3 trial.

### dosage.rows[2].notes

- **Claim**: Dosage notes: Dose-dependent efficacy observed.
- **Score**: 0.00
- **Citations**: azam-2026 (PMID 41804840)
- **Rationale**: API error: 429 {"type":"error","error":{"type":"rate_limit_error","message":"This request would exceed your organization's rate limit of 50,000 input tokens per minute (org: a53d8326-ba28-460d-aff5-a3963cf7388d, model: claude-haiku-4-5-20251001). For details, refer to: https://docs.claude.com/en/api/rate-limits. You can see the response headers for current usage. Please reduce the prompt length or the maximum tokens requested, or try again later. You may also contact sales at https://claude.com/contact-sales to discuss your options for a rate limit increase."},"request_id":"req_011CaTfpb6hmvUY1Y43ZDfGM"}

### fat_loss.rows[0].value

- **Claim**: Fat-loss row value: 12.42% mean body weight reduction vs placebo
- **Score**: 0.00
- **Citations**: azam-2026 (PMID 41804840)
- **Rationale**: API error: 429 {"type":"error","error":{"type":"rate_limit_error","message":"This request would exceed your organization's rate limit of 50,000 input tokens per minute (org: a53d8326-ba28-460d-aff5-a3963cf7388d, model: claude-haiku-4-5-20251001). For details, refer to: https://docs.claude.com/en/api/rate-limits. You can see the response headers for current usage. Please reduce the prompt length or the maximum tokens requested, or try again later. You may also contact sales at https://claude.com/contact-sales to discuss your options for a rate limit increase."},"request_id":"req_011CaTfpxw7PgiF5MkZETtJJ"}

### fat_loss.rows[2].value

- **Claim**: Fat-loss row value: 9 mg superior to 6 mg and 3 mg doses
- **Score**: 0.15
- **Citations**: ji-2026 (PMID 41875890)
- **Rationale**: The cited abstract only evaluates mazdutide 9 mg versus placebo in a single-arm comparison. It does not contain any direct comparison between 9 mg, 6 mg, and 3 mg doses that would substantiate the claim that 9 mg is superior to the other two doses. The background mentions prior 4 mg and 6 mg data, but no head-to-head dose-comparison data are presented in this abstract.

### fat_loss.rows[3].value

- **Claim**: Fat-loss row value: Significant VAT reduction observed
- **Score**: 0.00
- **Citations**: azam-2026 (PMID 41804840)
- **Rationale**: The cited abstract reports significant reductions in body weight, waist circumference, and blood pressure with mazdutide, but does not mention visceral adipose tissue (VAT) reduction specifically. The claim requires evidence of VAT reduction, which is not addressed in this abstract.

### fat_loss.rows[7].value

- **Claim**: Fat-loss row value: Modest reduction in serum uric acid
- **Score**: 0.15
- **Citations**: li-2025 (PMID 41488145)
- **Rationale**: The cited abstract is a review of hyperuricemia treatment strategies covering pharmaceutical and non-pharmaceutical interventions, but does not specifically address fat loss or weight loss interventions, nor does it quantify serum uric acid reduction as 'modest.' The abstract does not substantively support the claim about fat-loss and serum uric acid reduction.

### fat_loss.rows[8].value

- **Claim**: Fat-loss row value: 24 weeks
- **Score**: 0.00
- **Citations**: azam-2026 (PMID 41804840)
- **Rationale**: The claim 'Fat-loss row value: 24 weeks' is unintelligible and does not correspond to any standard medical or research terminology. The cited abstract discusses mazdutide's efficacy for weight loss but contains no mention of '24 weeks' or 'row value,' making the claim impossible to verify against the provided abstract.

### fat_loss.rows[9].value

- **Claim**: Fat-loss row value: Superior weight loss vs GLP-1R agonists alone in network meta-analysis
- **Score**: 0.00
- **Citations**: abulehia-2026 (PMID 41787737)
- **Rationale**: The cited abstract discusses glucagon receptor agonists (GRAs) versus placebo, not GLP-1R agonists. The claim requires a comparison between 'fat-loss row' (undefined term, possibly a specific intervention) and GLP-1R agonists alone, but the abstract makes no such comparison and focuses entirely on GRA efficacy.

### fat_loss.rows[2].notes

- **Claim**: Fat-loss row notes: Higher doses associated with greater weight loss and metabolic benefit.
- **Score**: 0.00
- **Citations**: azam-2026 (PMID 41804840)
- **Rationale**: API error: 429 {"type":"error","error":{"type":"rate_limit_error","message":"This request would exceed your organization's rate limit of 50,000 input tokens per minute (org: a53d8326-ba28-460d-aff5-a3963cf7388d, model: claude-haiku-4-5-20251001). For details, refer to: https://docs.claude.com/en/api/rate-limits. You can see the response headers for current usage. Please reduce the prompt length or the maximum tokens requested, or try again later. You may also contact sales at https://claude.com/contact-sales to discuss your options for a rate limit increase."},"request_id":"req_011CaTfqshs6CdAZibHVov3m"}

### fat_loss.rows[7].notes

- **Claim**: Fat-loss row notes: Emerging indication for hyperuricemia management.
- **Score**: 0.00
- **Citations**: li-2025 (PMID 41488145)
- **Rationale**: The claim references 'Fat-loss row' which does not appear in the cited abstract, and the abstract makes no mention of any intervention called 'Fat-loss row' for hyperuricemia management. The abstract discusses established and emerging therapies (SGLT2 inhibitors, GLP-1/GCG agonists, probiotics, WMT, etc.) but does not support the specific claim about 'Fat-loss row.'

### side_effects.rows[2].value

- **Claim**: Side effect: Mild erythema, pruritus, induration
- **Score**: 0.00
- **Citations**: ji-2026 (PMID 41875890)
- **Rationale**: The abstract reports common adverse events (nausea, diarrhea, vomiting) but does not mention erythema, pruritus, or induration. The claimed side effects are not substantiated by the cited abstract.

### side_effects.rows[3].value

- **Claim**: Side effect: Rare in non-diabetic populations; monitor if on other glucose-lowering agents
- **Score**: 0.35
- **Citations**: azam-2026 (PMID 41804840)
- **Rationale**: The abstract mentions that adverse events were 'slightly increased' in non-diabetic populations (RR = 1.12) but provides no specific information about which side effects are rare, their frequency in non-diabetic versus diabetic populations, or monitoring recommendations when combined with other glucose-lowering agents.

### side_effects.rows[4].value

- **Claim**: Side effect: Increased heart rate reported in some trials; requires monitoring
- **Score**: 0.45
- **Citations**: azam-2026 (PMID 41804840)
- **Rationale**: Abstract [1] reports that mazdutide caused slightly increased adverse events overall (RR=1.12) but does not specifically identify increased heart rate as a side effect or mention cardiac monitoring requirements.

### side_effects.rows[5].value

- **Claim**: Side effect: Transient ALT/AST elevation in small subset; generally reversible
- **Score**: 0.00
- **Citations**: ji-2026 (PMID 41875890)
- **Rationale**: The abstract does not mention ALT/AST elevation or liver enzyme changes of any kind. The adverse events section lists nausea, diarrhea, and vomiting but contains no data supporting the claim about transient ALT/AST elevation.

### side_effects.rows[6].value

- **Claim**: Side effect: Theoretical class effect; rare in trials
- **Score**: 0.15
- **Citations**: lempesis-2026 (PMID 41948476)
- **Rationale**: The abstract is a general review of obesity pharmacotherapy and multi-receptor agonists but does not address side effects, theoretical class effects, or trial safety data. The claim about side effect rarity is entirely unsupported by this abstract.

### side_effects.rows[7].value

- **Claim**: Side effect: Increased risk with rapid weight loss; monitor symptoms
- **Score**: 0.15
- **Citations**: lempesis-2026 (PMID 41948476)
- **Rationale**: The cited abstract discusses obesity pharmacotherapy and weight loss medications but does not address rapid weight loss as a side effect or mention monitoring symptoms for increased risk. The abstract focuses on drug efficacy and mechanisms rather than adverse effects associated with rapid weight loss.

### side_effects.rows[8].value

- **Claim**: Side effect: Preclinical rodent finding (GLP-1R class); human relevance unclear, contraindicated in medullary thyroid carcinoma history
- **Score**: 0.00
- **Citations**: lempesis-2026 (PMID 41948476)
- **Rationale**: API error: 429 {"type":"error","error":{"type":"rate_limit_error","message":"This request would exceed your organization's rate limit of 50,000 input tokens per minute (org: a53d8326-ba28-460d-aff5-a3963cf7388d, model: claude-haiku-4-5-20251001). For details, refer to: https://docs.claude.com/en/api/rate-limits. You can see the response headers for current usage. Please reduce the prompt length or the maximum tokens requested, or try again later. You may also contact sales at https://claude.com/contact-sales to discuss your options for a rate limit increase."},"request_id":"req_011CaTfrz9bAbixwZVyF7HwV"}

### side_effects.rows[9].value

- **Claim**: Side effect: Low anti-drug antibody formation; clinically non-significant in most
- **Score**: 0.00
- **Citations**: ji-2026 (PMID 41875890)
- **Rationale**: The abstract does not discuss anti-drug antibody formation at all. It focuses on weight loss efficacy and common gastrointestinal adverse events (nausea, diarrhea, vomiting) but contains no information about immunogenicity or antibody responses to mazdutide.

### side_effects.contraindications_absolute[0]

- **Claim**: Absolute contraindication: Personal or family history of medullary thyroid carcinoma
- **Score**: 0.00
- **Citations**: lempesis-2026 (PMID 41948476)
- **Rationale**: The cited abstract discusses obesity pharmacotherapy and GLP-1 receptor agonists but does not address medullary thyroid carcinoma contraindications or safety concerns related to personal/family history of MTC. The abstract is entirely off-topic to the claim being verified.

### side_effects.contraindications_absolute[1]

- **Claim**: Absolute contraindication: Multiple endocrine neoplasia syndrome type 2 (MEN 2)
- **Score**: 0.00
- **Citations**: lempesis-2026 (PMID 41948476)
- **Rationale**: The cited abstract discusses obesity pharmacotherapy and various GLP-1 agonists and multi-receptor agonists, but contains no mention of MEN 2, contraindications, or any discussion of conditions for which these drugs are contraindicated. The abstract does not support the claim about MEN 2 being an absolute contraindication.

### side_effects.contraindications_absolute[2]

- **Claim**: Absolute contraindication: Hypersensitivity to mazdutide or excipients
- **Score**: 0.00
- **Citations**: ji-2026 (PMID 41875890)
- **Rationale**: The cited abstract describes efficacy and safety findings from a phase 2 trial but does not address contraindications, hypersensitivity reactions, or excipient-related adverse effects. The safety data presented focus on common GI side effects (nausea, diarrhea, vomiting) rather than contraindications.

### side_effects.contraindications_relative[0]

- **Claim**: Relative contraindication: History of pancreatitis
- **Score**: 0.00
- **Citations**: lempesis-2026 (PMID 41948476)
- **Rationale**: The cited abstract discusses obesity pharmacotherapy and various GLP-1 receptor agonists and multi-receptor agonists, but does not address pancreatitis, contraindications, or relative contraindications to any treatment. The claim about history of pancreatitis is entirely unrelated to the content of this abstract.

### administration.steps[0]

- **Claim**: Preparation: Pre-filled pen or vial format. If lyophilized, reconstitute per manufacturer protocol with supplied diluent. Inspect for particulates; solution should be clear or slightly opalescent.
- **Score**: 0.00
- **Citations**: ji-2026 (PMID 41875890)
- **Rationale**: API error: 429 {"type":"error","error":{"type":"rate_limit_error","message":"This request would exceed your organization's rate limit of 50,000 input tokens per minute (org: a53d8326-ba28-460d-aff5-a3963cf7388d, model: claude-haiku-4-5-20251001). For details, refer to: https://docs.claude.com/en/api/rate-limits. You can see the response headers for current usage. Please reduce the prompt length or the maximum tokens requested, or try again later. You may also contact sales at https://claude.com/contact-sales to discuss your options for a rate limit increase."},"request_id":"req_011CaTfsZW3SEinPgJwjtaMG"}

### administration.steps[1]

- **Claim**: Injection site: Subcutaneous — abdomen (avoid 5 cm around navel) or anterior thigh. Rotate injection sites weekly to minimize lipodystrophy.
- **Score**: 0.00
- **Citations**: ji-2026 (PMID 41875890)
- **Rationale**: The cited abstract is a clinical trial on mazdutide efficacy and safety in Chinese adults with obesity. It contains no information about injection site locations, anatomical guidance (abdomen, thigh, navel avoidance), or rotation schedules for minimizing lipodystrophy.

### administration.steps[2]

- **Claim**: Timing: Once weekly, same day each week. Can be administered with or without meals. Administer at consistent time for adherence.
- **Score**: 0.00
- **Citations**: ji-2026 (PMID 41875890)
- **Rationale**: API error: 429 {"type":"error","error":{"type":"rate_limit_error","message":"This request would exceed your organization's rate limit of 50 requests per minute (org: a53d8326-ba28-460d-aff5-a3963cf7388d, model: claude-haiku-4-5-20251001). For details, refer to: https://docs.claude.com/en/api/rate-limits. You can see the response headers for current usage. Please reduce the prompt length or the maximum tokens requested, or try again later. You may also contact sales at https://claude.com/contact-sales to discuss your options for a rate limit increase."},"request_id":"req_011CaTfskf1PBibpW5A33z97"}

### administration.steps[3]

- **Claim**: Dose escalation: Start at 3 mg weekly. If tolerated, escalate to 6 mg after 4 weeks, then to 9 mg after another 4 weeks as indicated. Titration reduces GI side effects.
- **Score**: 0.00
- **Citations**: ji-2026 (PMID 41875890)
- **Rationale**: The cited abstract describes a phase 2 trial comparing mazdutide 9 mg to placebo over 24 weeks, but does not discuss dose escalation protocols, titration schedules (3 mg → 6 mg → 9 mg), or the relationship between titration and GI side effect reduction. The abstract only reports adverse events at the 9 mg dose without addressing dose escalation strategies.

### synergy.stacks[1]

- **Claim**: Stack with metformin: Metformin's AMPK activation and hepatic glucose output suppression complement mazdutide's dual incretin/glucagon pathway effects. Mazdutide enhances insulin secretion and energy expenditure, while metformin improves peripheral insulin sensitivity and reduces hepatic gluconeogenesis. Combination may improve glycemic control in type 2 diabetes with additive weight loss and metabolic benefit. Monitor for GI intolerance with both agents. (primary benefit: Enhanced glycemic control, hepatic insulin sensitivity, weight loss)
- **Score**: 0.15
- **Citations**: chen-2026 (PMID 41710707)
- **Rationale**: The cited abstract is a comparative evaluation of GLP-1RAs that mentions mazdutide only briefly in the context of cost and insufficient evidence, with no discussion of metformin combinations, AMPK activation, hepatic glucose suppression, or specific mechanistic synergies claimed. The abstract does not support the detailed pharmacological claims or combination therapy benefits described in the claim.

### synergy.stacks[2]

- **Claim**: Stack with sglt2-inhibitors: SGLT2 inhibitors (e.g., empagliflozin, dapagliflozin) promote urinary glucose excretion and natriuresis, complementing mazdutide's insulin secretion and appetite suppression. Combination provides multi-pathway glycemic control, additional weight loss, and potential cardiovascular and renal protection. Monitor for volume depletion and ketoacidosis risk (rare with GLP-1 co-therapy). Emerging combination in T2D management. (primary benefit: Maximal weight loss, glycemic control, cardio-renal protection)
- **Score**: 0.15
- **Citations**: chen-2026 (PMID 41710707)
- **Rationale**: The cited abstract evaluates GLP-1 receptor agonists including mazdutide but does not address SGLT2 inhibitors, their mechanisms, combination therapy with GLP-1 agents, or the specific clinical benefits claimed (multi-pathway glycemic control, volume depletion, ketoacidosis risk). The abstract actually notes mazdutide is 'Not Recommended' due to insufficient evidence, contradicting the claim's framing as an emerging beneficial combination.

## ⚠️ Partial (P1 — human review)

### mechanism.pathway

- **Claim**: Pathway: GLP-1R activation → insulin secretion, gastric emptying delay, appetite suppression; GCGR activation → hepatic glucose output modulation, energy expenditure, lipolysis
- **Score**: 0.78
- **Citations**: elmendorf-2026 (PMID 41478576), gan-2026 (PMID 41901218)
- **Rationale**: Abstract [1] directly supports GLP-1R effects (insulin secretion, appetite suppression) and GCGR effects (energy expenditure, lipolysis via weight loss mechanisms) as core themes of the review. However, the abstract does not explicitly mention 'gastric emptying delay' for GLP-1R or 'hepatic glucose output modulation' for GCGR, though these are plausible mechanisms discussed in incretin-based therapeutics literature. Abstract [2] focuses on mazdutide's hepatic effects but doesn't substantively address the broader pathway claims.

### mechanism.half_life_basis

- **Claim**: Half-life basis: Extended half-life via peptide engineering and formulation, enabling once-weekly dosing
- **Score**: 0.72
- **Citations**: abdul-2026 (PMID 41820018)
- **Rationale**: Abstract [1] mentions 'formulation technologies' and 'formulation stability' as part of mazdutide's patent landscape, and references 'dosing regimens' as a covered patent area, but does not explicitly state that extended half-life was achieved through peptide engineering or that this enables once-weekly dosing. The claim is partially relevant to the abstract's scope but not substantively supported by the specific details provided.

### dosage.rows[2].value

- **Claim**: Dosage value: 6 or 9 mg once weekly
- **Score**: 0.65
- **Citations**: ji-2026 (PMID 41875890)
- **Rationale**: The abstract supports mazdutide 9 mg once weekly but does not mention 6 mg dosage in the trial itself—it only references prior studies using 4 and 6 mg in the background. The claim lists both 6 and 9 mg as dosage values, but only 9 mg is directly evaluated in this phase 2 trial.

### dosage.rows[5].value

- **Claim**: Dosage value: 24–48 weeks
- **Score**: 0.75
- **Citations**: azam-2026 (PMID 41804840), ji-2026 (PMID 41875890)
- **Rationale**: PMID 41875890 directly mentions a 24-week treatment duration, supporting the lower end of the 24–48 week range. However, neither abstract explicitly addresses the upper limit of 48 weeks, making the claim only partially supported by the cited literature.

### side_effects.rows[0].value

- **Claim**: Side effect: Most common AE; dose-dependent, transient
- **Score**: 0.72
- **Citations**: azam-2026 (PMID 41804840), ji-2026 (PMID 41875890)
- **Rationale**: Abstract [2] identifies nausea, diarrhea, and vomiting as the most common adverse events and describes them as predominantly mild to moderate in severity, supporting the 'transient' aspect. Abstract [1] mentions dose-dependent effects via meta-regression (β = -0.99, p = 0.0187) but does not specify which adverse event is most common or confirm dose-dependency of the most frequent AE. The claim is partially but not fully substantiated across both abstracts.

### side_effects.rows[1].value

- **Claim**: Side effect: Common; typically mild to moderate, resolves with continued use
- **Score**: 0.75
- **Citations**: azam-2026 (PMID 41804840)
- **Rationale**: Abstract [1] states mazdutide 'may cause mild to moderate adverse events' with slightly increased adverse event risk (RR = 1.12), partially supporting the claim about mild-to-moderate side effects. However, the abstract does not explicitly address whether these are 'common' or whether they 'resolve with continued use,' leaving the claim incompletely substantiated.

### synergy.stacks[0]

- **Claim**: Stack with tirzepatide: Both are dual/triple incretin agonists targeting overlapping pathways (GLP-1/GIP for tirzepatide, GLP-1/glucagon for mazdutide). While not typically combined due to redundancy and increased adverse event risk, sequential use or alternating protocols in research settings may explore differential receptor activation profiles. Mazdutide's glucagon component may offer hepatic and energy expenditure advantages, while tirzepatide's GIP agonism enhances insulin sensitivity. Combination not recommended in clinical practice without clear evidence. (primary benefit: Theoretical maximal incretin axis engagement; requires evidence)
- **Score**: 0.72
- **Citations**: abulehia-2026 (PMID 41787737), chan-2026 (PMID 41711462)
- **Rationale**: Paper [2] directly supports that tirzepatide and mazdutide are dual/triple incretin agonists with enhanced weight loss through multi-receptor agonism, and confirms increased adverse event risk (GI AEs, withdrawal, hypoglycemia). However, neither abstract discusses the specific receptor targets (GLP-1/GIP for tirzepatide, GLP-1/glucagon for mazdutide), differential advantages, sequential/alternating protocols, or the claim that combination is not recommended—these mechanistic and clinical practice details are not substantively addressed by the provided abstracts.

## ✅ OK (collapsed for brevity)

- **summary**: Summary: Oxyntomodulin-based dual GLP-1/glucagon receptor agonist developed by Innovent Biologics in collaboration with Eli Lilly. Phase 3 trials in China for obesity and type 2 diabetes demonstrate 12–15% body weight reduction over 24 weeks with once-weekly subcutaneous administration. Dual receptor engagement combines GLP-1-mediated satiety and insulin secretion with glucagon-driven energy expenditure and hepatic lipid metabolism. *(score=0.92)*
- **hero_route**: Administration route: SQ · Abdomen/Thigh · Once Weekly *(score=0.85)*
- **hero_stats[1]**: Body weight loss: 12.4% *(score=0.95)*
- **hero_stats[2]**: Dosing frequency: Once weekly *(score=0.95)*
- **mechanism.primary_target**: Primary target: GLP-1 receptor and glucagon receptor *(score=0.95)*
- **mechanism.downstream_effect**: Downstream effect: Weight reduction, improved glycemic control, reduced hepatic steatosis, decreased visceral adiposity, lowered serum lipids and uric acid *(score=0.92)*
- **mechanism.origin**: Origin / discovery: Synthetic oxyntomodulin analog with balanced GLP-1R/GCGR dual agonism *(score=0.92)*
- **mechanism.receptor_class**: Receptor class: Class B G-protein-coupled receptors (GLP-1R, GCGR) *(score=0.85)*
- **dosage.rows[4].value**: Dosage value: Once weekly *(score=0.95)*
- **dosage.rows[7].value**: Dosage value: 100, 200, 400 μg/kg SC (murine) *(score=0.95)*
- **dosage.rows[0].notes**: Dosage notes: 9 mg demonstrated superior weight loss in phase 2 trials. *(score=0.92)*
- **dosage.rows[7].notes**: Dosage notes: Dose-dependent hepatic lipid and inflammation reduction. *(score=0.88)*
- **fat_loss.evidence_meta**: Fat-loss evidence summary: Meta-analysis of 5 RCTs · Phase 2/3 · 24–48 weeks · Non-diabetic adults with obesity (BMI ≥28 kg/m²) *(score=0.92)*
- **fat_loss.rows[1].value**: Fat-loss row value: 9.76 kg mean reduction (95% CI: -13.15 to -6.37 kg) *(score=0.95)*
- **fat_loss.rows[4].value**: Fat-loss row value: Significant reduction vs placebo *(score=0.92)*
- **fat_loss.rows[5].value**: Fat-loss row value: Improved triglycerides and cholesterol *(score=0.92)*
- **fat_loss.rows[6].value**: Fat-loss row value: Reduced liver lipid content, improved hepatic inflammation and ER stress *(score=0.92)*
- **fat_loss.rows[6].notes**: Fat-loss row notes: Preclinical MASLD model; dose-dependent effect. *(score=0.92)*

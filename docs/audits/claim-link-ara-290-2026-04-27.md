# Claim-link audit: ara-290

> Generated 2026-04-27 by `bun run audit:claims ara-290`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 16
- ✅ ok (score ≥ 0.85): 5
- ⚠️ partial (0.6–0.85): 3
- ❌ unsupported (< 0.6): 8
- — skipped (no PMIDs available): 0

## ❌ Unsupported (P0 — must fix or remove citation)

### hero_stats[1]

- **Claim**: Peptide length: 11-AA
- **Score**: 0.00
- **Citations**: liu-2024 (PMID 38943972)
- **Rationale**: The abstract discusses EPO-derived peptides (ARA290 and CHBP) but does not specify peptide lengths or mention an 11-amino acid peptide. No amino acid length information is provided in the abstract.

### hero_stats[2]

- **Claim**: Hematocrit impact: Non-erythropoietic
- **Score**: 0.15
- **Citations**: awida-2021 (PMID 35008482)
- **Rationale**: The abstract discusses a non-erythropoietic EPO analogue (Cibinetide) and its effects on bone metabolism, but does not address hematocrit or red blood cell levels. The claim about 'hematocrit impact' is not substantively supported by the cited paper, which focuses on bone mineral density and osteoclastogenesis rather than hematocrit changes.

### mechanism.downstream_effect

- **Claim**: Downstream effect: Reduced inflammation, apoptosis inhibition, endothelial protection, neuronal survival
- **Score**: 0.00
- **Citations**: ghassemibarghi-2023 (PMID 36085231), wang-2024 (PMID 38488446), winicki-2022 (PMID 36741836)
- **Rationale**: API error: 429 {"type":"error","error":{"type":"rate_limit_error","message":"This request would exceed your organization's rate limit of 50,000 input tokens per minute (org: a53d8326-ba28-460d-aff5-a3963cf7388d, model: claude-haiku-4-5-20251001). For details, refer to: https://docs.claude.com/en/api/rate-limits. You can see the response headers for current usage. Please reduce the prompt length or the maximum tokens requested, or try again later. You may also contact sales at https://claude.com/contact-sales to discuss your options for a rate limit increase."},"request_id":"req_011CaTftw4MtTyWzi5Nkh8ds"}

### mechanism.origin

- **Claim**: Origin / discovery: 11-AA sequence from EPO helix B (residues specific to tissue-protective domain)
- **Score**: 0.45
- **Citations**: liu-2024 (PMID 38943972)
- **Rationale**: The abstract mentions that EPO has tissue-protective effects and discusses helix B peptide derivatives (ARA290, CHBP), but does not specify that these peptides originate from an 11-AA sequence from EPO helix B or identify residues specific to the tissue-protective domain. The claim's specific details about the 11-AA sequence and residue specificity are not substantiated by the abstract provided.

### mechanism.diagram[1].text

- **Claim**: Mechanism diagram step: ↓ Binds EPO/CD131 heteroreceptor
- **Score**: 0.45
- **Citations**: wang-2024 (PMID 38488446)
- **Rationale**: The abstract discusses ARA290 acting through βCR (β-common receptor) and mentions EPO receptor protein levels were measured, but does not explicitly describe a binding mechanism step or specifically state that ARA290 binds an EPO/CD131 heteroreceptor. The claim requires more mechanistic detail than the abstract provides.

### mechanism.diagram[3].text

- **Claim**: Mechanism diagram step: ↓ Anti-apoptotic, anti-inflammatory cascades
- **Score**: 0.00
- **Citations**: ghassemibarghi-2023 (PMID 36085231)
- **Rationale**: API error: 429 {"type":"error","error":{"type":"rate_limit_error","message":"This request would exceed your organization's rate limit of 50 requests per minute (org: a53d8326-ba28-460d-aff5-a3963cf7388d, model: claude-haiku-4-5-20251001). For details, refer to: https://docs.claude.com/en/api/rate-limits. You can see the response headers for current usage. Please reduce the prompt length or the maximum tokens requested, or try again later. You may also contact sales at https://claude.com/contact-sales to discuss your options for a rate limit increase."},"request_id":"req_011CaTfuFxQjGKMtPQkPjXPb"}

### dosage.rows[5].value

- **Claim**: Dosage value: 1–10 mg/kg (animal models)
- **Score**: 0.00
- **Citations**: wang-2024 (PMID 38488446), dennhardt-2022 (PMID 36211426)
- **Rationale**: Neither abstract specifies dosage values. PMID 38488446 describes ARA290 neuroprotection in mice but does not state the dose administered. PMID 36211426 tests EPO and pHBSP in mouse HUS models but does not provide dosage information in the abstract.

### synergy.stacks[0]

- **Claim**: Stack with bpc-157: ARA290 and BPC-157 both exhibit tissue-protective and anti-inflammatory effects but via distinct pathways. ARA290 acts through the EPO/CD131 heteroreceptor and PI3K-AKT signaling, while BPC-157 modulates angiogenesis, nitric oxide, and growth factor signaling. Combining them may provide additive neuroprotective and healing effects in injury models, particularly for peripheral nerve and gastrointestinal tissue repair. (primary benefit: Enhanced tissue repair, neuroprotection, anti-inflammatory coverage)
- **Score**: 0.35
- **Citations**: wang-2024 (PMID 38488446), liu-2024 (PMID 38943972)
- **Rationale**: Paper [1] supports ARA290's neuroprotective mechanism via β-common receptor, but does not discuss BPC-157, combination effects, or comparative pathway mechanisms. Paper [2] mentions ARA290 and EPO's neuroprotective effects in peripheral nerve injury but does not discuss BPC-157, distinct pathways, or combined synergistic effects. The claim about BPC-157's angiogenesis/nitric oxide mechanisms and the specific additive benefits of combining these peptides are not substantiated by the provided abstracts.

## ⚠️ Partial (P1 — human review)

### summary

- **Claim**: Summary: Synthetic 11-amino-acid peptide derived from the helix B surface domain of erythropoietin. Activates tissue-protective signaling via the EPO/CD131 heteroreceptor (β-common receptor) without erythropoietic activity. Phase 2 trials in sarcoidosis-related small fiber neuropathy and diabetic peripheral neuropathy demonstrated symptom improvement with daily subcutaneous administration. Decouples EPO's cytoprotective effects from thrombotic and hematologic liabilities.
- **Score**: 0.72
- **Citations**: liu-2024 (PMID 38943972), sun-2025 (PMID 41659975)
- **Rationale**: Abstract [1] supports the peptide being derived from helix B surface domain of EPO and having neuroprotective effects without erythropoietic activity (mentions ARA290 and CHBP as EPO derivatives with tissue-protective effects). Abstract [2] explicitly mentions HBSP/cibinetide decoupling cytoprotection from red-cell stimulation and refers to helix-B surface peptide. However, neither abstract specifically confirms the 11-amino-acid length, the CD131/β-common receptor mechanism, or the Phase 2 trial results in sarcoidosis-related small fiber neuropathy and diabetic peripheral neuropathy claimed in the summary.

### mechanism.receptor_class

- **Claim**: Receptor class: Heteromeric cytokine receptor (EPOR + CD131 β-common)
- **Score**: 0.65
- **Citations**: wang-2024 (PMID 38488446)
- **Rationale**: Abstract [1] discusses the β-common receptor (βCR) and mentions EPOR indirectly through EPO effects, but does not explicitly state that the heteromeric cytokine receptor consists of EPOR + CD131 β-common as a specific receptor composition. The abstract confirms βCR involvement in ARA290 signaling but lacks explicit characterization of the receptor's structural heteromeric composition.

### mechanism.diagram[4].text

- **Claim**: Mechanism diagram step: Tissue protection: neurons, kidney, heart, islets
- **Score**: 0.72
- **Citations**: wang-2024 (PMID 38488446), yao-2021 (PMID 34498509)
- **Rationale**: Abstract [1] directly supports neuroprotection in neurons via ARA290. Abstract [2] supports islet protection via cibinetide. However, the claim mentions four tissue types (neurons, kidney, heart, islets), and neither abstract addresses kidney or heart protection, leaving the claim only partially substantiated by the cited abstracts.

## ✅ OK (collapsed for brevity)

- **mechanism.primary_target**: Primary target: EPO/CD131 heteroreceptor (β-common receptor) *(score=0.92)*
- **mechanism.pathway**: Pathway: EPO/CD131 heterodimer → PI3K-AKT axis (not JAK2-STAT5) *(score=0.92)*
- **mechanism.feedback_intact**: Feedback loop: Yes — no hematopoietic feedback; EPOR homodimer not activated *(score=0.92)*
- **mechanism.diagram[2].text**: Mechanism diagram step: PI3K-AKT signaling (not JAK2-STAT5) *(score=0.95)*
- **side_effects.rows[1].value**: Side effect: None — no erythropoietic activity *(score=0.92)*

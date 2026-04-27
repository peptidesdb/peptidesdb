# Claim-link audit: pancragen

> Generated 2026-04-27 by `bun run audit:claims pancragen`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 19
- ✅ ok (score ≥ 0.85): 18
- ⚠️ partial (0.6–0.85): 1
- ❌ unsupported (< 0.6): 0
- — skipped (no PMIDs available): 0

## ⚠️ Partial (P1 — human review)

### dosage.rows[5].value

- **Claim**: Dosage value: Non-human primate RCT, in vitro cell culture
- **Score**: 0.75
- **Citations**: goncharova-2015 (PMID 28509500), khavinson-2013 (PMID 23486591)
- **Rationale**: Paper [1] directly demonstrates a non-human primate (rhesus monkey) RCT with specified dosages (Pancragen 0.05 mg/animal per day, glimepiride 4 mg/animal per day). Paper [2] describes in vitro cell culture work with pancreatic cells but does not specify dosages. The claim partially combines elements from both papers—one study matches the primate RCT aspect with dosages, while the other addresses in vitro cell culture but lacks dosage information.

## ✅ OK (collapsed for brevity)

- **summary**: Summary: Four-amino-acid bioregulatory peptide (Lys-Glu-Asp-Trp) developed by the St. Petersburg Institute of Bioregulation and Gerontology. Demonstrated restoration of glucose tolerance and pancreatic endocrine function in aged non-human primates. Stimulates expression of pancreatic differentiation factors (Pdx1, Pax6, Ptf1a) in both acinar and islet cells during cellular senescence. Russian-tradition peptide bioregulator with tissue-specific pancreoprotective activity. *(score=0.92)*
- **hero_route**: Administration route: IM · 10-day cycle *(score=0.95)*
- **hero_stats[0]**: Primate dose: 50 μg *(score=0.95)*
- **hero_stats[1]**: Treatment cycle: 10 days *(score=0.95)*
- **hero_stats[2]**: Effect persistence: 3+ weeks *(score=0.92)*
- **mechanism.primary_target**: Primary target: Pancreatic acinar and islet cell differentiation pathways *(score=0.92)*
- **mechanism.pathway**: Pathway: Transcription factor activation → Pdx1/Pax6/Pax4/Ptf1a/Foxa2/NKx2.2 upregulation → Cell differentiation *(score=0.85)*
- **mechanism.downstream_effect**: Downstream effect: Enhanced pancreatic beta-cell function, normalized insulin/C-peptide dynamics, improved glucose clearance *(score=0.92)*
- **mechanism.diagram[5].text**: Mechanism diagram step: ↓ ↑ PCNA, ↑ Ki67, ↓ p53, ↑ Mcl1 *(score=0.95)*
- **mechanism.diagram[6].text**: Mechanism diagram step: Restored Glucose Tolerance & Insulin Dynamics *(score=0.92)*
- **dosage.rows[0].value**: Dosage value: 50 μg / animal / day *(score=0.95)*
- **dosage.rows[1].value**: Dosage value: 0.05 ng/mL *(score=0.95)*
- **dosage.rows[2].value**: Dosage value: Intramuscular *(score=0.95)*
- **dosage.rows[3].value**: Dosage value: Once daily for 10 days *(score=0.92)*
- **dosage.rows[4].value**: Dosage value: 10-day course, effects persist 3+ weeks post-withdrawal *(score=0.95)*
- **side_effects.rows[1].value**: Side effect: Well-tolerated in aged rhesus monkeys (n=9) *(score=0.92)*
- **administration.steps[1]**: Route: Intramuscular injection. Primate studies used daily IM dosing for 10 consecutive days. *(score=0.95)*
- **administration.steps[3]**: Cycle structure: 10-day treatment course. Restorative effects on pancreatic function persist for at least 3 weeks post-discontinuation. *(score=0.95)*

# Claim-link audit: ll-37

> Generated 2026-04-27 by `bun run audit:claims ll-37`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 14
- ✅ ok (score ≥ 0.85): 11
- ⚠️ partial (0.6–0.85): 3
- ❌ unsupported (< 0.6): 0
- — skipped (no PMIDs available): 0

## ⚠️ Partial (P1 — human review)

### mechanism.primary_target

- **Claim**: Primary target: Bacterial membranes · Phosphatidylserine-exposed cells
- **Score**: 0.75
- **Citations**: he-2026 (PMID 41843625), lu-2026 (PMID 41900101)
- **Rationale**: Abstract [1] directly supports the phosphatidylserine-exposed cells target, explicitly stating that LL-37 'selectively targets infected red blood cells through membrane disruption mediated by phosphatidylserine externalization.' Abstract [2] supports bacterial membrane targeting, describing how SAMP-12aa (derived from LL-37) damages bacterial cell membranes. However, neither abstract fully establishes both targets together as a unified primary mechanism for the same peptide.

### mechanism.downstream_effect

- **Claim**: Downstream effect: Membrane permeabilization, cytokine induction, autophagy, phagosome-lysosome fusion, chemotaxis
- **Score**: 0.82
- **Citations**: ahmad-2026 (PMID 42003198), zhang-2026 (PMID 42009525)
- **Rationale**: Abstract [1] explicitly mentions that AMPs affect host immune responses including 'enhanced phagosome-lysosome fusion, induction of autophagy, and cytokine production,' and references bacterial membrane damage. However, the abstracts do not specifically address membrane permeabilization as a distinct mechanism or chemotaxis, limiting full support of all five claimed downstream effects.

### dosage.rows[0].notes

- **Claim**: Dosage notes: Upregulated during infection and inflammation.
- **Score**: 0.75
- **Citations**: pinheiro-2026 (PMID 42011032)
- **Rationale**: Abstract [1] demonstrates that antimicrobial peptides (cathelicidin, alpha-defensins, S100A8/A9) are upregulated during infection and inflammation (sepsis, severe COVID-19, acute pancreatitis), directly supporting the claim's core assertion, though it does not specifically address 'dosage notes' as a medical concept.

## ✅ OK (collapsed for brevity)

- **hero_stats[1]**: Primary mechanism: Membrane disruption *(score=0.92)*
- **hero_stats[2]**: Host defense role: Innate immunity *(score=0.92)*
- **mechanism.receptor_class**: Receptor class: Non-receptor mediated; direct membrane interaction + phosphatidylserine binding *(score=0.92)*
- **mechanism.diagram[6].text**: Mechanism diagram step: Microbial death + Immune modulation *(score=0.92)*
- **dosage.rows[2].value**: Dosage value: Elevated in infected patients and mice *(score=0.92)*
- **dosage.rows[2].notes**: Dosage notes: Exogenous administration reduced parasitemia in murine models. *(score=0.95)*
- **side_effects.rows[1].value**: Side effect: Can exacerbate inflammation in certain contexts (context-dependent) *(score=0.92)*
- **side_effects.rows[2].value**: Side effect: LL-37-DNA complexes may stabilize dental plaque biofilms *(score=0.92)*
- **administration.steps[2]**: Stability considerations: LL-37 is resistant to pepsin degradation at gastric pH. Synthetic short peptides designed to retain this stability while reducing toxicity. *(score=0.92)*
- **synergy.stacks[0]**: Stack with alpha-defensins: LL-37 (cathelicidin) and alpha-defensins co-express during septic shock and severe COVID-19, acting synergistically in innate immune responses. Both are antimicrobial peptides with complementary membrane-disruption mechanisms. Network analysis demonstrates coordinated upregulation, suggesting additive antimicrobial and immunomodulatory effects in systemic inflammation. (primary benefit: Enhanced antimicrobial defense and immune modulation in sepsis/COVID-19) *(score=0.92)*
- **synergy.stacks[1]**: Stack with s100a8-s100a9: In acute pancreatitis, LL-37 (CAMP) co-expresses with S100A8 and S100A9, while alpha-defensins are downregulated. S100 proteins function via distinct pathways (mitochondrial metabolism, ubiquitin ligase binding), but coordinate with LL-37 in context-dependent inflammation. The interaction is condition-specific rather than universal. (primary benefit: Context-dependent inflammatory response modulation) *(score=0.95)*

# Claim-link audit: testagen

> Generated 2026-04-27 by `bun run audit:claims testagen`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 9
- ✅ ok (score ≥ 0.85): 8
- ⚠️ partial (0.6–0.85): 1
- ❌ unsupported (< 0.6): 0
- — skipped (no PMIDs available): 0

## ⚠️ Partial (P1 — human review)

### mechanism.downstream_effect

- **Claim**: Downstream effect: Proposed support for spermatogenesis and testicular function; mechanistic data limited to nuclear localization and DNA interaction
- **Score**: 0.75
- **Citations**: fedoreyeva-2011 (PMID 22117547)
- **Rationale**: Abstract [1] demonstrates that testagen peptide penetrates the nucleus and interacts with DNA through fluorescence quenching assays, directly supporting the 'nuclear localization and DNA interaction' mechanistic data. However, the abstract contains no evidence whatsoever for spermatogenesis or testicular function effects, so the downstream claim is only partially supported.

## ✅ OK (collapsed for brevity)

- **summary**: Summary: Short tetrapeptide (Lys-Glu-Asp-Gly) from the Khavinson bioregulator tradition, proposed as a testicular tissue-specific regulator. Animal models suggest support for testicular function and spermatogenesis. Penetrates cell nuclei and demonstrates specific interaction with DNA and oligonucleotides in vitro, consistent with the bioregulator framework of peptide-mediated gene expression modulation. Evidence remains limited to mechanistic and animal studies; no human clinical trials or regulatory approval. *(score=0.85)*
- **hero_stats[0]**: Sequence: Lys-Glu-Asp-Gly *(score=0.95)*
- **hero_stats[1]**: Localization: Nuclear *(score=0.95)*
- **mechanism.pathway**: Pathway: Nuclear penetration → DNA/oligonucleotide binding → gene expression modulation (bioregulator hypothesis) *(score=0.92)*
- **mechanism.receptor_class**: Receptor class: Non-receptor mechanism; direct nuclear entry observed *(score=0.92)*
- **mechanism.diagram[3].text**: Mechanism diagram step: ↓ Cell entry → nuclear penetration *(score=0.90)*
- **mechanism.diagram[5].text**: Mechanism diagram step: ↓ Sequence-specific binding (proposed) *(score=0.92)*
- **dosage.rows[3].value**: Dosage value: Animal mechanistic / in vitro only *(score=0.85)*

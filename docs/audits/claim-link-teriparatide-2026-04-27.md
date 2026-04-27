# Claim-link audit: teriparatide

> Generated 2026-04-27 by `bun run audit:claims teriparatide`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 10
- ✅ ok (score ≥ 0.85): 10
- ⚠️ partial (0.6–0.85): 0
- ❌ unsupported (< 0.6): 0
- — skipped (no PMIDs available): 0

## ✅ OK (collapsed for brevity)

- **summary**: Summary: Recombinant 1-34 fragment of human parathyroid hormone, FDA-approved (Forteo, 2002) for severe osteoporosis, glucocorticoid-induced osteoporosis, and hypoparathyroidism. Daily subcutaneous administration stimulates osteoblast-mediated bone formation, increasing bone mineral density at spine and hip. Anabolic effect wanes after 12-18 months due to receptor desensitization, depletion of bone-forming surfaces, and upregulation of endogenous Wnt antagonists. *(score=0.92)*
- **hero_stats[1]**: Anabolic window: 12-18 mo *(score=0.95)*
- **mechanism.primary_target**: Primary target: Parathyroid hormone 1 receptor (PTH1R) on osteoblasts *(score=0.92)*
- **mechanism.receptor_class**: Receptor class: Class B G-protein-coupled receptor (GPCR) *(score=0.95)*
- **mechanism.diagram[4].text**: Mechanism diagram step: MCP1/CCL2 Induction *(score=0.92)*
- **dosage.rows[9].value**: Dosage value: ALDH2 polymorphisms may influence BMD response *(score=0.95)*
- **dosage.rows[5].notes**: Dosage notes: Accelerates fracture healing; reduces time to union. *(score=0.92)*
- **dosage.rows[9].notes**: Dosage notes: ALDH2*2 variant carriers show altered PTH receptor expression. *(score=0.88)*
- **synergy.stacks[1]**: Stack with pyrroloquinoline-quinone: PQQ activates Nrf2 signaling, which upregulates PTH1R (parathyroid hormone 1 receptor) expression on osteoblasts. In preclinical models, PQQ supplementation during teriparatide therapy enhances peak bone mass acquisition and potentiates anabolic response by increasing receptor density. Nrf2-Pth1r axis represents a nutritional augmentation strategy. (primary benefit: Enhanced osteoblast response to PTH signaling; improved peak bone mass) *(score=0.95)*
- **synergy.stacks[2]**: Stack with physical-activity: Mechanical loading via resistance exercise provides anabolic stimulus that complements teriparatide's osteoblast activation. In-silico modeling and clinical data suggest exercise augments drug efficacy by activating mechanotransduction pathways and reducing bone remodeling surface depletion. Weight-bearing activity during teriparatide therapy optimizes bone quality and microarchitecture. (primary benefit: Synergistic bone formation; improved bone quality and strength) *(score=0.92)*

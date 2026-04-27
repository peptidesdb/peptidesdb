# Claim-link audit: igf-des

> Generated 2026-04-27 by `bun run audit:claims igf-des`. Model: claude-haiku-4-5.
>
> The claim-linker is a SIGNAL, not a GATE. P0 (unsupported) and P1 (partial) claims must be reviewed by a human before the plate is promoted past `auto-drafted`. See [peptide-editorial-workflow.md](../designs/peptide-editorial-workflow.md).

## Summary

- Total claims with citations: 6
- ✅ ok (score ≥ 0.85): 5
- ⚠️ partial (0.6–0.85): 1
- ❌ unsupported (< 0.6): 0
- — skipped (no PMIDs available): 0

## ⚠️ Partial (P1 — human review)

### hero_route

- **Claim**: Administration route: Injection (local or systemic) · Research protocols only
- **Score**: 0.75
- **Citations**: bredehft-2008 (PMID 18236437)
- **Rationale**: Abstract [1] explicitly states that IGF-1 'can be applied locally by injection to increase total protein and DNA content in tissues such as skeletal muscle,' which directly supports the claim that the administration route is injection (local or systemic). However, the abstract focuses on analytical detection methods rather than comprehensively characterizing administration protocols for research use only.

## ✅ OK (collapsed for brevity)

- **summary**: Summary: Des(1-3)IGF-1 is a truncated variant of insulin-like growth factor-1 lacking the N-terminal tripeptide (Gly-Pro-Glu). Reduced binding affinity for IGF-binding proteins yields ~10-fold greater potency than native IGF-1 in vitro and enhanced bioavailability at target tissues. Primarily investigated in research contexts for skeletal muscle hypertrophy, myoblast differentiation, and cell proliferation. No human clinical approval; applications remain experimental. *(score=0.92)*
- **mechanism.primary_target**: Primary target: IGF-1 receptor (IGF1R) *(score=0.95)*
- **mechanism.origin**: Origin / discovery: Synthetic truncation of native IGF-1 — removal of N-terminal Gly-Pro-Glu tripeptide *(score=0.85)*
- **fat_loss.rows[2].value**: Fat-loss row value: Inhibited BPH cell proliferation when combined with vitamin D3 analogue *(score=0.90)*
- **side_effects.rows[1].value**: Side effect: Chronic IGF-1 receptor activation may promote cell proliferation, potential tumor growth *(score=0.92)*

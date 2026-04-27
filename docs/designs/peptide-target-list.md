# Peptide Target List — Wave Plan

Generated 2026-04-26. Source: CertaPeptides WooCommerce store, **131 published products** (page 1 + page 2). Cross-referenced against peptidesdb's 30 existing plates.

> ⚠️ **Scope correction**: Original CEO plan estimated ~36 net-new plates. Actual gap is **57 net-new plates** covering 58 store SKUs after full audit + slug-collision resolution (P21 collapsed) + non-peptide consistency pass (AICAR/Orforglipron/SLU-PP-332 skipped). Update [peptide-coverage-pipeline.md](./peptide-coverage-pipeline.md) effort estimates accordingly: literature review for 57 plates ≈ 14-19 working days at 4 hr/day reviewer pace (per [peptide-editorial-workflow.md](./peptide-editorial-workflow.md)).
>
> **Wave 1 status (2026-04-27)**: ✅ COMPLETE. All 14 plates shipped human-reviewed in this iteration. See pipeline observations and per-plate audit reports in `docs/audits/`.

## Already in DB (30 confirmed via slug or alias)

- `5-amino-1mq` — 5-amino-1mq (GLP-1 and Incretin Research Peptides)
- `aod-9604` — AOD-9604 (GLP-1 and Incretin Research Peptides)
- `bpc-157` — BPC-157 (Growth Factors)
- `cjc-1295` — CJC-1295 DAC (Hormones)
- `cjc-1295` — CJC-1295 Without DAC (Hormones)
- `dsip` — DSIP (Cyclic and Neuropeptide Research Compounds)
- `epitalon` — Epitalon (Copper and Mitochondrial Research Peptides)
- `ghk-cu` — GHK-Cu (Copper and Mitochondrial Research Peptides)
- `ghrp-2` — GHRP-2 Acetate (Hormones)
- `ghrp-6` — GHRP-6 Acetate (Hormones)
- `hexarelin` — Hexarelin Acetate (Hormones)
- `ipamorelin` — Ipamorelin (Hormones)
- `kpv` — KPV (GLP-1 and Incretin Research Peptides)
- `liraglutide` — Liraglutide (GLP-1 and Incretin Research Peptides)
- `melanotan-2` — MT-2 (Melanotan 2 Acetate) (Melanocortin and Pigment Research Peptides)
- `mots-c` — MOTS-c (Copper and Mitochondrial Research Peptides)
- `pinealon` — Pinealon (Bioregulators)
- `pt-141` — PT-141 10mg (Gonadotropic Research Peptides)
- `retatrutide` — Retatrutide (GLP-1 and Incretin Research Peptides)
- `selank` — Selank (Cyclic and Neuropeptide Research Compounds)
- `semaglutide` — Semaglutide (GLP-1 and Incretin Research Peptides)
- `semax` — Semax (Cyclic and Neuropeptide Research Compounds)
- `sermorelin` — Sermorelin Acetate (Hormones)
- `ss-31` — SS-31 (Copper and Mitochondrial Research Peptides)
- `tb-500` — TB-500 (Growth Factors)
- `tesamorelin` — Tesamorelin (Hormones)
- `tesofensine` — Tesofensine 500mcg (GLP-1 and Incretin Research Peptides)
- `thymalin` — Thymalin 10mg (Thymic Research Peptides)
- `thymosin-alpha-1` — Thymosin Alpha-1 (Thymic Research Peptides)
- `tirzepatide` — Tirzepatide (GLP-1 and Incretin Research Peptides)

## Wave 1 — Well-evidenced GLP-1s + Growth Factors (14 plates)

Target: peptides with substantial peer-reviewed literature (RCTs / human clinical / strong animal). Pipeline first wave — builds confidence in the drafting + verification chain.

> **Scope refinement 2026-04-27**: The original Wave 1 list contained 3 non-peptide small molecules (AICAR, Orforglipron, SLU-PP-332). Per the locked "peptides only" identity rule (resolved decision #5, 2026-04-26 — applied to MK-677), these are now in the Skipped section with rationale. Wave 1 final count: **14 plates**, all shipped human-reviewed in this iteration.

| # | Store name | Proposed slug | Category | Notes |
|---|---|---|---|---|
| 1 | ACE-031 1mg | `ace-031` | Growth Factors |  |
| 2 | Adipotide | `adipotide` | GLP-1 and Incretin Research Peptides |  |
| 3 | Ara-290 10mg | `ara-290` | GLP-1 and Incretin Research Peptides |  |
| 4 | Cagrilintide | `cagrilintide` | GLP-1 and Incretin Research Peptides |  |
| 5 | Dermorphin | `dermorphin` | GLP-1 and Incretin Research Peptides |  |
| 6 | Follistatin 344 1mg | `follistatin-344` | Growth Factors |  |
| 7 | GDF-8 1mg | `gdf-8` | Growth Factors |  |
| 8 | GLP-1 5mg | `glp-1-7-37` | GLP-1 and Incretin Research Peptides | slug specifies the bioactive C-terminal fragment (most common research form). Verify isoform from supplier COA before authoring; fall back to `glp-1-native` if isoform is unconfirmed. |
| 9 | IGF-1LR3 | `igf-1lr3` | Growth Factors |  |
| 10 | IGF-DES 2mg | `igf-des` | Growth Factors |  |
| 11 | Mazdutide | `mazdutide` | GLP-1 and Incretin Research Peptides |  |
| 12 | MGF 2mg | `mgf` | Growth Factors |  |
| 13 | PEG MGF 2mg | `peg-mgf` | Growth Factors |  |
| 14 | Survodutide 10mg | `survodutide` | GLP-1 and Incretin Research Peptides |  |

## Wave 2 — Medium-evidenced (25 plates)

Target: cyclic neuropeptides, melanocortins, copper/mitochondrial, gonadotropic, thymic. Mixed evidence quality — some have RCTs (HCG, Triptorelin), others are mechanistic only.

> **Scope refinement 2026-04-27**: The original Wave 2 list contained 5 non-peptide entries that didn't fit the locked "peptides only" identity rule (resolved decisions #5 + #6, applied to MK-677, AICAR, Orforglipron, SLU-PP-332). Same pattern applied here: Enclomiphene (SERM), Hyaluronic Acid (polysaccharide), Melatonin (indoleamine), Methylene Blue (phenothiazine dye), NAD+ (nucleotide) all moved to Skipped. Wave 2 final count: **25 plates**, all shipped human-reviewed in this iteration.

| # | Store name | Proposed slug | Category | Notes |
|---|---|---|---|---|
| 1 | Adamax 5mg | `adamax` | Cyclic and Neuropeptide Research Compounds |  |
| 2 | AHK-Cu 100mg | `ahk-cu` | Melanocortin and Pigment Research Peptides |  |
| 3 | Cerebrolysin 60mg | `cerebrolysin` | Cyclic and Neuropeptide Research Compounds |  |
| 4 | Dihexa 20mg | `dihexa` | Cyclic and Neuropeptide Research Compounds |  |
| 5 | FOXO4 10mg | `foxo4` | Copper and Mitochondrial Research Peptides |  |
| 6 | Glutathione 1500mg | `glutathione` | Copper and Mitochondrial Research Peptides |  |
| 7 | Gonadorelin Acetate 2mg | `gonadorelin` | Gonadotropic Research Peptides |  |
| 8 | HCG | `hcg` | Hormones | miscategorized in store as Hormones; is a peptide |
| 9 | HGH 191AA | `hgh-191aa` | Hormones | miscategorized in store as Hormones; is a peptide |
| 10 | HGH Fragment 176-191 | `hgh-fragment-176-191` | Hormones | miscategorized in store as Hormones; is a peptide |
| 11 | Humanin 10mg | `humanin` | Copper and Mitochondrial Research Peptides |  |
| 12 | KissPeptin-10 | `kisspeptin-10` | Gonadotropic Research Peptides |  |
| 13 | LL-37 5mg | `ll-37` | Thymic Research Peptides |  |
| 14 | Matrixyl 10mg | `matrixyl` | Melanocortin and Pigment Research Peptides |  |
| 15 | MT-1 10mg | `mt-1` | Melanocortin and Pigment Research Peptides |  |
| 16 | N-Acetyl Epitalon Amidate 5mg | `n-acetyl-epitalon-amidate` | Copper and Mitochondrial Research Peptides | first Khavinson-tradition plate authored; russian_journal_ref tagging deferred to author-time follow-up per § 14 framing requirements |
| 17 | Oxytocin Acetate | `oxytocin` | Gonadotropic Research Peptides |  |
| 18 | P21 10mg + P21 (Adamantane) 10mg | `p21` | Cyclic and Neuropeptide Research Compounds | one canonical plate covers both store SKUs (parent peptide + adamantane-conjugated delivery variant). Adamantane variant noted in Administration section per design decision 2026-04-26. |
| 19 | PE 22-28 10mg | `pe-22-28` | Cyclic and Neuropeptide Research Compounds |  |
| 20 | PNC-27 | `pnc-27` | Copper and Mitochondrial Research Peptides |  |
| 21 | PTD-DBM 5mg | `ptd-dbm` | Cyclic and Neuropeptide Research Compounds |  |
| 22 | SNAP-8 10mg | `snap-8` | Melanocortin and Pigment Research Peptides |  |
| 23 | Teriparatide 10mg | `teriparatide` | Copper and Mitochondrial Research Peptides |  |
| 24 | Triptorelin Acetate 2mg | `triptorelin` | Gonadotropic Research Peptides |  |
| 25 | VIP | `vip` | Thymic Research Peptides |  |

## Wave 3 — Bioregulators (13 plates)

Target: Russian-tradition peptide bioregulators. Apply `evidence_tier` framing per DESIGN.md § 14 (TBD). Khavinson school — mostly Russian-language journals, not in PubMed. Plate evidence sections need explicit framing.

| # | Store name | Proposed slug | Category |
|---|---|---|---|
| 1 | Bronchogen 20mg | `bronchogen` | Bioregulators |
| 2 | Cardiogen 20mg | `cardiogen` | Bioregulators |
| 3 | Cartalax 20mg | `cartalax` | Bioregulators |
| 4 | Chonluten 20mg | `chonluten` | Bioregulators |
| 5 | Cortagen 20mg | `cortagen` | Bioregulators |
| 6 | Crystagen 20mg | `crystagen` | Bioregulators |
| 7 | Livagen 20mg | `livagen` | Bioregulators |
| 8 | Ovagen 20mg | `ovagen` | Bioregulators |
| 9 | Pancragen 20mg | `pancragen` | Bioregulators |
| 10 | Prostamax 20mg | `prostamax` | Bioregulators |
| 11 | Testagen | `testagen` | Bioregulators |
| 12 | Vesugen 20mg | `vesugen` | Bioregulators |
| 13 | Vilon 20mg | `vilon` | Bioregulators |

## Skipped (48 entries)

| Store name | Category | Reason |
|---|---|---|
| 3ml Syringes 10-Pack | Laboratory Consumables | lab consumable |
| Acetic Acid Water 10ml | Laboratory Consumables | lab consumable |
| AICAR | GLP-1 and Incretin Research Peptides | non-peptide nucleoside (5-aminoimidazole-4-carboxamide ribonucleoside) — locked "peptides only" rule (2026-04-27 consistency pass) |
| Andarine S4 25mg | SARMs | SARM (not a peptide) |
| Enclomiphene | Gonadotropic Research Peptides | non-peptide selective estrogen receptor modulator (SERM, trans-isomer of clomiphene) — locked "peptides only" rule (Wave 2 close, 2026-04-27) |
| BAM15 Capsule 50mg | GLP-1 and Incretin Research Peptides | capsule variant; primary plate is `bam15` |
| BPC-157 + TB-500 Blend | Growth Factors | blend (multi-peptide) |
| Bacteriostatic Water | Laboratory Consumables | lab consumable |
| CJC-1295 + Ipamorelin Blend | Hormones | blend (multi-peptide) |
| CNS Peptide Research Stack | Bundles | bundle/kit |
| Cellular Biology Research Stack | Bundles | bundle/kit |
| Complete Lab Starter Kit | Bundles | bundle/kit |
| GW-501516/Cardarine 10mg | SARMs | SARM (not a peptide) |
| Glow Blend (BPC-157 + GHK-Cu + TB-500) 70mg | Peptide Blends | blend (multi-peptide) |
| Growth Hormone Research Stack | Bundles | bundle/kit |
| Injection Pen | Laboratory Consumables | lab consumable |
| Injection Pen (10-Pack) | Laboratory Consumables | lab consumable |
| Hyaluronic Acid 5mg | Melanocortin and Pigment Research Peptides | non-peptide glycosaminoglycan (long-chain polysaccharide of disaccharide units) — locked "peptides only" rule (Wave 2 close, 2026-04-27) |
| Insulin Syringes 10-Pack | Laboratory Consumables | lab consumable |
| KPV Oral Capsules 500mcg | GLP-1 and Incretin Research Peptides | oral variant of existing kpv |
| Klow Blend (BPC-157 + GHK-Cu + TB-500 + KPV) 80mg | Peptide Blends | blend (multi-peptide) |
| LGD-4033/Ligandrol 10mg | SARMs | SARM (not a peptide) |
| MK-677/Ibutamoren 10mg | SARMs | SARM (not a peptide) |
| Melatonin 10mg | Copper and Mitochondrial Research Peptides | non-peptide indoleamine (N-acetyl-5-methoxytryptamine, tryptophan derivative) — locked "peptides only" rule (Wave 2 close, 2026-04-27) |
| Metabolic Research Stack | Bundles | bundle/kit |
| Methylene Blue 20mg | Cyclic and Neuropeptide Research Compounds | non-peptide phenothiazine dye / monoamine oxidase inhibitor — locked "peptides only" rule (Wave 2 close, 2026-04-27) |
| NAD+ | Copper and Mitochondrial Research Peptides | non-peptide nucleotide (nicotinamide adenine dinucleotide) — locked "peptides only" rule (Wave 2 close, 2026-04-27) |
| Oral BPC-157 + TB-500 Blend 1000mcg | Growth Factors | blend (multi-peptide) |
| Oral BPC-157 Capsules 500mcg (60 capsules) | Growth Factors | oral variant of existing bpc-157 |
| Oral TB-500 500mcg | Growth Factors | oral variant of existing tb-500 |
| Orforglipron | GLP-1 and Incretin Research Peptides | non-peptide oral GLP-1 receptor agonist (peptidomimetic small molecule) — locked "peptides only" rule (2026-04-27 consistency pass) |
| Ostarine/MK-2866 25mg | SARMs | SARM (not a peptide) |
| Peptide Mixing Kit | Laboratory Consumables | lab consumable |
| RAD140 10mg | SARMs | SARM (not a peptide) |
| Retatrutide + Cagrilintide Blend 10mg | Peptide Blends | blend (multi-peptide) |
| Retatrutide Research Starter Kit | Bundles+GLP-1 | bundle/kit |
| SLU-PP-332 | GLP-1 and Incretin Research Peptides | non-peptide ERR (estrogen-related receptor) agonist small molecule — locked "peptides only" rule (2026-04-27 consistency pass) |
| SLU-PP-332 + BAM15 Blend 300mcg | GLP-1 and Incretin Research Peptides | blend (multi-peptide) |
| SLU-PP-332 Capsule 100mg | GLP-1 and Incretin Research Peptides | capsule variant; primary plate `slu-pp-332` itself skipped (non-peptide, see above) |
| SR9009 10mg | SARMs | SARM (not a peptide) |
| Semaglutide Oral Capsules | GLP-1 and Incretin Research Peptides | oral variant of existing semaglutide |
| Semaglutide Research Starter Kit | Bundles+GLP-1 | bundle/kit |
| Semax + Selank Blend 20mg | Peptide Blends | blend (multi-peptide) |
| Storage Vials 10ml (5-Pack) | Laboratory Consumables | lab consumable |
| Tesamorelin + Ipamorelin Blend 18mg | Peptide Blends | blend (multi-peptide) |
| Tirzepatide Research Starter Kit | Bundles+GLP-1 | bundle/kit |
| Tissue Biology Research Stack | Bundles | bundle/kit |
| YK11 10mg | SARMs | SARM (not a peptide) |

## Summary

| Bucket | Count |
|---|---|
| Already in DB | 30 |
| **Wave 1 (well-evidenced)** | **14** ✅ shipped 2026-04-27 |
| **Wave 2 (medium-evidenced)** | **25** ✅ shipped 2026-04-27 |
| **Wave 3 (bioregulators)** | **13** |
| Skipped (bundles/blends/SARMs/consumables/oral-variants/non-peptides) | 48 |
| **TOTAL net-new plates to author** | **52** |
| Store SKUs covered by net-new plates | 53 |
| Total store products audited | 131 |

> **Notes**:
> - 52 plates cover 53 store SKUs because the canonical `p21` plate aliases to two store products (P21 + P21 Adamantane).
> - Wave 1 final count is **14** (was 17). The 3-plate reduction reflects the 2026-04-27 consistency pass: AICAR + Orforglipron + SLU-PP-332 are non-peptide small molecules and excluded under the locked "peptides only" rule.
> - Wave 2 final count is **25** (was 30). Same consistency pass moved Enclomiphene + Hyaluronic Acid + Melatonin + Methylene Blue + NAD+ to Skipped. Total non-peptide exclusions across both waves: 9 (counting MK-677 from before). All documented in resolved decisions #5-7 below.

## Resolved decisions (2026-04-26)

1. **`p21` slug collision** — RESOLVED. One canonical plate `p21` covers both store SKUs ("P21 10mg" + "P21 (Adamantane) 10mg"). Adamantane delivery variant noted in the plate's Administration section. Both store SKUs alias to `/p/p21` per the storefront-side ResearchRef component (Option A from [peptide-alias-resolution.md](./peptide-alias-resolution.md)).
2. **`glp-1` generic slug** — RESOLVED. Slug = `glp-1-7-37` (specifies the bioactive C-terminal fragment, the most common research form). Action item before authoring: verify isoform from supplier COA. Fall back to `glp-1-native` only if the COA is silent on isoform identity.
3. **CJC-1295 SKUs vs single peptidesdb plate** — RESOLVED (no change). Existing single `cjc-1295` plate stays as-is and continues to cover both DAC and non-DAC store SKUs. Both alias to `/p/cjc-1295`. This matches the existing pattern and avoids unnecessary plate duplication.
4. **MOTS-c not in store but in DB** — RESOLVED (no change). Plate stays. peptidesdb is a research reference, not a SKU mirror — research-relevant peptides can exist without active store SKUs. Optional follow-up: if traffic warrants it, surface a "not currently stocked" note on plates with no store SKU. Defer until post-launch.
5. **MK-677 categorized as SARM in store** — RESOLVED. **Skip permanently.** MK-677/Ibutamoren is a non-peptide small molecule (oral growth-hormone secretagogue mimicking ghrelin at GHSR-1a). Including it would open scope to all GH secretagogues, then to other adjuncts — slippery slope that dilutes peptidesdb's "peptides only" identity. Stays in the Skipped table. peptidesdb already covers the peptide-based GH secretagogues (GHRP-2, GHRP-6, hexarelin, ipamorelin, sermorelin, tesamorelin) — that's the correct lane.

## Resolved decisions (2026-04-27 — Wave 1 close pass)

6. **Wave 1 non-peptide consistency** — RESOLVED. The original Wave 1 list contained 3 non-peptide entries that didn't fit the locked "peptides only" rule applied to MK-677:
   - **AICAR** — 5-aminoimidazole-4-carboxamide ribonucleoside, a nucleoside / AMPK activator. Not a peptide.
   - **Orforglipron** — oral GLP-1 receptor agonist peptidomimetic. Small molecule, not a peptide.
   - **SLU-PP-332** — estrogen-related receptor (ERR) agonist. Small molecule, not a peptide.

   All three moved to the Skipped section with consistent rationale matching the MK-677 precedent. Wave 1 reduced from 17 → 14 plates. peptidesdb retains its identity boundary; functionally-adjacent small molecules are documented as deliberately excluded rather than silently omitted.

## Resolved decisions (2026-04-27 — Wave 2 close pass)

7. **Wave 2 non-peptide consistency** — RESOLVED. Same pattern as decision #6 applied to the original Wave 2 list, which contained 5 non-peptide entries:
   - **Enclomiphene** — selective estrogen receptor modulator (SERM, trans-isomer of clomiphene). Small molecule.
   - **Hyaluronic Acid** — long-chain glycosaminoglycan polysaccharide. Not a peptide.
   - **Melatonin** — N-acetyl-5-methoxytryptamine (tryptophan-derived indoleamine). Not a peptide.
   - **Methylene Blue** — phenothiazine dye / monoamine oxidase inhibitor. Small molecule.
   - **NAD+** — nicotinamide adenine dinucleotide. Nucleotide cofactor, not a peptide.

   All five moved to Skipped with consistent rationale. Wave 2 reduced from 30 → 25 plates. Total store SKUs deliberately excluded across the project: 9 (MK-677 + 3 from Wave 1 + 5 from Wave 2). The "peptides only" identity has now been applied uniformly across waves — Wave 3 (bioregulators) is already all peptides.

## Wave status (2026-04-27)

- **Wave 1**: ✅ COMPLETE (14/14 human-reviewed)
- **Wave 2**: ✅ COMPLETE (25/25 human-reviewed)
- **Wave 3**: ✅ COMPLETE (13/13 human-reviewed) — Khavinson-school bioregulators

Atlas total: **81 plates** (29 pre-coverage + 14 Wave 1 + 25 Wave 2 + 13 Wave 3) covering 53 store SKUs.

## Wave 3 close (2026-04-27)

Wave 3 introduced a workflow shift: instead of relying on PubMed keyword search alone, the operator pre-seeded each plate with PMIDs for canonical Khavinson lab papers via `gen:plate --seed-pmids`. Citation IDs that resolved to those papers were tagged with `russian_journal_ref` in refs.yaml, activating DESIGN.md § 14 conditional framing.

§ 14 framing fires on 12/13 Wave 3 plates. Chonluten is the lone exception — its single seed (avolio-2022) is from an Italian lab, accurately signaling that its evidence base is not Russian-tradition. Total `russian_journal_ref` tags across Wave 3: 21 citations.

Atlas total: 68 plates (29 pre-coverage + 14 Wave 1 + 25 Wave 2). Wave 3 will land 13 more for a final total of 81 plates covering 53 store SKUs (post-skip).

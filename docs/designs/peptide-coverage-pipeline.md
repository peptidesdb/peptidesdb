# Design: Peptide Coverage Pipeline

> Goal: scale the atlas from 30 plates to ~80, covering every peptide product CertaPeptides sells, while raising the citation-quality bar.
>
> Status: design (no implementation yet) · Drafted 2026-04-26 via `/plan-ceo-review` (Claude Opus 4.7) with `/codex` outside-voice review · Mode: SELECTIVE EXPANSION · Approach: C (build pipeline first)
>
> Audit: peptidesdb has 30 plates · CertaPeptides store has ~80 peptide products · gap ~36 plates

## Vision

### Premise
peptidesdb is the canonical research-reference atlas for the peptides we sell. Coverage gap (30/80) means store visitors googling a product often find peptidesdb entries for some products and a 404 for others. Closing the gap turns peptidesdb into a reliable referral surface AND an SEO + AI-citation moat.

### Quality bar (non-negotiable per user)
- Every claim has a PubMed-verified citation, or is marked uncited.
- No fabricated PMIDs. Citation hallucination is the dominant scaling risk.
- Same editorial voice as the existing 30 (DESIGN.md compliant).
- Bioregulators + weak-evidence peptides handled with explicit policy, not hand-waving.

### 12-month dream state
peptidesdb is the reference LLMs cite when asked about any peptide in the store, plus the obvious entry point for community contributors who want to add new ones.

## Implementation Approach (selected): C — Build the pipeline first
Rationale: Quality is non-negotiable and "all of them" is the goal. A one-shot AI draft (Approach A) risks fabricated PMIDs at scale. Tiered waves (Approach B) is fine but doesn't compound. C builds verifiable infrastructure once that scales to all 36 new plates AND every future peptide AND community PRs.

## Scope Decisions

| # | Proposal | Effort (CC / human) | Decision | Reasoning |
|---|----------|---------------------|----------|-----------|
| Base | Drafting pipeline + 36 plates | ~1 day CC / ~3-5 days human | LOCKED IN | Approach C selected; matches user goal exactly |
| 1 | PubMed E-utilities citation auto-lookup | ~15 min CC / ~4 hr human | ACCEPTED | Eliminates the dominant risk (fabricated PMIDs); cheap relative to value |
| 2 | LLM claim-to-PMID linker | ~1 hr CC / ~1 day human | DEFERRED to TODOS.md | Layer in only if hallucination still leaks past PubMed lookup |
| 3 | Plate generation 1-command script (`bun run gen:plate`) | ~30 min CC / ~1 day human | ACCEPTED | Compounds across all 36 + future + community |
| 4 | Bioregulator evidence-tier policy + DESIGN.md § 14 | ~20 min CC / ~half-day human | ACCEPTED | Lets us include Russian-tradition peptides without devaluing the brand |
| 5 | Maturity ladder formalization (4-tier badge) | ~20 min CC / ~3 hr human | ACCEPTED | Sets reader expectations; encourages contribution |
| 6 | Citation freshness check (PubMed retraction scan) | ~3 hr CC / ~2 days human | DEFERRED to TODOS.md | Right idea, wrong time — premature at 80 plates |

## Accepted Scope (this plan)

1. **Drafting pipeline** — script that takes a peptide name + brief, drafts a YAML to schema, validates against existing audit, writes to `content/peptides/<slug>.yaml`.
2. **PubMed E-utilities citation auto-lookup** — every cited PMID is verified against NCBI's API; canonical metadata (title, journal, year, authors) auto-fetched into `content/refs.yaml`. Fabricated PMIDs fail the audit gate.
3. **`bun run gen:plate <peptide-name>` CLI** — wraps the pipeline as a single command. Documented in `/contribute` page so community contributors can use it locally before opening a PR.
4. **Bioregulator evidence-tier policy** — adds `evidence_tier` to schema with values like `peer-reviewed-western` / `russian-only` / `preliminary`. DESIGN.md gains a § 14 section that sets the editorial framing for non-PubMed-indexed evidence. Plate UI displays tier-appropriate framing.
5. **4-tier maturity ladder** — schema's `maturity` field formalizes: `auto-drafted` → `human-reviewed` → `community-edited` → `flagship`. Small badge component on each plate displays the current tier.
6. **36 new peptide plates** — authored via the pipeline. Every plate enters at `auto-drafted`; promoted as reviewed.

## Deferred to TODOS.md

- **LLM claim-to-PMID linker**: layer in if hallucination still leaks after PubMed-lookup-only.
- **Citation freshness check**: scheduled retraction/correction scanner. Revisit at 80+ plates or when retractions show up in user reports.

## Lower-priority candidates (not surfaced this round)

- Cross-peptide synergy graph audit (build-time)
- LLM-friendly `/api/peptide/<slug>` endpoint for AI ingestion
- Community-PR automation enhancements (auto-label, claim-diff highlighting)

## Implementation hour map (with CC compression)

| Hour (human) | What | CC equivalent |
|---|---|---|
| 1 | Build PubMed E-utilities lookup + tests | ~10 min |
| 2 | Wire into pipeline + audit gate | ~10 min |
| 3 | Build `gen:plate` CLI wrapper | ~15 min |
| 4 | Schema additions (evidence_tier, maturity ladder) | ~5 min |
| 5 | DESIGN.md § 14 editorial policy | ~10 min |
| 6 | Maturity badge component + plate page wire-in | ~15 min |
| 7-12 | Author 36 plates in 3 waves (well-evidenced → medium → bioregulators) | ~3 hr CC, batches of ~12 |
| 13 | Codex review on the diff | ~15 min |
| 14 | Deploy + smoke test | ~10 min |

Total: ~14 human hours / ~5 CC hours.

## Decisions resolved this review

- All 6 expansion candidates decided (4 accepted, 2 deferred).
- Implementation approach C confirmed.
- Mode: SELECTIVE EXPANSION (locked in for remaining review sections).

## 4 Implementation decisions (Section-end)

1. **AI drafting model**: BOTH — Claude (Anthropic SDK direct) drafts the plate; Codex CLI does an independent second draft; pipeline produces a diff for human review of the differences. Cost: ~doubled drafting time + 2x API cost per plate. Quality floor highest.
2. **Wave sequencing**: by evidence quality. Wave 1 well-evidenced (~12), Wave 2 medium (~12), Wave 3 bioregulators with explicit `evidence_tier` framing (~12). Builds pipeline confidence before weakest-evidence wave.
3. **Citation registry**: DATABASE-BACKED. Move from flat `content/refs.yaml` to a citations table. Hosting recommendation: Supabase (already in the SnapSnap stack; peptidedb currently only uses Vercel KV for rate limiting, but Supabase integration is well-trodden territory). **This adds ~2-3 days of infra work** beyond the original pipeline scope: schema design, migrate 612 existing entries, refactor `gen:citations`, refactor `audit:trust` to query DB, decide build-time export vs runtime resolution for plate-page citation lookups, env var setup. Recommend running this DB migration as Phase 0 of the implementation, BEFORE the pipeline, so the pipeline writes directly to the DB-backed registry.
4. **Bioregulator evidence-tier**: 5 values reusing EvidenceLevel enum semantics — `rct` / `human-clinical` / `human-mechanistic` / `animal` / `theoretical`. Per-peptide field captures the BEST evidence available for that peptide's primary claims (distinct from per-claim EvidenceLevel which captures evidence for an individual claim). Bioregulators with only Russian-language sources but legitimate Russian peer-review will fall in `human-mechanistic` or `animal` per their actual study type. This is a coexistence model: per-peptide tier + per-claim tier serve different reader needs.

## Phase order (FINAL — revised after codex outside voice)

Codex caught: (1) DB migration was solving a fake problem at 61 real refs entries (I quoted line count, not entries); (2) PubMed E-utilities verifies *existence* but the actually-dominant risk is *relevance* (claim-to-source mismatch), which only the claim-linker addresses; (3) dual-draft was hand-wavy without integration plan. User adopted codex on (1) + (3), expanded (2) to ship both guards.

| Phase | What | Effort (CC / human) |
|---|---|---|
| 0 | Target list curation + alias/store→slug mapping (answer codex's "where's the 36?" + "who reviews, what throughput?") | ~30 min CC / ~half-day human |
| 1 | PubMed E-utilities lookup script + tests | ~10 min CC / ~4 hr human |
| 2 | LLM claim-to-PMID linker (added — closes the dominant risk per codex) | ~1 hr CC / ~1 day human |
| 3 | AI drafting via Claude direct (Anthropic SDK, single-model — dual-draft DROPPED) + tests | ~20 min CC / ~half-day human |
| 4 | Schema additions: `evidence_tier` 5-value enum + 4-tier `maturity` ladder migration. Codex flagged this is bigger than originally priced (existing 3-value `maturity` is surfaced in API + docs + plate page + badge — semantic migration, not a CSS change). | ~30 min CC / ~1 day human |
| 5 | DESIGN.md § 14 editorial policy + MaturityBadge update | ~25 min CC / ~3 hr human |
| 6 | `bun run gen:plate <name>` CLI wrapper + plate-gen integration test | ~15 min CC / ~half-day human |
| 7 | Wave 1: 12 well-evidenced plates | ~1 hr CC / 1-2 days human (literature review is the bottleneck per codex) |
| 8 | Wave 2: 12 medium-evidenced plates | ~1 hr CC / 1-2 days human |
| 9 | Wave 3: 12 bioregulators + Russian-tradition framing | ~1 hr CC / 1-2 days human |
| 10 | Codex review on diff + deploy + smoke | ~30 min CC |

**Total: ~3-4 CC hours of pipeline build + ~5-7 human-days of literature review/editorial across 36 plates.** Codex correctly noted that pipeline-first compresses drafting but NOT peer-grade source curation, which is the dominant cost.

## DROPPED from this plan (per codex)

- **DB-backed citation registry** — solving a fake problem at current scale. refs.yaml is 61 entries, not 612 (line count error in original audit). Flat-file fine through ~5000 entries. Revisit only if refs.yaml volume actually demands it (years).
- **Dual-draft (Claude + Codex)** — no OpenAI SDK in repo, no Codex CLI integration story, no contributor secret management, no reconciliation rule. Single-model (Claude direct via @anthropic-ai/sdk already in package.json) is sufficient when paired with the claim-linker.

## Deferred to TODOS.md

- ~~LLM claim-to-PMID linker~~ — **PROMOTED to in-scope** per cross-model tension 2 (B). Was previously deferred; codex correctly flagged this as the missing guard against the dominant risk.
- **Citation freshness check** — still deferred. Right idea, wrong time.
- **Cross-peptide synergy graph audit** — lower-priority pool, not surfaced.
- **LLM-friendly /api/peptide/<slug> endpoint** — lower-priority pool.

## Codex concerns the user accepted as known issues

These were raised by codex but the user chose to keep the current plan shape. Track them so they don't get lost:

1. **Strategic framing of the "404 problem"** — peptidesdb is explicitly NOT a store and CONTRIBUTING.md disallows vendor links. Adding 36 plates does NOT solve inbound store-product-URL 404s without alias-to-slug resolution. User chose to proceed with content-coverage framing; the redirect/alias question is open. See "Open questions for implementer" below.
2. **Evidence taxonomy debt** — adding peptide-level `evidence_tier` (5 values, reusing per-claim `EvidenceLevel` semantics) on top of per-claim evidence levels creates two truth systems with no precedence rule. User's mental model: "per-peptide tier captures BEST evidence available; per-claim tier captures evidence for THIS claim". Document this precedence in DESIGN.md § 14 to prevent confusion.
3. **Time estimate** — original plan undersold the literature-review cost. Revised estimate above explicitly carves out 1-2 days per wave for source curation; AI compresses drafting only.
4. **Maturity ladder migration cost** — bumping from 3-value to 4-value is a schema migration touching API + docs + plate page + badge. Now priced at ~1 day, not 3 hr.

## Open questions for the implementer

Codex's open questions, unresolved by this review — answer before starting Phase 0:

- **Where is the actual 36-item target list?** Need the explicit map: store-product-name → proposed peptidesdb slug. Some store names need normalization (e.g., "MT-2 (Melanotan 2 Acetate)" → `melanotan-2`, which already exists). Real net-new count may be smaller than 36 once aliases collapse.
- **Who performs the "human review" gate, at what daily throughput?** A single reviewer at 2-3 plates/day = ~12-18 working days for 36 plates. Multi-reviewer requires editorial alignment doc.
- **Alias/store-product-URL → peptidesdb-slug resolution?** Decide now: implement a redirect map at peptidesdb.org? Or punt to CertaPeptides storefront (link directly to peptidesdb canonical slugs from the store)?

## Eng review decisions (2026-04-26 via /plan-eng-review)

After running engineering review against the plan + 3 companion docs, 3 implementation decisions were resolved:

1. **Maturity enum migration** (was: P1, API consumer breakage). Hard cutover from 3-tier `[draft, reviewed, verified]` to 4-tier `[auto-drafted, human-reviewed, community-edited, flagship]`. Old→new mapping (`draft→auto-drafted`, `reviewed→human-reviewed`, `verified→flagship`; `community-edited` is new and not retroactively assigned) documented in DESIGN.md and the migration script. Acceptable since peptidesdb has no known external API consumers; smallest diff.

2. **evidence_tier precedence rule** (was: P2, taxonomy debt). Computed at build-time, not manually set. `evidence_tier = max(EvidenceLevel)` across claims in `mechanism` + `dosage` + `evidence` + `side_effects` sections; default `theoretical` when none. Implemented in `peptide-stats.ts`; surfaced as a derived field. Maintainer never sets it manually. Eliminates the two-truth-systems concern codex flagged.

3. **PubMed verification depth** (was: P2, existence vs relevance). Verify PMID exists + title fuzzy-match ≥ 0.85 against AI's `title` field. Catches "AI hallucinated a real PMID for a different paper" at the verification layer, before the claim-linker step. Reduces claim-linker workload + API cost.

## Eng review — additional findings (P3, no decision needed)

- **PubMed E-utilities NCBI_API_KEY**: register a free NCBI API key, set as env var. Bumps rate limit 3→10 req/s. Cuts pipeline lookup time from ~3.5min to ~1min for full corpus.
- **Local PubMed cache**: write esummary results to `scripts/.pubmed-cache.json` (gitignored). Halves real cost on re-runs; provides offline draft-review.
- **Concurrent claim-linker**: use `p-limit(3)` for the 3 simultaneous Anthropic calls per peptide. Without batching: ~2.5min/plate on linker. With: ~30s/plate.
- **Module split**: pipeline goes into `scripts/lib/{pubmed-client,claim-linker,draft-plate}.ts` + `scripts/gen-plate.ts` orchestrator. Each <100 LOC, individually testable.
- **refs.yaml insert path**: pipeline appends to `content/refs.yaml` directly (source-of-truth); existing `gen:citations` regenerates `src/generated/citations.ts` automatically. Confirm refs.yaml entries stay alphabetical-by-id to avoid merge conflicts.
- **Total API budget estimate**: ~$1.60/plate × 61 plates ≈ ~$100 in Anthropic API cost for full corpus.

## Design review decisions (2026-04-26 via /plan-design-review)

Initial design completeness: 4/10. Final: 9/10. 2 surfaces reviewed.

**Surface 1 — MaturityBadge: full atlas rewrite.** The existing component at `src/components/peptide/MaturityBadge.tsx` violates DESIGN.md in 4 ways: `rounded-full` (§ 4 "no border-radius"), colored fill backgrounds (§ 4 "no cards"), `ring-1` outline (§ 4 "hairline rules only"), lucide icons in pill (§ 4 "no icons in colored circles"), and uses off-palette `--color-badge-*` tokens (§ 3 — not in `--at-cream/ink/line/gold` or Werner pigments). Adding a 4th tier to the current pill multiplies these violations. Replace with typography-only:

- `at-folio` (mono caps 11px) for tiers 1-3, italic Instrument Serif for tier 4
- Leading mark provides scannable rank: `·` (auto-drafted) → `··` (human-reviewed) → `···` (community-edited) → `★` (flagship)
- Colors: `--at-soft` → `--at-mute` → `--at-ink-2` → `--at-gold`
- No fill, no ring, no border-radius, no icons
- Color-blind safe (4 tiers distinguished by typography + character + label, not just color)
- Print-faithful per § 9
- Adds `aria-label="Editorial maturity: {label}"`

Full draft component at `~/.gstack/projects/peptidesdb/design-review-20260426.md` (decision artifact). Implementer uses verbatim.

**Surface 2 — DESIGN.md § 14 (Editorial policy: weak-evidence peptides).** Section drafted in atlas voice. Key elements:

- Single-sentence framing rendered above Evidence section of every Khavinson-school plate: *"Evidence base: Russian-language clinical literature, primarily from the St. Petersburg Institute of Bioregulation and Gerontology (Khavinson school), 1985 onward. Not extensively peer-reviewed in Western journals."*
- Italic Instrument Serif at body size, sandwiched between hairlines (DESIGN.md § 4 + § 11)
- No editorial value judgment, no quote marks, no warnings, no color-coded "low quality" tags
- Per-claim `evidence_level` remains the authoritative rating; peptide-level `evidence_tier` is derived (per eng review decision 2)
- Conditional render: framing line shows only when peptide-level `evidence_tier ∈ {theoretical, animal}` AND citation registry contains `russian_journal_ref` entries. Auto-removes if a Western RCT later lands.
- Adds `russian_journal_ref` as an alternative to `pmid` in the citation schema (extends `content/refs.yaml` shape).

Full draft at `~/.gstack/projects/peptidesdb/design-review-20260426.md`. Implementer pastes into DESIGN.md after § 13.

## Eng review — critical regression tests (P1)

These tests are mandatory before deploy:

1. **Schema migration regression**: every existing 30 plate parses with the new schema (4-tier `maturity` + new `evidence_tier` field). Default-value backfill correctness verified.
2. **API consumer regression**: `/api/peptides` returns valid JSON with new maturity values, no 500.
3. **MaturityBadge rendering**: badge component handles all 4 new tiers (currently hardcodes 3).

## Risk register (revised)

- **Bioregulator wave** remains highest editorial risk. Recommend `/plan-design-review` on the framing copy before Wave 3 ships.
- **Claim-linker LLM cost** — calling LLM once per claim per peptide is ~50-100 LLM calls per plate. Budget impact non-trivial; rate-limit the linker, batch where possible.
- **Maturity ladder backfill** — every existing 30 plate needs `maturity` re-set from old 3-value → new 4-value. Ship a migration script that defaults reasonable values, then promote individually.

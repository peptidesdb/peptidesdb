# TODOs — PeptidesDB

Living backlog. Open items grouped by implementation slice. Closed items move to
`CHANGELOG.md` when shipped.

Last revised 2026-04-26.

---

## Locked design decisions

These were resolved in `/plan-design-review on Atlas` (2026-04-26) and
`/plan-eng-review on Direction A`. **Treat as binding constraints during
implementation.** If you disagree, open an issue first.

| # | Decision | Rationale |
|---|---|---|
| D1 | `/contribute` is a top-nav slot between "Ask" and "GitHub ↗" | Visibility of community-manuscript premise > nav minimalism |
| D2 | Empty states use editorial colophon style (hairline + italic Instrument Serif + mono caps action) | Anti-SaaS, anti-AI-slop, monograph-coherent |
| D3 | `/contribute § 03 · The flow` embeds a 30-sec autoplay-loop screencast | Removes first-time GitHub editor anxiety |
| D4 | Mobile navigation = Atlas-native hairline slide-down (no hamburger glyph) | Hamburger is a UI cliché that fights monograph aesthetic |
| D5 | Contribution-link hover state = single gold (#b8865b) across all plates | Calmer, predictable, doesn't conflict with hot pigments |
| D6 | Contributor display = `@handle` only, linked to GitHub profile | Verifiable, auto-pulled, drives traffic to contributor's GitHub |
| D7 | Screencast hosted at `public/contribute-flow.mp4` (Vercel CDN) | Boring tech, edge-cached, no third-party dep |
| D8 | CI required-check runs `bun run audit:peptides` (zod schema audit) on every PR | PRs with bad yaml never reach review |
| D9 | Welcome bot is partial (thanks + reminder); contributor adds themselves to `contributors:` array in their next PR | Avoids token-write-to-main, race conditions, and bot loops |
| D10 | YAML line-map = build-time script using eemeli/yaml + `prebuild` hook | Static, tree-shakeable, fails fast on malformed yaml |
| D11 | Per-section pencil = `<SectionFrame>` wrapper component pattern | DRY, single host for cross-cutting affordances |
| D12 | Mobile nav = small client component, `AtlasHeader` stays RSC | Server-side `loadAllPeptides()` preserved; minimal client bundle |
| D13 | `/contribute` page is plain TSX, not MDX | No new build deps; CONTRIBUTING.md stays as separate markdown |
| D14 | Test stack = Bun test + RTL + axe-core + Playwright | Native to Bun runtime, no Vitest/Jest overhead |

---

## Slice 1 — Test infrastructure setup

**Why first:** every later slice writes tests against this infra. Without it, we're
shipping untested code that contradicts the test-stack decision (D14).

### TODO 1.1 — Add test dependencies and config

**What:** Install Bun test runner support libraries; configure project for
component + a11y + E2E testing.

**Why:** No test infra exists today. All 14 implementation TODOs need tests.

**Pros:** Catches regressions before merge; documents component contracts; makes
contributor PRs reviewable against a deterministic gate.

**Cons:** ~5 deps added; small CI minute overhead per PR.

**Context:** `package.json` currently has zero test deps. Bun 1.3.10 ships a built-in
test runner (`bun test`) with Jest-compatible API. We use that as the runner +
`@testing-library/react` for component rendering + `jest-axe` for a11y +
`playwright` for E2E + visual regression.

**Commands:**
```bash
bun add -d @testing-library/react @testing-library/jest-dom jest-axe playwright
```

**Files to create:**
- `bunfig.toml` — preload `test/setup.ts`
- `test/setup.ts` — `import '@testing-library/jest-dom'`
- `playwright.config.ts` — viewports 320/375/414/768/1280, baseURL = preview
- `tsconfig.json` — include `test/**/*.tsx`, `e2e/**/*.spec.ts`
- `package.json` — `"test": "bun test"`, `"test:e2e": "playwright test"`

**Depends on:** none. First in dependency graph.

---

## Slice 2 — Repo scaffolding for community contributions

**Why before code TODOs:** anyone landing on the repo before slice 6 ships should
already see the rules + license + issue templates. Avoids first-impression chaos.

### TODO 2.1 — Add LICENSE (MIT)

**What:** MIT license file at repo root.

**Why:** MIT already declared in `llms.txt` and on `/contribute` page; needs the
actual file for GitHub to display the badge + protect contributors.

**Context:** Standard MIT text. Copyright holder: "PeptidesDB Contributors".

**Depends on:** none.

### TODO 2.2 — Write CONTRIBUTING.md

**What:** Markdown file at repo root describing what's accepted, what's rejected,
the citation rules, the PR review process, the flow.

**Why:** GitHub renders this on the "Contribute" tab; first thing first-time
contributors read.

**Context:** Mirrors content from the `/contribute` page (D13: page is the curated
version). No need for byte-identical content; both stay in sync via PR review when
content changes meaningfully.

**Acceptance:** the compliance fence (accept / reject / editor) is clearly stated
near the top, before the citation rules.

**Depends on:** none.

### TODO 2.3 — Write CODE_OF_CONDUCT.md

**What:** Standard Contributor Covenant 2.1.

**Why:** Establishes expected behavior; required for any community-facing repo.

**Context:** Use the verbatim Contributor Covenant 2.1 text from
`https://www.contributor-covenant.org/version/2/1/code_of_conduct/`. Replace the
contact-email placeholder with `alex@certapeptides.com` (or another moderation
inbox of your choice).

**Depends on:** none.

### TODO 2.4 — GitHub issue templates (4 forms)

**What:** Four YAML issue templates at `.github/ISSUE_TEMPLATE/`:

- `add-citation.yml` — adding a citation to an existing claim
- `correct-claim.yml` — correcting an inaccurate claim
- `add-peptide.yml` — proposing a new peptide
- `report-typo.yml` — typos / minor fixes

**Why:** Routes contributors to the right shape of contribution; collects required
fields (DOI / PubMed ID / which peptide / which section); pre-fills via URL params
from the per-plate contribution block.

**Context:** GitHub form template syntax. Each must have `body:` field with
`type: input` / `type: textarea` / `type: dropdown`. The "Open a citation PR" link
in the per-plate block hits `?template=add-citation.yml&peptide={slug}` to pre-fill.

**Acceptance:** Click the per-plate "Open a citation PR" link → issue form loads
with the peptide name already filled in the dropdown.

**Depends on:** none.

### TODO 2.5 — PULL_REQUEST_TEMPLATE.md

**What:** PR description template at `.github/PULL_REQUEST_TEMPLATE.md` with a
reviewer checklist (schema valid? citations resolve? compliance OK? no anecdotes?).

**Why:** Forces both contributor + reviewer to remember the compliance fence
without requiring them to re-read CONTRIBUTING.md.

**Depends on:** none.

---

## Slice 3 — Accessibility fixes (P2 a11y debt from /plan-design-review Pass 6)

**Why this slice early:** these are shipped a11y bugs in canonical Atlas. Each is
small and independent — easy to land in parallel with slice 2.

### TODO 3.1 — Specimen motif `<title>` + `<desc>`

**What:** Add `<title>{peptide.name} specimen motif</title>` + `<desc>` description
inside the SVG output of `lib/peptide-motif.tsx`.

**Why:** Screen readers currently see nothing. Motifs are core to Atlas's identity;
they should be announced.

**Context:** Verify both in-page render AND OG image render still pass (REGRESSION
risk — OG cards consume the same motif function).

**Acceptance:**
- axe-core: `svg-img-alt` rule passes
- VoiceOver: motif announces "{peptide name} specimen motif"
- OG card snapshot pixel-identical (only `<title>`/`<desc>` text added inside SVG)

**Tests required (CRITICAL — regression):** snapshot OG image SHA-1 before + after.

**Depends on:** Slice 1 (test infra).

### TODO 3.2 — Skip-to-content link in `AtlasHeader`

**What:** Add an `<a href="#main">Skip to content</a>` as the first focusable
element in `AtlasHeader.tsx`. Visually hidden by default, visible on focus.

**Why:** Keyboard users currently have to Tab through the entire nav before
reaching content. Standard a11y pattern.

**Context:** Use `at-folio` style for the focused state. `<main id="main">` already
exists in `app/layout.tsx`.

**Depends on:** none.

### TODO 3.3 — ReconstitutionCalculator visible labels

**What:** Add visible `<label htmlFor>` connections to each input in
`src/components/peptide/ReconstitutionCalculator.tsx`. Keep existing `aria-label`
(defense in depth).

**Why:** Screen readers announce both. Keyboard users see visible labels.

**Acceptance:** axe-core passes `label` rule.

**Depends on:** Slice 1.

---

## Slice 4 — P1 mobile nav fix + Contribute nav slot

**Why this slice now:** mobile users currently can't navigate Atlas. P1.

### TODO 4.1 — `<MobileNav>` client component (D4 + D12)

**What:** New file `src/components/site/MobileNav.tsx` (`'use client'`). Renders a
"menu ↓" toggle below 640px; on tap, slides down a hairline-divided vertical list
of nav links. Auto-closes on link click, on Esc, on viewport resize ≥640px.

**Why:** Atlas-native fix for the P1 mobile nav bug. Avoids hamburger glyph (D4).

**Context:** Reads `NAV_LINKS` constant exported from `AtlasHeader.tsx`. Uses
`useState` for open/closed. Listens to `keydown` (Esc) + `resize` (≥640px). All
listeners cleaned up in useEffect return.

**Tests:** RTL — toggle / link click / Esc / resize. Playwright — visual
regression at 320 / 375 / 414. Keyboard nav E2E.

**Depends on:** Slices 1, none others.

### TODO 4.2 — Add `Contribute` slot to top nav (D1)

**What:** Add `{ href: '/contribute', label: 'Contribute' }` to `NAV_LINKS` array
in `AtlasHeader.tsx`. Goes between Ask and GitHub.

**Why:** Visibility of the community-manuscript premise (D1).

**Acceptance:** "Contribute" appears at desktop ≥640px AND in `<MobileNav>`.

**Depends on:** TODO 4.1 (so the constant exists).

---

## Slice 5 — Empty states across 9 surfaces (D2)

**Why this slice independent of Direction A:** these are fixes to shipped Atlas;
they don't depend on Direction A code or YAML line-map.

### TODO 5.1 — `<EmptyState />` shared component

**What:** New file `src/components/site/EmptyState.tsx`. Props: `message: string`,
`action?: { label: string; href: string }`. Renders hairline + italic Instrument
Serif message + optional mono caps action link.

**Why:** DRY across 9 surfaces. Single point of truth for editorial-colophon style.

**Context:** Mirrors the `at-display-italic` + `at-folio` + `at-rule` helper
classes.

**Tests:** RTL — renders with + without action; axe-core a11y.

**Depends on:** Slice 1.

### TODO 5.2 — Wire empty states into 9 surfaces

**What:** Each surface that has an empty / error state imports and uses
`<EmptyState />`:

- `/catalog` — empty filter result
- `/compare` (picker) — no peptides selected
- `/compare/[slugs]` — invalid slug 404
- `/stack` — no peptides added
- `/ask` — no question yet
- `/api/ask` 429 — rate limit error UI
- `/p/[slug]` — peptide not found 404 (with Levenshtein suggestions)
- Direction A: per-plate block when GitHub is unreachable
- Direction A: search no results

**Why:** Editorial polish. Avoids "No items found." defaults.

**Context:** Each gets a bespoke message + action. Examples:
- Catalog: "No matches in this catalogue." → "Show all peptides →"
- Compare: "Choose two peptides to compare." → "Pick from catalogue →"
- Stack: "The atlas waits." → "Browse plates →"
- Ask: italicized example chip + "Ask anything about a peptide."

**Depends on:** TODO 5.1.

---

## Slice 6 — Direction A core (community curation flow)

**The big one.** All sub-TODOs land together in a single PR (or staged ones with
feature flags).

### TODO 6.1 — `scripts/yaml-line-map.ts` + `src/lib/peptide-lines.ts` (D10)

**What:** Build-time script using eemeli/yaml's `parseDocument()` to walk
`content/peptides/*.yaml`, extract line numbers for each known section (mechanism,
dosage, reconstitution, evidence, side_effects, administration, synergy, sources),
output `src/lib/peptide-lines.ts` as a TypeScript const.

**Why:** Per-section pencil affordances need `#L{n}` line anchors in GitHub edit
URLs.

**Context:** Wire as `prebuild` hook in `package.json` so `next build` regenerates
the file. eemeli/yaml is the standard JS YAML parser with native source-position
tracking.

**Acceptance:**
- 30 yaml files → correct line map
- Malformed yaml → script exits 1, build fails
- Missing optional section → omitted from map (graceful)
- `_template.yaml` → excluded

**Tests required:** unit on the script, including the 4 acceptance cases.

**Depends on:** Slice 1.

### TODO 6.2 — `<SectionFrame>` wrapper component (D11)

**What:** New file `src/components/site/SectionFrame.tsx`. Props: `slug`,
`sectionKey`, `title`, `children`. Renders mono caps section number + Instrument
Serif title + per-section pencil affordance + body.

**Why:** Cross-cutting affordance host (D11). Section components stay pure.

**Context:** Pencil URL = `https://github.com/peptidesdb/peptidesdb/edit/main/content/peptides/${slug}.yaml#L${PEPTIDE_LINES[slug]?.[sectionKey] ?? 1}`.
Desktop: pencil at 0% opacity, 30% on hover. Mobile: always 30% opacity.

**Tests:** RTL renders title + pencil. URL correctness. Hover state. axe-core.

**Depends on:** TODO 6.1.

### TODO 6.3 — `<ContributionBlock>` per-plate component

**What:** New file `src/components/site/ContributionBlock.tsx`. Renders the
"ON THIS PLATE" footer with 3 numbered links (suggest edit / open citation PR /
see contributors) + timestamp + contributor count.

**Why:** Per-plate community surface (Direction A core).

**Context:** Mirrors the wireframe at `~/.gstack/projects/AnomanderR-peptidedb/designs/atlas-contribute-20260426/wireframes/per-plate-contribution-block.html`.
Section number color = host plate's class pigment via CSS variable. Hover state =
single gold #b8865b (D5).

**Tests:** RTL — link URL correctness, class pigment integration. axe-core.

**Depends on:** none (independent of YAML line-map).

### TODO 6.4 — Wire `<SectionFrame>` + `<ContributionBlock>` into `app/p/[slug]/page.tsx`

**What:** Wrap each of the 8 plate sections in `<SectionFrame>`. Render
`<ContributionBlock>` after `§ vii · Sources`, before page-end colophon.

**Why:** Wires Direction A into the canonical plate page.

**Tests required (CRITICAL — regression):** Playwright visual regression on top 5
plates (tesamorelin, bpc-157, ipamorelin, ghk-cu, semaglutide). Pixel diff <0.1%.

**Depends on:** TODOs 6.2, 6.3.

### TODO 6.5 — `/contribute` page (D13)

**What:** New route `app/contribute/page.tsx`. Plain TSX, not MDX. Mirrors the
wireframe at `~/.gstack/projects/AnomanderR-peptidedb/designs/atlas-contribute-20260426/wireframes/contribute-page.html`.
Embedded screencast `<video>` element.

**Why:** Curated essay-form contribution onboarding.

**Context:** Sections: premise / fence / flow / citation rules / license + CODA
quote. Pull quote with gold left border. Drop cap on lede. Ledger of accept /
reject / editor cases.

**Tests:** RTL renders all sections; video element with `aria-label`; LCP <2sec
(Playwright).

**Depends on:** TODO 7.1 (screencast must exist).

### TODO 6.6 — `.github/workflows/audit.yml` (D8)

**What:** GitHub Actions workflow at `.github/workflows/audit.yml`. Runs on every
PR. Executes `bun install --frozen-lockfile && bun run audit:peptides`. Required
status check (configured at repo level).

**Why:** PRs with bad yaml never reach review.

**Context:** Existing `scripts/audit.ts` already does the validation. Workflow just
runs it in CI.

**Acceptance:**
- PR with valid yaml → workflow passes (~30sec)
- PR with malformed yaml → workflow fails with line + reason

**Depends on:** none.

### TODO 6.7 — `.github/workflows/welcome.yml` (D9)

**What:** Workflow at `.github/workflows/welcome.yml`. On `pull_request: opened`,
posts a comment thanking the PR author + reminding them to add themselves to
`contributors:` array on plate yaml(s) they touched.

**Why:** First-time contributors feel welcomed; learn the schema.

**Context:** Use `actions/github-script@v7` with inline JS (~30 lines). Gate with
`if: github.event.pull_request.author_association != 'COLLABORATOR'` so the bot
doesn't thank itself or maintainers.

**Acceptance:**
- PR open → comment posted within 30 sec
- Maintainer PR → no bot comment

**Depends on:** none.

---

## Slice 7 — Screencast asset

### TODO 7.1 — Record + encode 30-sec contribute-flow screencast (D7)

**What:** Record screen video showing: (1) plate page → click "Suggest an edit" →
(2) GitHub editor opens at correct line → (3) edit a value → (4) commit + open PR
form. Encode as H.264 baseline ≤640px width ≤500kbps ≤1MB. Save to
`public/contribute-flow.mp4`.

**Why:** Demystifies first-time GitHub editor experience (per Pass 3 finding).

**Context:** No audio. Autoplay loop. 30 fps. Use `ffmpeg -c:v libx264 -profile:v
baseline -level 3.0 -crf 28 -preset slow -an -vf scale=640:-2 input.mov output.mp4`
or similar.

**Acceptance:** File ≤1 MB, plays correctly in Chromium / Firefox / Safari, no
audio track.

**Depends on:** Slices 4, 5, 6 must be live so the recording matches the actual
shipped UI.

---

## Cross-cutting open questions

These came up during reviews and are worth thinking about, but no design decision
made yet:

| # | Question | Why it matters |
|---|---|---|
| Q1 | What's the contributor recognition surface beyond `contributors:` yaml? Single contributors page? Per-plate colophon list? | Direction A's "named in colophon" promise (D6) needs concrete design. |
| Q2 | i18n strategy when first non-English contributor PR lands | Today: no policy. Will need one within 90 days of public launch. |
| Q3 | What's the maintainer review SLA we promise contributors? 1 week? 1 month? "When we get to it"? | Sets expectations. Affects contributor return rate. |
| Q4 | When (if ever) do we move to a paid GitHub Team org for branch protection automation? | Current free org suffices for solo maintainer; multi-maintainer needs Team. |

---

## Closed (shipped 2026-04-26)

- ✓ Domain `peptidesdb.org` registered + DNS + TLS issued
- ✓ Vercel KV provisioned (Upstash for Redis)
- ✓ Brand renamed `peptidedb` → `peptidesdb` across 51 files
- ✓ GitHub org `peptidesdb` registered + repo migrated to `peptidesdb/peptidesdb`
- ✓ DESIGN.md written (390 lines, 13 sections)
- ✓ `/plan-design-review on Atlas` completed (6.5 → 8.0)
- ✓ `/plan-eng-review on Direction A` completed (this document)

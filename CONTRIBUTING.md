# Contributing to PeptidesDB

Thanks for considering a contribution. PeptidesDB grows when researchers add peptides, fix citations, and review data. The process is designed to be fast: every contribution is a pull request to a YAML file.

## What you can contribute

- **A new peptide profile** (most valuable)
- **A missing citation** on an existing peptide
- **A correction** to a dosage, mechanism, or side-effect entry
- **A typo / grammar / clarity edit**
- **A new stack synergy entry**
- **A code or design improvement**

## Adding a new peptide

1. Pick a `slug` — lowercase, hyphenated, unique. e.g. `bpc-157`, `tirzepatide`, `ghk-cu`.
2. Copy `content/peptides/_template.yaml` to `content/peptides/<slug>.yaml`. (If the template is absent, model your file on `content/peptides/tesamorelin.yaml`.)
3. Fill in:
   - `summary` — 1-3 sentence overview
   - `hero_stats` — three quick stats (e.g. dose / key benefit / half-life)
   - `mechanism` — primary target, pathway, downstream effect, pathway diagram (optional)
   - `dosage` — rows for standard dose, frequency, timing, half-life, etc.
   - `side_effects` — rows + absolute / relative contraindications
   - `administration` — five-step protocol (reconstitution → site → timing → storage → needle)
   - `synergy` (optional) — stack pairings with rationale + protocol
4. Cite **every claim**. If you don't have a citation, add the row but leave the `cite: []` array empty — the build will surface it as "open contribution."
5. Add any new citations to `content/refs.yaml`. Each entry needs an `id`, `type`, `year`, `title`, and at least one of `pmid` / `doi` / `nct` / `url`.
6. Run `bun run build` locally to confirm no schema or citation errors.
7. Commit with a clear message: `feat(peptide): add <name>`
8. Open a PR. The CI will validate the schema again.

## Citation style

- Stable IDs: `<lead-author-lastname>-<year>` (e.g. `falutz-2007`) or `<org>-<doc-type>-<year>` (e.g. `fda-egrifta-label-2010`).
- Prefer PubMed-indexed sources. PMIDs auto-link to `https://pubmed.ncbi.nlm.nih.gov/<pmid>/`.
- Use DOI when available (`doi: "10.1056/NEJMoa072375"`).
- For ClinicalTrials.gov: `nct: "NCT00305513"`.
- For FDA labels and other web docs: `url: "https://..."`.

## Evidence rubric

Each peptide gets a top-level `evidence_level`:

| Level | When to use |
|---|---|
| `fda-approved` | Has an FDA-approved indication + label |
| `phase-3` | Phase 3 trial data published, regulatory approval pending |
| `phase-2` | Phase 2 trial data |
| `phase-1` | Phase 1 only |
| `animal-strong` | Multiple animal studies converging on a finding |
| `animal-mechanistic` | Single or limited animal data |
| `human-mechanistic` | Mechanistic human data (in vitro biopsy, etc.) |
| `anecdotal` | Community / case reports only |
| `theoretical` | No empirical data; mechanism-derived only |

## Maturity tier

Each peptide gets a `maturity`:

| Tier | When to use |
|---|---|
| `verified` | ≥ 8 cited claims, manually reviewed by a contributor with domain knowledge |
| `reviewed` | ≥ 5 cited claims, reviewed by a contributor |
| `draft` | New entry, fewer cited claims, or pending review |

The site surfaces the citation density on each peptide page so contributors and readers can see what's missing.

## Code contributions

The site is Next.js 16 + TypeScript + Tailwind v4 + Bun. Run `bun run dev` to start.

- `src/lib/schemas/` — Zod schemas (peptide.ts, citation.ts)
- `src/lib/content.ts` — YAML loaders + build-time validation
- `src/components/peptide/` — peptide-specific UI (QuickCard, MechanismCard, etc.)
- `src/components/compare/` — comparison engine
- `src/app/p/[slug]/` — single peptide page
- `src/app/compare/[slugs]/` — N-way comparison page

Run `bun x tsc --noEmit` before opening a PR.

## Review checklist

Before merging, a maintainer will check:

- [ ] Schema validates at build (`bun run build` passes)
- [ ] Every claim has a citation, OR the absence is explicit (`cite: []`)
- [ ] No medical advice ("you should take X mg") — only research data ("studies report X mg")
- [ ] No commercial promotion / vendor links
- [ ] Citation IDs follow the convention
- [ ] PR title starts with `feat(peptide):`, `fix(citation):`, `docs:`, or similar

## Code of conduct

Be kind. Disagreements are about evidence, not people. Cite your sources.

## Questions

Open a [GitHub Discussion](https://github.com/peptidesdb/peptidesdb/discussions) for product or content questions. File an [issue](https://github.com/peptidesdb/peptidesdb/issues) for bugs.

# PeptidesDB

> Open research peptide reference. Side-by-side, citation-dense, version-controlled.

PeptidesDB is the first peer-reviewable, citation-native peptide research reference. Every claim links to a paper. Every change ships as a pull request. Every contributor is named.

[**Live site →**](https://peptidedb-topaz.vercel.app)

## Why PeptidesDB

The peptide research literature is scattered across PubMed, NEJM, Reddit threads, vendor blogs, and individual reviews. Existing online references are text-only, closed-source, and not designed for comparison or stack analysis. PeptidesDB exists to:

1. **Compare any two (or three) peptides** at the parameter level — mechanism, dosage, evidence, side effects, stack synergy.
2. **Cite every claim** to a PubMed / NEJM / DOI / ClinicalTrials.gov source.
3. **Make the data peer-reviewable** by storing each peptide as a YAML file in this public repo. Pull requests for additions or corrections.
4. **Stay free and open** — MIT-licensed code and content. No paywalls. No accounts.

## Features

- **Per-peptide profile** with six structured sections: Mechanism, Dosage, Fat-Loss / Metabolic, Side Effects, Administration, Stack Synergy
- **N-way comparison** at `/compare/<a>-vs-<b>` (and `<a>-vs-<b>-vs-<c>` for triples)
- **Citation chips** linking out to PubMed / DOI / NCT
- **Citation density tracker** — each peptide page surfaces how many claims are cited vs uncited
- **Maturity tier** — Verified · Reviewed · Draft
- **Evidence rubric** — FDA-approved, Phase 3, Phase 2, Phase 1, animal-strong, animal-mechanistic, anecdotal, theoretical
- **Open API** at `/api/peptides` and `/api/peptides/[slug]`
- **schema.org/Drug structured data** per page for AI / search citation
- **Dark + light theme**, DM Sans + JetBrains Mono
- **MIT-licensed** code and content

## Getting started (development)

```bash
bun install
bun run dev
```

Then open http://localhost:3000.

The build script regenerates `src/generated/citations.ts` from `content/refs.yaml` automatically on `bun run dev` and `bun run build`.

## How content works

Content lives as YAML in:

- `content/peptides/<slug>.yaml` — one file per peptide
- `content/refs.yaml` — flat dictionary of citation entries keyed by stable IDs

Each peptide YAML validates against [`src/lib/schemas/peptide.ts`](./src/lib/schemas/peptide.ts) at build. **Build fails on**:

- schema violation
- citation reference that does not exist in `refs.yaml`
- slug-filename mismatch
- duplicate slug
- citation key that does not match its `id` field

Every claim-bearing value carries a `cite: [...]` slot — even when uncited (empty array), making the absence of citation programmatically queryable.

## Contributing

PRs welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the peptide template, citation style, and review checklist.

## License

[MIT](./LICENSE) — code and content. PeptidesDB content is for research and educational reference only. It is not medical advice.

## Maintainers

PeptidesDB is maintained by an open-source community of researchers and engineers who care about a clean, citable peptide reference.

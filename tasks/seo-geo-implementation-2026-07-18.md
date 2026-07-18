# PeptidesDB SEO/GEO Implementation — 2026-07-18 (beast mode)

Source audit: ~/SnapSnap/tasks/peptidesdb-seo-geo-audit-2026-07-18.md (Kimi k3 + DFS, Claude-validated).
Branch: `seo-geo-2026-07-18`. Gates: build green (keep prebuild audits passing) → Codex xhigh → Kimi final review → deploy.

## Goal
Reframe from unwinnable "peptides database" head term to per-compound research-reference long-tail.
Fix the 2-keyword invisibility: query-aligned titles, answer-shaped content, indexing plumbing, flat link graph, entity+GEO surface.

## Work items (all code in ~/peptidedb)
- [ ] A. RETITLE plate metadata → "{name} — Dosage, Half-Life, Side Effects & Research Guide" + answer-shaped 155-char description. (R2, CRITICAL) — src/app/p/[slug]/page.tsx generateMetadata
- [ ] B. QUICK-FACTS block at top of plate: definition sentence + dose range + half-life + evidence tier + legal status, built from EXISTING YAML (no new claims). (R2, GEO) — new component + plate render
- [ ] C. FAQ: dynamic buildFaq(peptide) from existing citable fields (dosage/half-life/class/evidence/route) → render section + FAQPage JSON-LD. No fabrication — every answer derived from cited YAML. (R2, GEO, featured-snippet)
- [ ] D. RELATED-PLATES module: by shared categories/class, 4-6 descriptive-anchor links, works even without synergy (fixes 32/85 dead-ends). (R4)
- [ ] E. CLASS/CATEGORY HUB pages /catalog/[category]: intro + plate grid, sitemapped. (R4, class-level queries)
- [ ] F. molecular.ts → 85/85 via PubChem PUG (subagent gathers, Claude validates; skip low-confidence). (R5, GEO)
- [ ] G. Per-plate markdown endpoint /p/[slug]/llms.txt (or route) + llms-full.txt. (GEO/AI extractability)
- [ ] H. ping-google.ts (Indexing API, same creds pattern as storefront) wired into deploy:prod. (R1)
- [ ] I. Persona fix: replace fake "R. Hwang, Editor" (src/app/page.tsx:386) with honest editorial-team line. (R6 E-E-A-T)
- [ ] J. GSC verification meta stub in layout.tsx (token = Alex; staged). (R1)

## Compliance (hard)
RUO throughout: "protocols described in cited literature", never "what you should take"; no clinical/therapy/near-me framing. Every FAQ/quick-fact answer traces to an existing cited YAML field.

## Account-dependent (staged for Alex, not code-blockable)
GSC verification token + sitemap submission; Zenodo DOI dataset release; Wikidata QID creation; Reddit wiki seeding.

## Verify
`bun run build` green (prebuild audits pass) + `bun test test/` + tsc → Codex xhigh gate → Kimi final review → commit → `vercel --prod && bun run seo:indexnow` → prod 200 checks + view-source title/JSON-LD.

# DESIGN.md — PeptidesDB Specimen Atlas

> Living design system document. Captures the visual, typographic, and editorial
> rules behind PeptidesDB's "specimen atlas" aesthetic. Source of truth for
> design QA and Direction A community contributions.
>
> Last revised 2026-04-26.

---

## §  1 · Thesis

PeptidesDB is a **monograph**, not a SaaS app.

The aesthetic frame is a Werner-style botanical or mineralogical atlas crossed
with a Tufte data visualization: bone-white surface, hairline rules, restrained
typography, deterministic specimen motifs, citation density visible at a glance.

We optimize for the experience of reading a peer-reviewed reference, not the
experience of "using a website". Every interaction surface inherits this frame.
If a UI element doesn't earn its pixels in that frame, we cut it.

**The five guarantees we make to the reader:**

1. Every claim has a citation, or it is marked uncited.
2. Every typeface is a real typeface, never a system fallback.
3. Every divider is a hairline rule, never a box, shadow, or card outline.
4. Every interactive surface looks like editorial copy, not a CTA.
5. Every page is readable at print quality (`@media print` is a first-class target).

---

## §  2 · Typography

### Stack

| Role | Family | Usage |
|---|---|---|
| Display / serif | **Instrument Serif** | Page titles, plate names, italic emphasis, pull quotes, contribution call-to-action |
| Body / sans | **Geist** | All running prose, navigation, form labels, descriptive copy |
| Mono / caps | **JetBrains Mono** | Folios, labels, citations, tabular data, code, timestamps, contribution metadata |

All three load via `next/font/google` in `src/app/layout.tsx` with
`display: 'swap'` and CSS variables (`--font-instrument-serif`, `--font-geist`,
`--font-jetbrains-mono`).

### Type rules

- **Never use system stacks** (`-apple-system`, `Inter`, `Roboto`, `Arial`,
  `system-ui`). They are the "I gave up on typography" signal.
- **Italic Instrument Serif is reserved for emphasis** — pull quotes, taxonomic
  names ("*— an atlas*"), and call-to-action phrases. It must never function as
  body text.
- **JetBrains Mono is always all-uppercase + letter-spaced** when used as a
  label. Settings:
  - `font-family: 'JetBrains Mono', monospace`
  - `font-size: 11px` (sometimes 10px or 13px in specific contexts)
  - `letter-spacing: 0.22em`
  - `text-transform: uppercase`
  - `color: var(--at-soft)` typically
- **Geist is the only typeface with weight variation.** Use 400 for body, 500
  for inline emphasis, 600 sparingly for navigation active state.
- **Maximum line length: 720px** (≈ 75 characters at 16px). Wider than that and
  Atlas reads like a Word document.

### Type scales

```css
/* Display */
.at-display       → Instrument Serif 56–120px, weight 400, leading 0.95–1.0
.at-display-italic → Instrument Serif italic 24–48px

/* Headings */
h1                → 56–80px (display)
h2                → 28–32px (Instrument Serif)
h3                → 18–22px (Geist 600 or Instrument Serif 22px)

/* Body */
.at-prose         → Geist 16px / 1.6 leading
.at-prose-large   → Geist 18px / 1.55 leading (lede paragraphs)

/* Labels / captions */
.at-folio         → JetBrains Mono caps 11px / 0.22em letter-spacing
.at-mono-caption  → JetBrains Mono 13px / 0.18em letter-spacing
```

---

## §  3 · Color

### The bone-white surface

```css
--at-cream:    #f8f6f1;   /* page background */
--at-cream-2:  #f3f0e8;   /* nested surface, side panels, code blocks */
```

A page never has a pure white (#ffffff) or off-grey background. The faint
warmth (`#f8f6f1`) signals "monograph" instead of "screen".

**Background grain:** body has a subtle SVG noise texture overlay
(`radial-gradient` dots at very low opacity). Not paper-textured — just
non-flat. Don't add to nested surfaces.

### The ink

```css
--at-ink:    #0c1814;    /* primary text — nearly black with a green undertone */
--at-ink-2:  #1a2722;    /* secondary text — body copy that isn't headings */
--at-mute:   #4a5852;    /* descriptions, sub-labels */
--at-soft:   #7c8478;    /* mono-caps labels, timestamps, captions */
```

The four-tier ink scale gives every line of text a precise role. Body copy is
ink-2, not ink, to keep contrast away from "screaming". Headings are ink (full
contrast). Labels are soft (clearly subordinate).

### Hairlines

```css
--at-line:   #dcd6c8;   /* default rule color */
--at-line-2: #cfc8b6;   /* slightly stronger when the rule needs to read as a section break */
```

Hairlines are the **only** way Atlas separates content. Never use boxes,
backgrounds, or shadows. Default rule weight is `1px solid`. Section-break
rules are `2px solid var(--at-ink)`.

### The accent

```css
--at-gold: #b8865b;
```

One single accent color. Used for:
- Editor's emphasis in italic Instrument Serif (the gold letter `a` in *atlas*)
- Pull-quote left border (the only "colored left border" allowed)
- Drop caps in essay-style pages
- Hover state on contribution links

**Never use gold for buttons, badges, or backgrounds.** It loses its meaning if
it becomes a UI accent.

### Werner mineral pigments (per peptide class)

```css
--at-pigment-sage:   #869B7B   /* Actin-sequestering peptide */
--at-pigment-rust:   #B6663B   /* Growth-hormone secretagogue */
--at-pigment-teal:   #2A6F77   /* GLP-1 receptor agonist */
--at-pigment-ochre:  #C7A14A   /* (reserved) */
--at-pigment-plum:   #6B4D6F   /* (reserved) */
--at-pigment-smoke:  #5C6770   /* (reserved) */
--at-pigment-fern:   #4F7A4A   /* (reserved) */
--at-pigment-clay:   #9C5A3C   /* (reserved) */
--at-pigment-stone:  #8B8478   /* (reserved) */
```

These are the Werner-school mineral palette. Nine slots, each assigned to a
peptide class (lowercase index in `lib/peptide-motif.tsx`). When a plate page
loads, its class lookup determines the pigment used by:
- The hairline class swatch above the folio
- The specimen motif strokes/nodes
- The numbered contribution list section markers (`01 02 03` in sage on a sage
  plate)
- The catalog-page class header rule

**Never use a pigment outside its class context.** No "purple section divider"
because it looks nice. Pigments are taxonomic, not decorative.

---

## §  4 · Layout

### Page geometry

| Surface | Max width | Horizontal padding |
|---|---|---|
| Plate page (`/p/*`) | 880px | 64px |
| Catalog | 1100px | 64px |
| /compare side-by-side | 1280px | 48px |
| /stack designer | 1100px | 64px |
| /ask | 720px | 48px |
| /contribute | 720px | 64px |
| Home page (`/`) | 1200px (with internal grids) | 64px |

`max-w-7xl` (Tailwind) ≈ 1280px is the absolute cap. We do not span the full
viewport with content. Edge whitespace is part of the design.

### Vertical rhythm

- 64px between major sections (`§ I` / `§ II` / etc.)
- 32px between subsections
- 16px between paragraphs
- 8px between heading and first paragraph beneath it

### Grid

We use Tailwind's `grid` for catalog and compare layouts but never rely on
`grid` for editorial flow. Plates flow as document structure (block, no grid).

### No

- No border-radius. Anywhere.
- No box-shadow. Anywhere.
- No `text-align: center` on body content. Centering is reserved for the
  frontispiece masthead and plate masthead specifically.
- No icons in colored circles.
- No emoji as design elements.
- No "card" component. We have plates, blocks, and rules — no cards.

---

## §  5 · Spacing & rhythm

| Token | Pixel | Use |
|---|---|---|
| `space-1` | 4px | Tight pairing (label + value) |
| `space-2` | 8px | Stacked metadata |
| `space-3` | 12px | Inline elements |
| `space-4` | 16px | Inter-paragraph |
| `space-6` | 24px | Section heading + body |
| `space-8` | 32px | Subsection breaks |
| `space-12` | 48px | Section breaks |
| `space-16` | 64px | Page region breaks |
| `space-24` | 96px | Major page divisions (above colophon, etc.) |

We default to multiples of 4px. Never odd values (5px, 7px) — looks
hand-rolled in the wrong way.

---

## §  6 · The specimen motif

Each peptide gets a deterministic SVG fingerprint:

- **Hash**: FNV-1a of the slug string → 32-bit unsigned int
- **12 nodes** arranged on a circle of radius `motifSize * 0.34`
- **Node jitter**: each node's radius offset by `((hash >> (i*2)) & 0x07) - 3.5)`
  pixels (deterministic per slug)
- **Inner spokes**: every 3rd node has a spoke to a smaller inner circle
- **Big-dot toggle**: each node is "big" or "small" based on `(hash >> (i+4)) & 1`
- **Color**: pigment-of-class (sage / rust / teal / etc.) at varying opacities
- **Center dot**: solid pigment, fixed radius

The same slug always produces the same motif — that's the contract. Don't
introduce randomness or seed via Date.now(). Pixel-identical between in-page
render (`lib/peptide-motif.tsx`) and OG card render (`/p/[slug]/opengraph-image.tsx`).

---

## §  7 · Helper class catalog

Defined in `src/app/globals.css`:

| Class | Purpose |
|---|---|
| `.at-display` | Instrument Serif large display — 56–120px |
| `.at-display-italic` | Instrument Serif italic — for emphasis phrases |
| `.at-mono` | JetBrains Mono caps label — 11px / 0.22em |
| `.at-folio` | The numbered section marker — `§ III · b` style |
| `.at-link` | Italic Instrument Serif link with optional gold hover |
| `.at-card` | Plate-card preview (catalog grid items) — flat, hairline-bordered |
| `.at-plate` | Animation-ready entry transition for new plate views |
| `.at-spark` | Tufte sparkline container |
| `.at-swatch` | Werner pigment swatch with class label |

When in doubt, **inspect a section in `src/app/page.tsx` to see the canonical
usage**, then mirror it. Don't invent new helpers without strong justification.

---

## §  8 · Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Atlas honors `prefers-reduced-motion: reduce`. All animations collapse to ~0ms.

The only intentional motion in the canonical surfaces:
- Plate-page entry: 220ms `at-plate` fade-in
- Hover transitions on `at-link`: 150ms color change
- Catalog grid item reveal: 180ms staggered (delay-X) for the first 12 items

**Never** add scroll-jacking, parallax, scroll-linked animation, or auto-play
video. The page is a still document — animation is for orientation only.

---

## §  9 · Print

`@media print` defined in `globals.css`. The atlas is intentionally
print-friendly:

- Background grain hidden
- All surface backgrounds → white
- Class pigment swatches → kept (color print preserves brand)
- Hairlines → preserved at full weight
- Specimen motif → preserved at full size
- Footer / header → hidden (page comes from the document, not the chrome)

Tested at A4 and US Letter. A plate page prints to ~3 pages clean.

---

## § 10 · Accessibility

### Current state (2026-04-26)

- Keyboard navigation works for all anchor and button elements (default
  behavior preserved)
- Color contrast: bone-white #f8f6f1 vs ink #0c1814 = WCAG AAA at all sizes
- Mute (#4a5852) and soft (#7c8478) on cream pass AA at 14px+ but **not** at
  smaller sizes — keep folio labels at 11px+ minimum
- Print rendering preserved (good for screen readers using print CSS)
- `prefers-reduced-motion` respected globally

### Known gaps (TODO)

- SVG specimen motifs lack `<title>` / `<desc>` elements — screen readers see
  nothing. Add `<title>{peptide.name} specimen motif</title>` to each
- `aria-label` coverage is thin (6 instances total). Audit per-route
- No skip-to-content link in `AtlasHeader.tsx`. Add one
- Heading semantics need a pass: every plate page should have exactly one `h1`
- Form fields in `ReconstitutionCalculator.tsx` have `aria-label` ✓ but no
  visible label connection via `<label htmlFor>`. Add for screen-reader UX

### Direction A specific

- Per-plate contribution block: each link must have a clear text purpose
  (`Suggest an edit on GitHub` ✓), no aria-label needed unless the visible text
  is decorative
- `/contribute` page: section headings must be `<h2>`, with the `§ 0X` mono
  caps as `<span class="num">` inside the h2 (semantic, not just visual)
- Screencast video must have `<track kind="captions">` if audio is added.
  Currently silent loop, so no captions needed but include `aria-label` on the
  `<video>` element

---

## § 11 · Do / Don't summary

### ✅ Do

- Use Instrument Serif italic for *bespoke editorial emphasis*
- Use hairline rules (`1px solid var(--at-line)`) as the primary divider
- Use the Werner pigment system for class-level accents
- Honor `prefers-reduced-motion`
- Mirror existing component conventions in `src/components/`
- Maintain print fidelity
- Document new design tokens here when adding them

### ❌ Don't

- Add system-stack font fallbacks (`-apple-system`, `Inter`, etc.)
- Add border-radius
- Add box-shadow
- Add cards with colored left borders (except the gold pull-quote sidenote)
- Use a Werner pigment outside its peptide class context
- Use the gold accent for UI buttons or backgrounds
- Use icons in colored circles
- Use emoji as design elements
- Use hero copy like "Welcome to PeptidesDB" or "Your all-in-one peptide
  reference"
- Center body copy
- Add scroll-jacking, parallax, or auto-play video

---

## § 12 · Adding new components

When you add a new visual surface (page, component, section):

1. **Inspect** `src/components/site/AtlasHeader.tsx`, `AtlasFooter.tsx`, and
   `src/app/page.tsx` for canonical patterns
2. **Reuse** existing helper classes (`at-folio`, `at-link`, `at-display`)
3. **Use** CSS variables from `:root` (never inline hex colors)
4. **Add** a TODO entry to this document if you introduce a new pattern,
   describing why and when to use it
5. **Test** against the do/don't list above

If you're tempted to add a new color, font, or shape: stop. Write a one-line
justification in the PR description. The atlas grows by addition only when the
addition is provably necessary.

---

## § 13 · Citing this document

When reviewing a PR, you can cite specific sections:
- `DESIGN.md § 4` for layout rules
- `DESIGN.md § 6` for the motif spec
- `DESIGN.md § 11` for the do/don't list
- `DESIGN.md § 14` for the bioregulator framing policy

The atlas is a community manuscript. So is its design system.

## § 14 · Editorial policy: weak-evidence peptides

Some peptides in the atlas have a credible but non-Western evidence base.
The Khavinson-school bioregulators (Cartalax, Bronchogen, Livagen, etc.)
are the canonical case: decades of Russian-language clinical research,
limited PubMed indexing, no FDA filings. Excluding them would make the
atlas incomplete. Including them at the same evidentiary bar as
Tesamorelin (NEJM RCT) would be dishonest.

This section sets the policy.

### The honest framing, in one sentence

> *Evidence base: Russian-language clinical literature, primarily from
> the St. Petersburg Institute of Bioregulation and Gerontology (Khavinson
> school), 1985 onward. Not extensively peer-reviewed in Western journals.*

Render that line — verbatim — at the head of the Evidence section of
every plate where the peptide-level `evidence_tier` is `theoretical` or
`animal` AND the citation registry contains entries from the Khavinson
school (any cited reference with `russian_journal_ref` set).

### Typography

Italic Instrument Serif at body size, no quote marks, hairline rule
above and below. Treat it the same as a Tufte sidenote: the reader sees
it before any specific claim, sets expectations, then proceeds.

### What the reader should NOT see

- No editorial value judgment ("only", "merely", "limited" stripped of context)
- No "alternative medicine" framing
- No quotes around claims
- No skull-and-crossbones, warnings, or color-coded "low quality" tags
- No paywall pattern ("contact us for more information")

The reader is a researcher. They will draw their own conclusions from
the citation list. Our job is to set the literature context, not to
pre-judge the evidence.

### What gets cited, what gets uncited

A claim sourced to a Russian-language paper IS cited (per § 1 guarantee),
even when the paper isn't on PubMed. The `cite` field accepts entries
without a `pmid` if a `doi` or `russian_journal_ref` exists in
`content/refs.yaml`. Claims with no source at all stay marked uncited
(per § 1) — the same as any other plate.

### Coexistence with per-claim `evidence_level`

Per-claim `evidence_level` (the existing 8-tier enum: `fda-approved` /
`phase-3` / `phase-2` / `phase-1` / `animal-strong` / `animal-mechanistic` /
`human-mechanistic` / `theoretical`) is the authoritative rating for that
specific claim. The peptide-level `evidence_tier` is a 4-bucket derived
summary: `max(evidence_level)` across `mechanism`, `dosage`, `fat_loss`,
and `side_effects` sections, bucketed to `fda-approved` / `clinical` /
`animal` / `theoretical`. Computed at build time in `peptide-stats.ts`
via `computeEvidenceTier()`. Never set manually.

### When to revisit

If a Khavinson-school peptide gets a Western RCT (rare but possible),
the citation chain auto-suppresses the framing as soon as
`computeEvidenceTier()` rolls up to `clinical` or `fda-approved`. No
manual edit needed — the conditional render rule above handles it.

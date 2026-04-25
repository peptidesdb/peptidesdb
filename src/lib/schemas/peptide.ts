import { z } from "zod";

/* =========================================================
   PeptideDB schemas
   Single source of truth for content/peptides/*.yaml shape.
   Every field is documented because contributors will read this.
   ========================================================= */

/**
 * Stable citation reference. Resolved against content/refs.yaml at build.
 * Example: { ref: "falutz-2007" } → links out to NEJM PubMed.
 */
export const CiteRef = z.string().min(1);
export type CiteRef = z.infer<typeof CiteRef>;

/**
 * Cell value with optional citation list. Used in tables, info-blocks,
 * and stat blocks. The `cite` array can be empty for non-claim cells
 * (e.g. column headers, layout strings).
 */
export const CitableValue = z.union([
  z.string(),
  z.object({
    value: z.string(),
    cite: z.array(CiteRef).optional(),
    badge: z.enum(["green", "yellow", "red", "teal", "blue", "purple"]).optional(),
    note: z.string().optional(),
  }),
]);
export type CitableValue = z.infer<typeof CitableValue>;

/**
 * Evidence rubric — the formal grade for each claim or peptide.
 * Inspired by FDA evidence pyramid + GRADE clinical guidelines.
 */
export const EvidenceLevel = z.enum([
  "fda-approved", // Phase 3 + FDA label
  "phase-3", // Completed Phase 3, regulatory pending
  "phase-2", // Phase 2 trial data
  "phase-1", // Phase 1 only
  "animal-strong", // Multiple animal studies converging
  "animal-mechanistic", // Single or limited animal data
  "human-mechanistic", // Mechanistic human studies (in vitro biopsies, etc.)
  "anecdotal", // Community / case reports only
  "theoretical", // No empirical data, mechanism-derived only
]);
export type EvidenceLevel = z.infer<typeof EvidenceLevel>;

/**
 * Quick-card stat shown in the hero. Three per peptide.
 * Example: { value: "2 mg", label: "Daily dose" }
 */
export const QuickStat = z.object({
  value: z.string(),
  label: z.string(),
  cite: z.array(CiteRef).optional(),
});
export type QuickStat = z.infer<typeof QuickStat>;

/**
 * Mechanism diagram node. The reference renders these as a
 * vertical chain with ↓ arrows between them (see mech-node + mech-arrow
 * in reference style.css). `kind` controls visual treatment.
 */
export const DiagramStep = z.object({
  kind: z.enum(["node", "arrow", "outcome"]),
  text: z.string(),
});
export type DiagramStep = z.infer<typeof DiagramStep>;

export const MechanismSection = z.object({
  primary_target: CitableValue,
  pathway: CitableValue,
  downstream_effect: CitableValue,
  origin: CitableValue.optional(),
  feedback_intact: CitableValue.optional(),
  antibody_development: CitableValue.optional(),
  receptor_class: CitableValue.optional(),
  half_life_basis: CitableValue.optional(),
  /** Free-form rows beyond the structured fields above. Order preserved. */
  extra_rows: z.array(z.object({ key: z.string(), value: CitableValue })).optional(),
  /** Vertical pathway diagram. Optional but recommended. */
  diagram: z.array(DiagramStep).optional(),
});
export type MechanismSection = z.infer<typeof MechanismSection>;

/**
 * Generic table row used in dosage / fat-loss / side-effects.
 * Cell values can be plain strings or CitableValue.
 */
export const TableRow = z.object({
  parameter: z.string(),
  value: CitableValue,
  notes: z.string().optional(),
  severity: z.enum(["mild", "moderate", "severe"]).optional(),
});
export type TableRow = z.infer<typeof TableRow>;

export const DosageSection = z.object({
  rows: z.array(TableRow),
});
export type DosageSection = z.infer<typeof DosageSection>;

export const FatLossSection = z.object({
  /** Evidence strength 0–100 — drives the animated bar. */
  evidence_strength: z.number().min(0).max(100),
  evidence_level: EvidenceLevel,
  evidence_meta: z.string(),
  rows: z.array(TableRow),
});
export type FatLossSection = z.infer<typeof FatLossSection>;

export const SideEffectsSection = z.object({
  rows: z.array(TableRow),
  contraindications_absolute: z.array(z.string()).optional(),
  contraindications_relative: z.array(z.string()).optional(),
});
export type SideEffectsSection = z.infer<typeof SideEffectsSection>;

export const AdminStep = z.object({
  title: z.string(),
  body: z.string(),
});
export type AdminStep = z.infer<typeof AdminStep>;

export const AdministrationSection = z.object({
  steps: z.array(AdminStep),
});
export type AdministrationSection = z.infer<typeof AdministrationSection>;

/**
 * Synergy stack — peptide pair (or trio+) with rationale and per-peptide
 * protocol. The `partner` field references another peptide slug; if the
 * partner exists in the catalog, the page links to it.
 */
export const StackProtocol = z.object({
  partner_slug: z.string(),
  partner_label: z.string(),
  /** Strong / Moderate / Weak — drives the synergy badge color. */
  synergy: z.enum(["strong", "moderate", "weak", "multi-pathway"]),
  rationale: z.string(),
  protocol: z.record(z.string(), z.string()),
  primary_benefit: z.string(),
  cite: z.array(CiteRef).optional(),
});
export type StackProtocol = z.infer<typeof StackProtocol>;

export const SynergySection = z.object({
  stacks: z.array(StackProtocol),
});
export type SynergySection = z.infer<typeof SynergySection>;

/**
 * Full peptide profile schema. Every content/peptides/*.yaml file
 * must validate against this. Build fails on PR if it doesn't.
 */
export const Peptide = z.object({
  /** Schema version for forward compatibility. Bump on breaking changes. */
  schema_version: z.literal(1),

  /** URL slug. lowercase, hyphenated, unique. e.g. "tesamorelin". */
  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9][a-z0-9-]*$/, "slug must be lowercase + hyphens"),

  /** Display name. e.g. "Tesamorelin". */
  name: z.string().min(2),

  /** Peptide class string. e.g. "GHRH Analogue". */
  peptide_class: z.string().min(2),

  /** Short tagline. e.g. "Mitokine · Mitochondria-Encoded". */
  classification: z.string().optional(),

  /** Categories (multiple OK). Drives /category/[cat] pages. */
  categories: z.array(z.string()).default([]),

  /** Aliases / brand names / synonyms for search. */
  aliases: z.array(z.string()).default([]),

  /**
   * Color identity. Drives quick-card border, badge, evidence-bar fill.
   * Pick the closest brand-aligned token. Default = "blue".
   */
  color: z
    .enum(["blue", "green", "purple", "amber", "rose", "cyan", "teal"])
    .default("blue"),

  /** Top-level evidence rubric — used for filtering + badges. */
  evidence_level: EvidenceLevel,

  /** Approval status — affects hero badge ("FDA-Approved" etc). */
  fda_approved: z.boolean().default(false),
  approval_year: z.number().optional(),

  /** ISO date last reviewed by a contributor. */
  last_reviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

  /** Short description shown on hero, list pages, OG cards. */
  summary: z.string().min(40).max(500),

  /** Three quick stats for hero card. Always exactly 3. */
  hero_stats: z.array(QuickStat).length(3),

  /** Bottom line of hero card. e.g. "SQ · Abdomen · Once Daily". */
  hero_route: z.string(),

  /** Six section blocks — match reference dashboard taxonomy. */
  mechanism: MechanismSection,
  dosage: DosageSection,
  fat_loss: FatLossSection.optional(),
  side_effects: SideEffectsSection,
  administration: AdministrationSection,
  synergy: SynergySection.optional(),

  /** Prose long-form. Markdown. Renders below hero, above sections. */
  description_md: z.string().optional(),

  /** Maturity tier — drives the "Verified / Reviewed / Draft" badge. */
  maturity: z.enum(["draft", "reviewed", "verified"]).default("draft"),

  /** Contributors who have edited this entry (GitHub usernames). */
  contributors: z.array(z.string()).default([]),
});
export type Peptide = z.infer<typeof Peptide>;

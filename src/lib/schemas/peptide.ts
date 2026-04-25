import { z } from "zod";

/* =========================================================
   PeptideDB schemas
   Single source of truth for content/peptides/*.yaml shape.
   Every field is documented because contributors will read this.

   DESIGN NOTE: CitableValue is ALWAYS an object — `{ value, cite,
   badge?, note? }`. Plain strings are reserved for clearly
   decorative labels (table column headings, section labels, etc).
   This makes "this claim has no citation" mechanically queryable
   at every layer (build, API, UI), and the trust promise of
   PeptideDB becomes machine-enforceable rather than aspirational.
   ========================================================= */

/**
 * Stable citation reference. Resolved against content/refs.yaml at build.
 * Example: { ref: "falutz-2007" } → links out to NEJM PubMed.
 */
export const CiteRef = z.string().min(1);
export type CiteRef = z.infer<typeof CiteRef>;

/**
 * Claim-bearing value. AFTER PARSE this is ALWAYS an object — even when
 * uncited, the empty `cite: []` array makes the absence of citation
 * explicit and programmatically queryable. INPUT YAML accepts either:
 *   - terse string: "2 mg / day"   (auto-wrapped to { value, cite: [] })
 *   - explicit object: { value: "2 mg / day", cite: ["fda-..."], badge: "green" }
 * Either way, the parsed output shape is identical.
 *
 * Fields:
 * - `value`: rendered string ("2 mg / day", "Visceral adipose tissue", etc)
 * - `cite`: array of citation IDs from content/refs.yaml (empty = uncited)
 * - `badge`: optional severity / status color
 * - `note`: optional inline annotation rendered in muted italic
 */
export const CitableValue = z.preprocess(
  (input) =>
    typeof input === "string"
      ? { value: input, cite: [] }
      : input,
  z.object({
    value: z.string().min(1),
    cite: z.array(CiteRef).default([]),
    badge: z.enum(["green", "yellow", "red", "teal", "blue", "purple"]).optional(),
    note: z.string().optional(),
  }),
);
export type CitableValue = z.infer<typeof CitableValue>;

/**
 * Plain decorative label. Use for column headings, parameter names, etc.
 * Cannot carry a citation — those go through CitableValue.
 */
export const TextLabel = z.string().min(1);
export type TextLabel = z.infer<typeof TextLabel>;

/**
 * Evidence rubric — the formal grade for each claim or peptide.
 * Inspired by FDA evidence pyramid + GRADE clinical guidelines.
 */
export const EvidenceLevel = z.enum([
  "fda-approved",
  "phase-3",
  "phase-2",
  "phase-1",
  "animal-strong",
  "animal-mechanistic",
  "human-mechanistic",
  "anecdotal",
  "theoretical",
]);
export type EvidenceLevel = z.infer<typeof EvidenceLevel>;

/**
 * Hero quick-card stat. Three per peptide.
 * Example: { value: "2 mg", label: "Daily dose", cite: ["fda-egrifta-label-2010"] }
 */
export const QuickStat = z.object({
  value: z.string(),
  label: TextLabel,
  cite: z.array(CiteRef).default([]),
});
export type QuickStat = z.infer<typeof QuickStat>;

/**
 * Mechanism diagram step. Reference renders as vertical chain with arrows.
 */
export const DiagramStep = z.object({
  kind: z.enum(["node", "arrow", "outcome"]),
  text: z.string().min(1),
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
  extra_rows: z
    .array(z.object({ key: TextLabel, value: CitableValue }))
    .optional(),
  /** Vertical pathway diagram. Optional but recommended. */
  diagram: z.array(DiagramStep).optional(),
});
export type MechanismSection = z.infer<typeof MechanismSection>;

/**
 * Generic claim-bearing table row (dosage / fat-loss / side-effects).
 * `parameter` is a plain label; `value` and `notes` are CitableValues
 * (either accepts terse string or explicit object via preprocess).
 * Notes ride alongside the main value to add context — both are claims
 * and both contribute to the citation density audit.
 */
export const TableRow = z.object({
  parameter: TextLabel,
  value: CitableValue,
  notes: CitableValue.optional(),
  severity: z.enum(["mild", "moderate", "severe"]).optional(),
});
export type TableRow = z.infer<typeof TableRow>;

export const DosageSection = z.object({
  rows: z.array(TableRow),
});
export type DosageSection = z.infer<typeof DosageSection>;

export const FatLossSection = z.object({
  evidence_strength: z.number().min(0).max(100),
  evidence_level: EvidenceLevel,
  evidence_meta: z.string().min(1),
  rows: z.array(TableRow),
});
export type FatLossSection = z.infer<typeof FatLossSection>;

export const SideEffectsSection = z.object({
  rows: z.array(TableRow),
  /**
   * Contraindications now accept either terse strings (back-compat) or
   * explicit { value, cite, badge?, note? } objects. Output is always
   * object-shaped so the trust metric can include them.
   */
  contraindications_absolute: z.array(CitableValue).optional(),
  contraindications_relative: z.array(CitableValue).optional(),
});
export type SideEffectsSection = z.infer<typeof SideEffectsSection>;

export const AdminStep = z.object({
  title: TextLabel,
  body: z.string().min(1),
  /** Optional citations for protocol guidance (vial label, FDA, etc). */
  cite: z.array(CiteRef).default([]),
});
export type AdminStep = z.infer<typeof AdminStep>;

export const AdministrationSection = z.object({
  steps: z.array(AdminStep),
});
export type AdministrationSection = z.infer<typeof AdministrationSection>;

/**
 * Synergy stack — peptide pair with rationale and per-peptide protocol.
 */
export const StackProtocol = z.object({
  partner_slug: z.string(),
  partner_label: TextLabel,
  synergy: z.enum(["strong", "moderate", "weak", "multi-pathway"]),
  rationale: z.string().min(40),
  protocol: z.record(z.string(), z.string()),
  primary_benefit: z.string().min(4),
  cite: z.array(CiteRef).default([]),
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
  schema_version: z.literal(1),

  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9][a-z0-9-]*$/, "slug must be lowercase + hyphens"),

  name: z.string().min(2),
  peptide_class: z.string().min(2),
  classification: z.string().optional(),
  categories: z.array(z.string()).default([]),
  aliases: z.array(z.string()).default([]),

  color: z
    .enum(["blue", "green", "purple", "amber", "rose", "cyan", "teal"])
    .default("blue"),

  evidence_level: EvidenceLevel,
  fda_approved: z.boolean().default(false),
  approval_year: z.number().optional(),

  last_reviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

  summary: z.string().min(40).max(500),

  hero_stats: z.array(QuickStat).length(3),
  hero_route: z.string().min(4),

  mechanism: MechanismSection,
  dosage: DosageSection,
  fat_loss: FatLossSection.optional(),
  side_effects: SideEffectsSection,
  administration: AdministrationSection,
  synergy: SynergySection.optional(),

  description_md: z.string().optional(),

  maturity: z.enum(["draft", "reviewed", "verified"]).default("draft"),
  contributors: z.array(z.string()).default([]),
});
export type Peptide = z.infer<typeof Peptide>;

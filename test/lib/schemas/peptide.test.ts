import { describe, expect, test } from "bun:test";
import { EvidenceLevel, Peptide } from "@/lib/schemas/peptide";

/* =========================================================
   Schema unit tests for D15 (compliance fence at build time).

   Two locked decisions verified here:
     1. EvidenceLevel enum no longer accepts "anecdotal" — only
        "theoretical" is the lowest legitimate tier.
     2. Peptide.contributors[] strings must match the GitHub-handle
        regex per D6 (handle-only display) + D9 (welcome-bot drives
        contributors via PR author handle).
   ========================================================= */

describe("EvidenceLevel enum (D15)", () => {
  test("does not allow 'anecdotal'", () => {
    expect(EvidenceLevel.safeParse("anecdotal").success).toBe(false);
  });

  test("allows 'theoretical' as the lowest tier", () => {
    expect(EvidenceLevel.safeParse("theoretical").success).toBe(true);
  });

  test("allows 'fda-approved'", () => {
    expect(EvidenceLevel.safeParse("fda-approved").success).toBe(true);
  });

  test("rejects unknown values", () => {
    expect(EvidenceLevel.safeParse("unknown-tier").success).toBe(false);
  });
});

/* ---------------------------------------------------------
   Minimal-but-valid Peptide fixture. Override `contributors`
   per-test to exercise just that field's validation.
   --------------------------------------------------------- */
const validPeptide = {
  schema_version: 1 as const,
  slug: "test-peptide",
  name: "Test Peptide",
  peptide_class: "Test Class",
  evidence_level: "theoretical" as const,
  last_reviewed: "2026-04-26",
  summary: "Test summary.",
  hero_stats: [
    { value: "1 mg", label: "Dose" },
    { value: "Phase 1", label: "Evidence" },
    { value: "1 hr", label: "Half-life" },
  ],
  hero_route: "SQ · Site · Daily",
  mechanism: {
    primary_target: "Receptor X",
    pathway: "A → B",
    downstream_effect: "Outcome",
  },
  dosage: {
    rows: [{ parameter: "Dose", value: "1 mg" }],
  },
  side_effects: {
    rows: [{ parameter: "Effect", value: "Mild" }],
  },
  administration: {
    steps: [{ title: "Inject", body: "Inject SQ." }],
  },
};

describe("contributors field (D15 + D6 + D9)", () => {
  test("accepts plain GitHub handle 'AnomanderR'", () => {
    const result = Peptide.safeParse({
      ...validPeptide,
      contributors: ["AnomanderR"],
    });
    expect(result.success).toBe(true);
  });

  test("accepts @-prefixed handle '@AnomanderR'", () => {
    const result = Peptide.safeParse({
      ...validPeptide,
      contributors: ["@AnomanderR"],
    });
    expect(result.success).toBe(true);
  });

  test("accepts hyphenated handle 'alex-rotaru'", () => {
    const result = Peptide.safeParse({
      ...validPeptide,
      contributors: ["alex-rotaru"],
    });
    expect(result.success).toBe(true);
  });

  test("accepts the placeholder author 'peptidesdb-core'", () => {
    const result = Peptide.safeParse({
      ...validPeptide,
      contributors: ["peptidesdb-core"],
    });
    expect(result.success).toBe(true);
  });

  test("rejects free-form name with space 'Alex Rotaru'", () => {
    const result = Peptide.safeParse({
      ...validPeptide,
      contributors: ["Alex Rotaru"],
    });
    expect(result.success).toBe(false);
  });

  test("rejects email 'alex@example.com'", () => {
    const result = Peptide.safeParse({
      ...validPeptide,
      contributors: ["alex@example.com"],
    });
    expect(result.success).toBe(false);
  });

  test("rejects empty string", () => {
    const result = Peptide.safeParse({
      ...validPeptide,
      contributors: [""],
    });
    expect(result.success).toBe(false);
  });

  test("rejects underscore handle 'user_name' (modern GH handles disallow _)", () => {
    const result = Peptide.safeParse({
      ...validPeptide,
      contributors: ["user_name"],
    });
    expect(result.success).toBe(false);
  });

  test("accepts empty contributors array (default)", () => {
    const result = Peptide.safeParse({
      ...validPeptide,
      contributors: [],
    });
    expect(result.success).toBe(true);
  });
});

import { describe, expect, test } from "bun:test";
import {
  PlateDrafter,
  extractJsonBlock,
  generateCitationId,
  recordToCandidate,
  slugify,
  type Candidate,
} from "../../scripts/lib/draft-plate";
import type { Peptide } from "../../src/lib/schemas/peptide";
import type { AnthropicLike } from "../../scripts/lib/claim-linker";
import type { PubmedRecord } from "../../scripts/lib/pubmed-client";

/* ============================================================
   Pure helpers
   ============================================================ */

describe("slugify", () => {
  test("simple lowercase", () => {
    expect(slugify("Cagrilintide")).toBe("cagrilintide");
  });

  test("hyphenates spaces", () => {
    expect(slugify("Thymosin Alpha-1")).toBe("thymosin-alpha-1");
  });

  test("strips dose suffixes (mg/mcg)", () => {
    expect(slugify("Glutathione 1500mg")).toBe("glutathione");
    expect(slugify("PT-141 10mg")).toBe("pt-141");
    expect(slugify("Tesofensine 500mcg")).toBe("tesofensine");
  });

  test("collapses multiple separators", () => {
    expect(slugify("MT-2 (Melanotan 2 Acetate)")).toBe("mt-2-melanotan-2-acetate");
  });

  test("trims leading/trailing hyphens", () => {
    expect(slugify("-hello-")).toBe("hello");
  });
});

describe("generateCitationId", () => {
  test("produces lastname-year for a typical author", () => {
    const r: PubmedRecord = {
      pmid: "18057338",
      title: "x",
      firstAuthor: "Falutz J",
      pubdate: "2007 Dec 6",
      year: 2007,
      journal: "NEJM",
    };
    expect(generateCitationId(r)).toBe("falutz-2007");
  });

  test("strips non-alpha characters from the lastname", () => {
    const r: PubmedRecord = {
      pmid: "1",
      title: "x",
      firstAuthor: "O'Brien M",
      pubdate: null,
      year: 2020,
      journal: null,
    };
    expect(generateCitationId(r)).toBe("obrien-2020");
  });

  test("falls back to 'anon-0000' when author + year missing", () => {
    const r: PubmedRecord = {
      pmid: "1",
      title: "x",
      firstAuthor: null,
      pubdate: null,
      year: null,
      journal: null,
    };
    expect(generateCitationId(r)).toBe("anon-0000");
  });
});

describe("recordToCandidate", () => {
  test("packages PubmedRecord + abstract into a Candidate with auto citation_id", () => {
    const r: PubmedRecord = {
      pmid: "30293770",
      title: "Tirzepatide phase 2",
      firstAuthor: "Frias JP",
      pubdate: "2018",
      year: 2018,
      journal: "Lancet",
    };
    const c = recordToCandidate(r, "BACKGROUND: ...");
    expect(c.citation_id).toBe("frias-2018");
    expect(c.pmid).toBe("30293770");
    expect(c.year).toBe(2018);
    expect(c.abstract).toBe("BACKGROUND: ...");
  });
});

describe("extractJsonBlock", () => {
  test("prefers ```json fenced block", () => {
    expect(extractJsonBlock('Here:\n```json\n{"a": 1}\n```\nthanks')).toBe('{"a": 1}');
  });

  test("falls back to first balanced object", () => {
    expect(extractJsonBlock('preface {"a":{"b":2}} trailing')).toBe('{"a":{"b":2}}');
  });

  test("returns null when no JSON found", () => {
    expect(extractJsonBlock("this has no braces at all")).toBeNull();
  });

  test("returns null on unbalanced braces", () => {
    expect(extractJsonBlock("{ unclosed")).toBeNull();
  });
});

/* ============================================================
   PlateDrafter — mocked Anthropic
   ============================================================ */

const VALID_DRAFT_JSON = `\`\`\`json
{
  "schema_version": 1,
  "slug": "cagrilintide",
  "name": "Cagrilintide",
  "peptide_class": "Amylin analog",
  "categories": ["GLP-1"],
  "aliases": ["AM833"],
  "color": "rose",
  "evidence_level": "phase-2",
  "fda_approved": false,
  "last_reviewed": "2026-04-27",
  "summary": { "value": "Amylin analog studied with semaglutide for weight loss.", "cite": ["frias-2018"] },
  "hero_route": { "value": "SQ · Once Weekly", "cite": [] },
  "hero_stats": [
    { "value": "2.4 mg", "label": "Weekly dose", "cite": [] },
    { "value": "Phase 2", "label": "Evidence stage", "cite": [] },
    { "value": "~6 days", "label": "Half-life", "cite": [] }
  ],
  "mechanism": {
    "primary_target": { "value": "Amylin and calcitonin receptors", "cite": ["frias-2018"] },
    "pathway": { "value": "Slows gastric emptying + reduces postprandial glucose", "cite": [] },
    "downstream_effect": { "value": "Increased satiety + weight reduction", "cite": [] }
  },
  "dosage": { "rows": [{ "parameter": "Weekly", "value": { "value": "2.4 mg", "cite": [] } }] },
  "side_effects": { "rows": [{ "parameter": "GI", "value": { "value": "Nausea common", "cite": [] } }] },
  "administration": { "steps": [{ "title": "Inject", "body": "Subcutaneous, weekly.", "cite": [] }] },
  "maturity": "auto-drafted",
  "contributors": []
}
\`\`\``;

const STYLE_EXAMPLE: Peptide = {
  schema_version: 1,
  slug: "tesamorelin",
  name: "Tesamorelin",
  peptide_class: "GHRH analog",
  evidence_level: "fda-approved",
  fda_approved: true,
  approval_year: 2010,
  last_reviewed: "2026-04-27",
  summary: { value: "FDA-approved GHRH analog.", cite: [] },
  hero_route: { value: "SQ · Once Daily", cite: [] },
  hero_stats: [
    { value: "2 mg", label: "Daily dose", cite: [] },
    { value: "26 wk", label: "Trial length", cite: [] },
    { value: "~30 min", label: "Half-life", cite: [] },
  ],
  mechanism: {
    primary_target: { value: "GHRH receptor", cite: [] },
    pathway: { value: "GH → IGF-1 axis", cite: [] },
    downstream_effect: { value: "Visceral fat reduction", cite: [] },
  },
  dosage: { rows: [{ parameter: "Daily", value: { value: "2 mg", cite: [] } }] },
  side_effects: { rows: [{ parameter: "Local", value: { value: "Mild irritation", cite: [] } }] },
  administration: { steps: [{ title: "Inject", body: "SQ daily.", cite: [] }] },
  categories: [],
  aliases: [],
  color: "blue",
  contributors: [],
  maturity: "human-reviewed",
};

const FRIAS_CANDIDATE: Candidate = {
  citation_id: "frias-2018",
  pmid: "30293770",
  title: "Efficacy and safety of LY3298176 (tirzepatide) in T2D",
  year: 2018,
  authors: "Frias JP",
  abstract: "BACKGROUND: ...",
};

const UNUSED_CANDIDATE: Candidate = {
  citation_id: "smith-2020",
  pmid: "12345678",
  title: "Other paper",
  year: 2020,
  authors: "Smith A",
  abstract: "...",
};

function mockAnthropic(responder: (callIdx: number) => string): {
  client: AnthropicLike;
  calls: Array<{ messages: unknown[] }>;
} {
  const calls: Array<{ messages: unknown[] }> = [];
  const client: AnthropicLike = {
    messages: {
      create: async (params) => {
        calls.push({ messages: params.messages });
        return { content: [{ type: "text", text: responder(calls.length - 1) }] };
      },
    },
  };
  return { client, calls };
}

describe("PlateDrafter.draft", () => {
  test("produces a Zod-valid Peptide on first attempt", async () => {
    const { client } = mockAnthropic(() => VALID_DRAFT_JSON);
    const drafter = new PlateDrafter();
    const result = await drafter.draft({
      name: "Cagrilintide",
      candidates: [FRIAS_CANDIDATE],
      styleExample: STYLE_EXAMPLE,
      anthropic: client,
    });
    expect(result.peptide.slug).toBe("cagrilintide");
    expect(result.peptide.maturity).toBe("auto-drafted");
    expect(result.yaml).toContain("slug: cagrilintide");
  });

  test("returns only the candidates that the draft actually cited", async () => {
    const { client } = mockAnthropic(() => VALID_DRAFT_JSON);
    const drafter = new PlateDrafter();
    const result = await drafter.draft({
      name: "Cagrilintide",
      candidates: [FRIAS_CANDIDATE, UNUSED_CANDIDATE],
      styleExample: STYLE_EXAMPLE,
      anthropic: client,
    });
    expect(result.newCitations).toHaveLength(1);
    expect(result.newCitations[0].id).toBe("frias-2018");
    expect(result.newCitations[0].pmid).toBe("30293770");
    expect(result.warnings.some((w) => w.includes("not cited"))).toBe(true);
  });

  test("retries on Zod validation failure with the error appended", async () => {
    const INVALID_FIRST_VALID_SECOND = (idx: number) => {
      if (idx === 0) {
        return '```json\n{ "schema_version": 1, "slug": "x" }\n```';
      }
      return VALID_DRAFT_JSON;
    };
    const { client, calls } = mockAnthropic(INVALID_FIRST_VALID_SECOND);
    const drafter = new PlateDrafter();
    const result = await drafter.draft({
      name: "Cagrilintide",
      candidates: [FRIAS_CANDIDATE],
      styleExample: STYLE_EXAMPLE,
      anthropic: client,
    });
    expect(result.peptide.slug).toBe("cagrilintide");
    expect(calls).toHaveLength(2);
    const retryMessages = calls[1].messages as Array<{ content: string }>;
    const lastMsg = retryMessages[retryMessages.length - 1].content;
    expect(lastMsg).toContain("failed Zod validation");
  });

  test("throws after exhausting attempts on persistent invalid output", async () => {
    const { client } = mockAnthropic(() => '```json\n{"slug": "x"}\n```');
    const drafter = new PlateDrafter();
    await expect(
      drafter.draft({
        name: "Cagrilintide",
        candidates: [FRIAS_CANDIDATE],
        styleExample: STYLE_EXAMPLE,
        anthropic: client,
        maxAttempts: 2,
      }),
    ).rejects.toThrow(/gave up after 2 attempts/);
  });

  test("warns if the draft cites an ID not in the candidate list", async () => {
    const PHANTOM_CITE = VALID_DRAFT_JSON.replace(
      '"cite": ["frias-2018"]',
      '"cite": ["frias-2018", "phantom-9999"]',
    );
    const { client } = mockAnthropic(() => PHANTOM_CITE);
    const drafter = new PlateDrafter();
    const result = await drafter.draft({
      name: "Cagrilintide",
      candidates: [FRIAS_CANDIDATE],
      styleExample: STYLE_EXAMPLE,
      anthropic: client,
    });
    expect(result.warnings.some((w) => w.includes("phantom-9999"))).toBe(true);
    // The valid frias-2018 still flows through
    expect(result.newCitations.map((c) => c.id)).toContain("frias-2018");
  });
});

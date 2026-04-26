import { describe, expect, test } from "bun:test";
import { citationLabel, citationUrl } from "@/lib/citations";
import type { Citation } from "@/lib/schemas/citation";

/* =========================================================
   Unit tests for citation URL resolution.

   The /refs/[id] route handler depends entirely on citationUrl()
   producing the right external URL for each citation type. If
   this regresses, every cited claim chip on /ask becomes a 404
   again — the exact bug Phase 0.1 fixed.
   ========================================================= */

const baseCite: Citation = {
  id: "test-2025",
  type: "journal",
  title: "Test paper",
  year: 2025,
};

describe("citationUrl", () => {
  test("PMID wins over DOI / NCT / url", () => {
    const cite: Citation = {
      ...baseCite,
      pmid: "18057338",
      doi: "10.1056/NEJMoa072375",
      nct: "NCT01234567",
      url: "https://example.com/paper",
    };
    expect(citationUrl(cite)).toBe(
      "https://pubmed.ncbi.nlm.nih.gov/18057338/",
    );
  });

  test("DOI wins over NCT / url when no PMID", () => {
    const cite: Citation = {
      ...baseCite,
      doi: "10.1056/NEJMoa072375",
      nct: "NCT01234567",
      url: "https://example.com",
    };
    expect(citationUrl(cite)).toBe(
      "https://doi.org/10.1056/NEJMoa072375",
    );
  });

  test("NCT wins over url when no PMID / DOI", () => {
    const cite: Citation = {
      ...baseCite,
      nct: "NCT01234567",
      url: "https://example.com",
    };
    expect(citationUrl(cite)).toBe(
      "https://clinicaltrials.gov/study/NCT01234567",
    );
  });

  test("explicit url is the last external option", () => {
    const cite: Citation = {
      ...baseCite,
      url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2010/022505lbl.pdf",
    };
    expect(citationUrl(cite)).toBe(
      "https://www.accessdata.fda.gov/drugsatfda_docs/label/2010/022505lbl.pdf",
    );
  });

  test("falls back to /refs/<id> when no external URL is available", () => {
    expect(citationUrl(baseCite)).toBe("/refs/test-2025");
  });
});

describe("citationLabel", () => {
  test("returns 'Lastname Year' from first author", () => {
    const cite: Citation = {
      ...baseCite,
      authors: ["Falutz J", "Allas S"],
    };
    expect(citationLabel(cite)).toBe("Falutz 2025");
  });

  test("falls back to title prefix when no authors", () => {
    expect(citationLabel(baseCite)).toBe("Test paper 2025");
  });
});

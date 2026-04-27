import { describe, expect, test } from "bun:test";
import { parseArgs } from "../../scripts/gen-plate";

/* ============================================================
   gen:plate CLI argument parsing.

   --seed-pmids was added to let operators pin foundational papers
   that PubMed keyword search misses. The flag accepts a comma-
   (or whitespace-) separated PMID list and silently filters out
   non-numeric tokens — this lets a fat-fingered "1234, 5678 oops"
   degrade gracefully rather than crash mid-draft.
   ============================================================ */

describe("parseArgs — base behavior", () => {
  test("parses just the peptide name with sensible defaults", () => {
    const a = parseArgs(["Cagrilintide"]);
    expect(a.name).toBe("Cagrilintide");
    expect(a.style).toBe("tesamorelin");
    expect(a.candidates).toBe(10);
    expect(a.model).toBe("claude-sonnet-4-5");
    expect(a.force).toBe(false);
    expect(a.seedPmids).toEqual([]);
  });

  test("parses --slug + --brief + --keywords + --candidates + --model + --force", () => {
    const a = parseArgs([
      "Mazdutide",
      "--slug=mazdutide",
      "--brief=GLP-1/glucagon dual agonist",
      "--keywords=mazdutide obesity",
      "--candidates=15",
      "--model=claude-haiku-4-5",
      "--force",
    ]);
    expect(a.slug).toBe("mazdutide");
    expect(a.brief).toBe("GLP-1/glucagon dual agonist");
    expect(a.keywords).toBe("mazdutide obesity");
    expect(a.candidates).toBe(15);
    expect(a.model).toBe("claude-haiku-4-5");
    expect(a.force).toBe(true);
  });
});

describe("parseArgs — --seed-pmids", () => {
  test("accepts a comma-separated PMID list", () => {
    const a = parseArgs(["GLP-1", "--seed-pmids=11823860,12027450,15282204"]);
    expect(a.seedPmids).toEqual(["11823860", "12027450", "15282204"]);
  });

  test("accepts whitespace-separated PMIDs (operator pasted from a paper)", () => {
    const a = parseArgs(["GLP-1", "--seed-pmids=11823860 12027450 15282204"]);
    expect(a.seedPmids).toEqual(["11823860", "12027450", "15282204"]);
  });

  test("silently filters non-numeric tokens (typos, separators)", () => {
    const a = parseArgs([
      "GLP-1",
      "--seed-pmids=11823860,oops,12027450,PMC123,15282204",
    ]);
    expect(a.seedPmids).toEqual(["11823860", "12027450", "15282204"]);
  });

  test("trims whitespace around each token", () => {
    const a = parseArgs([
      "GLP-1",
      "--seed-pmids=  11823860 ,  12027450  ,15282204",
    ]);
    expect(a.seedPmids).toEqual(["11823860", "12027450", "15282204"]);
  });

  test("empty value yields empty array (no crash)", () => {
    const a = parseArgs(["GLP-1", "--seed-pmids="]);
    expect(a.seedPmids).toEqual([]);
  });

  test("absence of flag defaults to empty array", () => {
    const a = parseArgs(["GLP-1"]);
    expect(a.seedPmids).toEqual([]);
  });
});

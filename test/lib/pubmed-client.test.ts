import { describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  PubmedClient,
  TITLE_MATCH_THRESHOLD,
  diceCoefficient,
  type FetchFn,
} from "../../scripts/lib/pubmed-client";

/**
 * Build a fake fetch that returns a canned JSON response. Tracks every
 * URL it sees so tests can assert request shape.
 */
function makeFetch(
  responder: (url: string) => unknown | Promise<unknown>,
  init?: { ok?: boolean; status?: number },
): { fetchFn: FetchFn; calls: string[] } {
  const calls: string[] = [];
  const fetchFn: FetchFn = async (input) => {
    const url = typeof input === "string" ? input : input.toString();
    calls.push(url);
    const body = await responder(url);
    return new Response(JSON.stringify(body), {
      status: init?.status ?? 200,
      headers: { "content-type": "application/json" },
    });
  };
  return { fetchFn, calls };
}

const FALUTZ_2007_ESUMMARY = {
  result: {
    uids: ["18057338"],
    "18057338": {
      uid: "18057338",
      title: "Metabolic effects of a growth hormone-releasing factor in patients with HIV",
      pubdate: "2007 Dec 6",
      authors: [
        { name: "Falutz J" },
        { name: "Allas S" },
        { name: "Blot K" },
      ],
      fulljournalname: "The New England journal of medicine",
    },
  },
};

const NOT_FOUND_ESUMMARY = {
  result: {
    uids: ["999999999"],
    "999999999": {
      uid: "999999999",
      error: "cannot get document summary",
    },
  },
};

describe("PubmedClient.verifyPmid", () => {
  test("parses a real esummary response into a PubmedRecord", async () => {
    const { fetchFn } = makeFetch(() => FALUTZ_2007_ESUMMARY);
    const client = new PubmedClient({ fetchFn });
    const record = await client.verifyPmid("18057338");

    expect(record).not.toBeNull();
    expect(record?.pmid).toBe("18057338");
    expect(record?.title).toBe(
      "Metabolic effects of a growth hormone-releasing factor in patients with HIV",
    );
    expect(record?.firstAuthor).toBe("Falutz J");
    expect(record?.pubdate).toBe("2007 Dec 6");
    expect(record?.year).toBe(2007);
    expect(record?.journal).toBe("The New England journal of medicine");
  });

  test("returns null when the PMID has an error field (not found)", async () => {
    const { fetchFn } = makeFetch(() => NOT_FOUND_ESUMMARY);
    const client = new PubmedClient({ fetchFn });
    expect(await client.verifyPmid("999999999")).toBeNull();
  });

  test("returns null on malformed JSON shape", async () => {
    const { fetchFn } = makeFetch(() => ({ result: {} }));
    const client = new PubmedClient({ fetchFn });
    expect(await client.verifyPmid("18057338")).toBeNull();
  });

  test("returns null on non-numeric PMID without making a request", async () => {
    const { fetchFn, calls } = makeFetch(() => FALUTZ_2007_ESUMMARY);
    const client = new PubmedClient({ fetchFn });
    expect(await client.verifyPmid("not-a-pmid")).toBeNull();
    expect(calls).toHaveLength(0);
  });

  test("returns null when fetch throws (network error)", async () => {
    const fetchFn: FetchFn = async () => {
      throw new Error("ECONNREFUSED");
    };
    const client = new PubmedClient({ fetchFn });
    expect(await client.verifyPmid("18057338")).toBeNull();
  });

  test("returns null on HTTP 503", async () => {
    const fetchFn: FetchFn = async () =>
      new Response("Service Unavailable", { status: 503 });
    const client = new PubmedClient({ fetchFn });
    expect(await client.verifyPmid("18057338")).toBeNull();
  });

  test("retries on HTTP 429 and succeeds on second attempt", async () => {
    let calls = 0;
    const fetchFn: FetchFn = async () => {
      calls += 1;
      if (calls === 1) return new Response("Too Many Requests", { status: 429 });
      return new Response(JSON.stringify(FALUTZ_2007_ESUMMARY), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };
    const client = new PubmedClient({ fetchFn });
    const record = await client.verifyPmid("18057338");
    expect(record).not.toBeNull();
    expect(calls).toBe(2);
  });

  test("gives up on HTTP 429 after 3 attempts", async () => {
    let calls = 0;
    const fetchFn: FetchFn = async () => {
      calls += 1;
      return new Response("Too Many Requests", { status: 429 });
    };
    const client = new PubmedClient({ fetchFn });
    expect(await client.verifyPmid("18057338")).toBeNull();
    expect(calls).toBe(3);
  });

  test("includes api_key when provided", async () => {
    const { fetchFn, calls } = makeFetch(() => FALUTZ_2007_ESUMMARY);
    const client = new PubmedClient({ fetchFn, apiKey: "test-key-abc" });
    await client.verifyPmid("18057338");
    expect(calls[0]).toContain("api_key=test-key-abc");
  });
});

describe("PubmedClient.fetchAbstract", () => {
  const ABSTRACT_TEXT = `1. N Engl J Med. 2007 Dec 6;357(23):2359-70.

Metabolic effects of a growth hormone-releasing factor in patients with HIV.

Falutz J, Allas S, Blot K, et al.

BACKGROUND: HIV-infected patients treated with antiretroviral therapy can have
abdominal fat accumulation. We assessed the effects of tesamorelin, a synthetic
analogue of growth hormone-releasing factor.

METHODS: In a double-blind, multicenter, placebo-controlled study, 412 patients
were randomly assigned to receive 2 mg of tesamorelin or placebo subcutaneously
once daily for 26 weeks.

PMID: 18057338`;

  test("returns the raw efetch text response", async () => {
    const fetchFn: FetchFn = async () =>
      new Response(ABSTRACT_TEXT, { status: 200, headers: { "content-type": "text/plain" } });
    const client = new PubmedClient({ fetchFn });
    const text = await client.fetchAbstract("18057338");
    expect(text).toContain("Metabolic effects of a growth hormone-releasing factor");
    expect(text).toContain("PMID: 18057338");
  });

  test("requests the abstract endpoint with rettype=abstract&retmode=text", async () => {
    const calls: string[] = [];
    const fetchFn: FetchFn = async (input) => {
      calls.push(typeof input === "string" ? input : input.toString());
      return new Response(ABSTRACT_TEXT, { status: 200 });
    };
    const client = new PubmedClient({ fetchFn });
    await client.fetchAbstract("18057338");
    expect(calls[0]).toContain("efetch.fcgi");
    expect(calls[0]).toContain("rettype=abstract");
    expect(calls[0]).toContain("retmode=text");
    expect(calls[0]).toContain("id=18057338");
  });

  test("returns null on invalid PMID format without making a request", async () => {
    const calls: string[] = [];
    const fetchFn: FetchFn = async (input) => {
      calls.push(typeof input === "string" ? input : input.toString());
      return new Response(ABSTRACT_TEXT, { status: 200 });
    };
    const client = new PubmedClient({ fetchFn });
    expect(await client.fetchAbstract("PMC123")).toBeNull();
    expect(calls).toHaveLength(0);
  });

  test("returns null on empty body", async () => {
    const fetchFn: FetchFn = async () => new Response("   \n  \n", { status: 200 });
    const client = new PubmedClient({ fetchFn });
    expect(await client.fetchAbstract("18057338")).toBeNull();
  });

  test("returns null on HTTP 404", async () => {
    const fetchFn: FetchFn = async () => new Response("Not Found", { status: 404 });
    const client = new PubmedClient({ fetchFn });
    expect(await client.fetchAbstract("999999999")).toBeNull();
  });

  test("retries on HTTP 429 (shares retry path with verifyPmid)", async () => {
    let calls = 0;
    const fetchFn: FetchFn = async () => {
      calls += 1;
      if (calls === 1) return new Response("Too Many Requests", { status: 429 });
      return new Response(ABSTRACT_TEXT, { status: 200 });
    };
    const client = new PubmedClient({ fetchFn });
    const text = await client.fetchAbstract("18057338");
    expect(text).not.toBeNull();
    expect(calls).toBe(2);
  });
});

describe("PubmedClient.searchPubmed", () => {
  test("returns the idlist from esearch", async () => {
    const { fetchFn } = makeFetch(() => ({
      esearchresult: { idlist: ["18057338", "20554713", "12345678"] },
    }));
    const client = new PubmedClient({ fetchFn });
    const ids = await client.searchPubmed("tesamorelin visceral fat", 5);
    expect(ids).toEqual(["18057338", "20554713", "12345678"]);
  });

  test("returns empty array on empty query", async () => {
    const { fetchFn, calls } = makeFetch(() => ({}));
    const client = new PubmedClient({ fetchFn });
    expect(await client.searchPubmed("   ")).toEqual([]);
    expect(calls).toHaveLength(0);
  });

  test("returns empty array on malformed response", async () => {
    const { fetchFn } = makeFetch(() => ({ esearchresult: {} }));
    const client = new PubmedClient({ fetchFn });
    expect(await client.searchPubmed("any query")).toEqual([]);
  });

  test("respects retmax in query string", async () => {
    const { fetchFn, calls } = makeFetch(() => ({ esearchresult: { idlist: [] } }));
    const client = new PubmedClient({ fetchFn });
    await client.searchPubmed("any query", 25);
    expect(calls[0]).toContain("retmax=25");
  });
});

describe("rate limiter", () => {
  test("throttles when requests exceed limit within window", async () => {
    const { fetchFn } = makeFetch(() => FALUTZ_2007_ESUMMARY);
    const client = new PubmedClient({ fetchFn, rateLimit: 2 });

    const start = Date.now();
    await Promise.all([
      client.verifyPmid("18057338"),
      client.verifyPmid("18057338"),
      client.verifyPmid("18057338"),
      client.verifyPmid("18057338"),
    ]);
    const elapsed = Date.now() - start;

    // 4 requests at 2/sec should take >= ~1 second (2 burst, then sleep).
    // Allow generous slack for CI scheduler jitter.
    expect(elapsed).toBeGreaterThanOrEqual(900);
  });

  test("does not throttle when below limit", async () => {
    const { fetchFn } = makeFetch(() => FALUTZ_2007_ESUMMARY);
    const client = new PubmedClient({ fetchFn, rateLimit: 100 });
    const start = Date.now();
    await client.verifyPmid("18057338");
    expect(Date.now() - start).toBeLessThan(100);
  });
});

describe("diceCoefficient", () => {
  test("returns 1 for identical strings", () => {
    expect(diceCoefficient("hello world", "hello world")).toBe(1);
  });

  test("ignores case + punctuation", () => {
    expect(
      diceCoefficient(
        "Metabolic effects of a growth hormone-releasing factor in patients with HIV",
        "metabolic effects of a growth hormone releasing factor in patients with hiv",
      ),
    ).toBeGreaterThanOrEqual(TITLE_MATCH_THRESHOLD);
  });

  test("returns high score for typo / minor variation", () => {
    expect(
      diceCoefficient(
        "Effects of tesamorelin on visceral fat",
        "Effects of tesamorelin on visceral fat:",
      ),
    ).toBeGreaterThanOrEqual(TITLE_MATCH_THRESHOLD);
  });

  test("returns low score for unrelated strings", () => {
    const score = diceCoefficient(
      "Metabolic effects of growth hormone in HIV patients",
      "A randomized trial of semaglutide in obesity",
    );
    expect(score).toBeLessThan(0.4);
  });

  test("handles empty / 1-char inputs without crashing", () => {
    expect(diceCoefficient("", "")).toBe(1);
    expect(diceCoefficient("", "a")).toBe(0);
    expect(diceCoefficient("a", "a")).toBe(1);
    expect(diceCoefficient("a", "b")).toBe(0);
  });

  test("threshold catches 'real PMID, wrong paper' hallucination", () => {
    const realTitle =
      "Metabolic effects of a growth hormone-releasing factor in patients with HIV";
    const hallucinatedClaim =
      "Long-term safety of tesamorelin in HIV-associated lipodystrophy";
    expect(diceCoefficient(realTitle, hallucinatedClaim)).toBeLessThan(
      TITLE_MATCH_THRESHOLD,
    );
  });
});

/* ============================================================
   Disk cache
   ============================================================ */

describe("PubmedClient disk cache", () => {
  function tmpCache(): string {
    return mkdtempSync(join(tmpdir(), "pubmed-cache-test-"));
  }

  test("fetchAbstract writes successful response to <cacheDir>/abs-<pmid>.txt", async () => {
    const dir = tmpCache();
    try {
      const fetchFn: FetchFn = async () =>
        new Response("FAKE ABSTRACT TEXT FOR PMID 18057338", { status: 200 });
      const client = new PubmedClient({ fetchFn, cacheDir: dir });
      await client.fetchAbstract("18057338");

      const cached = readFileSync(join(dir, "abs-18057338.txt"), "utf-8");
      expect(cached).toContain("FAKE ABSTRACT TEXT FOR PMID 18057338");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("fetchAbstract second call hits cache with no fetch", async () => {
    const dir = tmpCache();
    try {
      let calls = 0;
      const fetchFn: FetchFn = async () => {
        calls += 1;
        return new Response("ABSTRACT BODY", { status: 200 });
      };
      const client = new PubmedClient({ fetchFn, cacheDir: dir });
      await client.fetchAbstract("18057338");
      await client.fetchAbstract("18057338");
      await client.fetchAbstract("18057338");
      expect(calls).toBe(1);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("verifyPmid second call hits cache with no fetch", async () => {
    const dir = tmpCache();
    try {
      let calls = 0;
      const summary = {
        result: {
          uids: ["18057338"],
          "18057338": {
            uid: "18057338",
            title: "Cached title",
            pubdate: "2007",
            authors: [{ name: "Falutz J" }],
            fulljournalname: "NEJM",
          },
        },
      };
      const fetchFn: FetchFn = async () => {
        calls += 1;
        return new Response(JSON.stringify(summary), { status: 200 });
      };
      const client = new PubmedClient({ fetchFn, cacheDir: dir });
      const first = await client.verifyPmid("18057338");
      const second = await client.verifyPmid("18057338");
      expect(calls).toBe(1);
      expect(second).toEqual(first);
      expect(second?.title).toBe("Cached title");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("does NOT cache null fetchAbstract results (lets next run retry)", async () => {
    const dir = tmpCache();
    try {
      const fetchFn: FetchFn = async () => new Response("Not Found", { status: 404 });
      const client = new PubmedClient({ fetchFn, cacheDir: dir });
      await client.fetchAbstract("99999999");
      expect(existsSync(join(dir, "abs-99999999.txt"))).toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("does NOT cache when verifyPmid receives an error record", async () => {
    const dir = tmpCache();
    try {
      const fetchFn: FetchFn = async () =>
        new Response(
          JSON.stringify({
            result: { uids: ["999"], "999": { uid: "999", error: "not found" } },
          }),
          { status: 200 },
        );
      const client = new PubmedClient({ fetchFn, cacheDir: dir });
      await client.verifyPmid("999");
      expect(existsSync(join(dir, "sum-999.json"))).toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("survives corrupt cache entry by re-fetching", async () => {
    const dir = tmpCache();
    try {
      // Pre-poison the cache with malformed JSON.
      const corruptPath = join(dir, "sum-18057338.json");
      Bun.write(corruptPath, "{ not-json garbage");

      let calls = 0;
      const fetchFn: FetchFn = async () => {
        calls += 1;
        return new Response(
          JSON.stringify({
            result: {
              uids: ["18057338"],
              "18057338": {
                uid: "18057338",
                title: "Recovered",
                pubdate: "2007",
                authors: [{ name: "Falutz J" }],
                fulljournalname: "NEJM",
              },
            },
          }),
          { status: 200 },
        );
      };
      const client = new PubmedClient({ fetchFn, cacheDir: dir });
      // Wait for the pre-write to flush.
      await new Promise((r) => setTimeout(r, 10));
      const result = await client.verifyPmid("18057338");
      expect(result?.title).toBe("Recovered");
      expect(calls).toBe(1);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("works without cacheDir (back-compat — no cache, every call fetches)", async () => {
    let calls = 0;
    const fetchFn: FetchFn = async () => {
      calls += 1;
      return new Response("BODY", { status: 200 });
    };
    const client = new PubmedClient({ fetchFn }); // no cacheDir
    await client.fetchAbstract("18057338");
    await client.fetchAbstract("18057338");
    expect(calls).toBe(2);
  });
});

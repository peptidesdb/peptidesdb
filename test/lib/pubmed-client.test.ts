import { describe, expect, test } from "bun:test";
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

  test("includes api_key when provided", async () => {
    const { fetchFn, calls } = makeFetch(() => FALUTZ_2007_ESUMMARY);
    const client = new PubmedClient({ fetchFn, apiKey: "test-key-abc" });
    await client.verifyPmid("18057338");
    expect(calls[0]).toContain("api_key=test-key-abc");
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

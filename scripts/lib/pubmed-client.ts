/**
 * PubMed E-utilities client
 *
 * Two purposes:
 *   1. verifyPmid(pmid) — given a claimed PMID, fetch NCBI's metadata so we
 *      can detect "real PMID, wrong paper" hallucinations via title fuzzy-match.
 *   2. searchPubmed(query) — given a free-text query, return top-N matching
 *      PMIDs. Used by the Phase-2 claim-linker to suggest citations for AI-
 *      drafted claims.
 *
 * Design notes
 * ------------
 * - NCBI rate limits: 3 req/s without an API key, 10 req/s with one. We
 *   implement a simple sliding-window throttle so audits never trip the limit.
 * - All network errors are non-fatal at the client level: callers see `null`
 *   or an empty array, never an exception. The audit script decides whether
 *   to exit non-zero.
 * - `fetchFn` is injectable so tests don't need a network or module mocks.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ESEARCH = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi";
const ESUMMARY = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi";
const EFETCH = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi";

export type FetchFn = typeof fetch;

export interface PubmedRecord {
  pmid: string;
  title: string;
  /** First author last name + initial, e.g. "Falutz J". */
  firstAuthor: string | null;
  /** Free-form publication date string from NCBI (e.g. "2007 Dec 6"). */
  pubdate: string | null;
  /** Year extracted from pubdate (best-effort). */
  year: number | null;
  /** Full journal name (e.g. "The New England journal of medicine"). */
  journal: string | null;
}

export interface PubmedClientOptions {
  /** Inject `fetch` for testing. Defaults to global `fetch`. */
  fetchFn?: FetchFn;
  /** NCBI API key (optional). With a key the rate limit goes 3/s → 10/s. */
  apiKey?: string;
  /** Max requests per second. Defaults to 3 (no key) or 10 (with key). */
  rateLimit?: number;
  /** Max wall-clock time per request in ms. Defaults to 10s. */
  timeoutMs?: number;
  /** Optional logger. Defaults to silent. */
  log?: (msg: string) => void;
  /**
   * If set, cache successful esummary + efetch responses to disk under
   * this directory. Re-runs hit cache before NCBI, drastically cutting
   * 429 flake-rate during repeated audits. Cache is content-addressed
   * by PMID. Null/error responses are never cached (next run can retry).
   *
   * Caller should add the cache directory to .gitignore.
   */
  cacheDir?: string;
}

/**
 * Rate limiter enforcing both a sliding-window cap AND a minimum interval
 * between consecutive calls. The minimum interval matters — NCBI's
 * anti-burst layer rejects 3 requests in 10ms even if the trailing 1-second
 * window stays under the limit. minInterval = windowMs / limit gives a
 * uniform rhythm that NCBI tolerates.
 */
class RateLimiter {
  private timestamps: number[] = [];
  private lastCallMs = 0;
  private readonly minIntervalMs: number;

  constructor(
    private readonly limit: number,
    private readonly windowMs: number = 1000,
  ) {
    this.minIntervalMs = limit > 0 ? Math.ceil(windowMs / limit) : 0;
  }

  async wait(): Promise<void> {
    if (this.limit <= 0) return;
    const now = Date.now();

    // 1. Enforce minimum interval since the last call.
    const sinceLast = now - this.lastCallMs;
    if (this.lastCallMs > 0 && sinceLast < this.minIntervalMs) {
      await new Promise((r) => setTimeout(r, this.minIntervalMs - sinceLast));
    }

    // 2. Enforce sliding-window cap (belt + suspenders for long bursts).
    const checkpoint = Date.now();
    this.timestamps = this.timestamps.filter((t) => checkpoint - t < this.windowMs);
    if (this.timestamps.length >= this.limit) {
      const oldest = this.timestamps[0];
      const sleepMs = this.windowMs - (checkpoint - oldest) + 1;
      if (sleepMs > 0) await new Promise((r) => setTimeout(r, sleepMs));
    }

    const stamp = Date.now();
    this.timestamps.push(stamp);
    this.lastCallMs = stamp;
  }
}

export class PubmedClient {
  private readonly fetchFn: FetchFn;
  private readonly apiKey?: string;
  private readonly limiter: RateLimiter;
  private readonly timeoutMs: number;
  private readonly log: (msg: string) => void;
  private readonly cacheDir?: string;

  constructor(opts: PubmedClientOptions = {}) {
    this.fetchFn = opts.fetchFn ?? globalThis.fetch;
    this.apiKey = opts.apiKey;
    const limit = opts.rateLimit ?? (this.apiKey ? 10 : 3);
    this.limiter = new RateLimiter(limit);
    this.timeoutMs = opts.timeoutMs ?? 10_000;
    this.log = opts.log ?? (() => {});
    this.cacheDir = opts.cacheDir;
    if (this.cacheDir) {
      try {
        mkdirSync(this.cacheDir, { recursive: true });
      } catch (e) {
        this.log(`[pubmed] cache dir create failed: ${(e as Error).message}`);
      }
    }
  }

  private cachePath(name: string): string | null {
    return this.cacheDir ? join(this.cacheDir, name) : null;
  }

  private cacheGet(name: string): string | null {
    const p = this.cachePath(name);
    if (!p || !existsSync(p)) return null;
    try {
      const text = readFileSync(p, "utf-8");
      return text.length > 0 ? text : null;
    } catch {
      return null;
    }
  }

  private cacheSet(name: string, content: string): void {
    const p = this.cachePath(name);
    if (!p) return;
    try {
      writeFileSync(p, content, "utf-8");
    } catch (e) {
      this.log(`[pubmed] cache write failed (${name}): ${(e as Error).message}`);
    }
  }

  /**
   * Fetch metadata for a PMID. Returns `null` if the PMID does not exist or
   * the request fails. Non-throwing.
   */
  async verifyPmid(pmid: string): Promise<PubmedRecord | null> {
    if (!/^\d+$/.test(pmid)) {
      this.log(`[pubmed] invalid PMID format: ${pmid}`);
      return null;
    }

    const cacheName = `sum-${pmid}.json`;
    const cached = this.cacheGet(cacheName);
    if (cached) {
      try {
        return JSON.parse(cached) as PubmedRecord;
      } catch {
        // Corrupt cache entry — fall through and re-fetch.
      }
    }

    await this.limiter.wait();

    const params = new URLSearchParams({ db: "pubmed", id: pmid, retmode: "json" });
    if (this.apiKey) params.set("api_key", this.apiKey);

    const url = `${ESUMMARY}?${params.toString()}`;
    const json = (await this.fetchJson(url)) as
      | { result?: Record<string, { error?: string } | undefined> }
      | null;
    if (!json) return null;

    const record = json.result?.[pmid];
    if (!record || record.error) {
      this.log(`[pubmed] PMID ${pmid} not found in PubMed`);
      return null;
    }

    const parsed = parseSummaryRecord(pmid, record);
    if (parsed) this.cacheSet(cacheName, JSON.stringify(parsed));
    return parsed;
  }

  /**
   * Free-text search. Returns up to `retmax` PMIDs ordered by NCBI relevance.
   * Empty array on failure.
   */
  async searchPubmed(query: string, retmax = 10): Promise<string[]> {
    if (!query.trim()) return [];

    await this.limiter.wait();

    const params = new URLSearchParams({
      db: "pubmed",
      term: query,
      retmax: String(retmax),
      retmode: "json",
    });
    if (this.apiKey) params.set("api_key", this.apiKey);

    const url = `${ESEARCH}?${params.toString()}`;
    const json = (await this.fetchJson(url)) as
      | { esearchresult?: { idlist?: unknown } }
      | null;
    if (!json) return [];

    const ids = json.esearchresult?.idlist;
    return Array.isArray(ids) ? ids.filter((x) => typeof x === "string") : [];
  }

  /**
   * Fetch the formatted abstract text for a PMID via efetch. NCBI's efetch
   * with `rettype=abstract&retmode=text` returns a plain-text block with
   * title, authors, journal, citation_string, and abstract — the same form
   * a researcher copies from PubMed. Suitable as direct LLM context.
   *
   * Returns null on missing PMID, network failure, or empty response.
   */
  async fetchAbstract(pmid: string): Promise<string | null> {
    if (!/^\d+$/.test(pmid)) {
      this.log(`[pubmed] invalid PMID format: ${pmid}`);
      return null;
    }

    const cacheName = `abs-${pmid}.txt`;
    const cached = this.cacheGet(cacheName);
    if (cached) return cached;

    await this.limiter.wait();

    const params = new URLSearchParams({
      db: "pubmed",
      id: pmid,
      rettype: "abstract",
      retmode: "text",
    });
    if (this.apiKey) params.set("api_key", this.apiKey);

    const url = `${EFETCH}?${params.toString()}`;
    const text = await this.fetchText(url);
    if (!text || !text.trim()) {
      this.log(`[pubmed] empty abstract for PMID ${pmid}`);
      return null;
    }
    const trimmed = text.trim();
    this.cacheSet(cacheName, trimmed);
    return trimmed;
  }

  private async fetchJson(url: string): Promise<unknown> {
    const res = await this.fetchWithRetry(url);
    if (!res) return null;
    try {
      return await res.json();
    } catch (e) {
      this.log(`[pubmed] JSON parse failed: ${(e as Error).message}`);
      return null;
    }
  }

  private async fetchText(url: string): Promise<string | null> {
    const res = await this.fetchWithRetry(url);
    if (!res) return null;
    try {
      return await res.text();
    } catch (e) {
      this.log(`[pubmed] text decode failed: ${(e as Error).message}`);
      return null;
    }
  }

  /**
   * Fetch with up-to-2-retry on HTTP 429 (rate limit). NCBI's enforcement
   * is sometimes stricter than their published 3/s limit, so we accept
   * occasional 429s as transient and back off rather than treating them
   * as fatal. Returns the raw Response so callers can decode JSON or text.
   */
  private async fetchWithRetry(url: string): Promise<Response | null> {
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);
      try {
        const res = await this.fetchFn(url, { signal: ctrl.signal });
        if (res.status === 429 && attempt < maxAttempts) {
          const backoffMs = 1000 * attempt;
          this.log(`[pubmed] HTTP 429 — backing off ${backoffMs}ms (attempt ${attempt}/${maxAttempts})`);
          clearTimeout(timer);
          await new Promise((r) => setTimeout(r, backoffMs));
          continue;
        }
        if (!res.ok) {
          this.log(`[pubmed] HTTP ${res.status} for ${url}`);
          return null;
        }
        return res;
      } catch (e) {
        this.log(`[pubmed] fetch failed: ${(e as Error).message}`);
        return null;
      } finally {
        clearTimeout(timer);
      }
    }
    return null;
  }
}

function parseSummaryRecord(pmid: string, record: unknown): PubmedRecord | null {
  if (!record || typeof record !== "object") return null;
  const r = record as Record<string, unknown>;
  const title = typeof r.title === "string" ? r.title : "";
  if (!title) return null;

  const authors = Array.isArray(r.authors) ? (r.authors as Array<{ name?: string }>) : [];
  const firstAuthor = authors[0]?.name ?? null;

  const pubdate = typeof r.pubdate === "string" ? r.pubdate : null;
  const year = pubdate ? extractYear(pubdate) : null;

  const journal = typeof r.fulljournalname === "string" ? r.fulljournalname : null;

  return { pmid, title, firstAuthor, pubdate, year, journal };
}

function extractYear(pubdate: string): number | null {
  const m = pubdate.match(/\d{4}/);
  if (!m) return null;
  const y = Number(m[0]);
  return y >= 1900 && y <= 2100 ? y : null;
}

/**
 * Dice coefficient on bigrams. Returns a similarity score in [0, 1].
 *
 * Why Dice over Levenshtein: PubMed titles vs. our `title` field often
 * differ in punctuation, capitalization, and trailing fragments. Bigram
 * Dice is robust to those differences and runs in O(n+m) time. A threshold
 * of ≥0.85 catches "completely different paper at the same PMID" without
 * false-flagging "title with a typo or trailing colon".
 */
export function diceCoefficient(a: string, b: string): number {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  const sa = norm(a);
  const sb = norm(b);
  if (sa.length < 2 || sb.length < 2) return sa === sb ? 1 : 0;

  const bigrams = (s: string): Map<string, number> => {
    const m = new Map<string, number>();
    for (let i = 0; i < s.length - 1; i++) {
      const bg = s.slice(i, i + 2);
      m.set(bg, (m.get(bg) ?? 0) + 1);
    }
    return m;
  };

  const ba = bigrams(sa);
  const bb = bigrams(sb);
  let intersection = 0;
  for (const [bg, count] of ba) {
    const other = bb.get(bg);
    if (other !== undefined) intersection += Math.min(count, other);
  }
  const total = (sa.length - 1) + (sb.length - 1);
  return total === 0 ? 0 : (2 * intersection) / total;
}

/** Default fuzzy-match threshold for title verification (per design decision). */
export const TITLE_MATCH_THRESHOLD = 0.85;

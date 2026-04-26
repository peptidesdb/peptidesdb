import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { citationAppendix, rankByQuery } from "@/lib/ask-corpus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================================================
   Per-IP rate limit on /api/ask. Each Anthropic call costs us
   real money; without a limit a single bad actor can drain the
   API budget in minutes. We use Upstash sliding-window rate
   limiting backed by Vercel KV.

   Limits: 5 questions per minute per IP, 30 per hour per IP.
   These are conservative — most legitimate users ask 1–3
   questions per session. Adjust upward later based on logs.

   Falls back gracefully: if KV_URL / KV_REST_API_TOKEN are not
   configured (e.g. during local dev), we skip rate limiting and
   log a warning. Production must have these set on Vercel.
   ========================================================= */
const KV_CONFIGURED = Boolean(
  process.env.KV_URL && process.env.KV_REST_API_TOKEN,
);

const minuteLimiter = KV_CONFIGURED
  ? new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: true,
      prefix: "peptidesdb:ask:m",
    })
  : null;

const hourLimiter = KV_CONFIGURED
  ? new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(30, "1 h"),
      analytics: true,
      prefix: "peptidesdb:ask:h",
    })
  : null;

const SYSTEM = `You are PeptidesDB, an open-source research peptide reference assistant.

RULES:
1. Use ONLY the peptide context provided below in the [CONTEXT] section. Do not invent claims.
2. When you cite a fact, reference the citation ID in brackets like [falutz-2007]. The frontend renders these as live links.
3. If the context does not contain the answer, say so explicitly. Do not speculate.
4. NEVER provide medical advice. Frame everything as "research literature reports" or "studies indicate". Always recommend consulting a licensed clinician.
5. Be direct + precise. Avoid filler. 2-4 short paragraphs maximum unless the question explicitly asks for depth.
6. If the user asks about dosing, restate that PeptidesDB content describes research-protocol observations, not medical recommendations.
7. If multiple peptides are relevant, compare them rather than picking one.
8. Always end with a one-line "Sources" footer naming the cite IDs you used.`;

/**
 * POST /api/ask
 * Body: { question: string }
 * Streams a Claude response grounded in the peptide corpus.
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "AI assistant unavailable — ANTHROPIC_API_KEY not configured. Set it on Vercel project settings to enable Ask PeptidesDB.",
      },
      { status: 503 },
    );
  }

  // Rate limit by IP before parsing body — saves CPU on attack vectors.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anonymous";

  if (minuteLimiter && hourLimiter) {
    const [m, h] = await Promise.all([
      minuteLimiter.limit(ip),
      hourLimiter.limit(ip),
    ]);
    if (!m.success || !h.success) {
      const retry = !m.success
        ? Math.max(0, m.reset - Date.now())
        : Math.max(0, h.reset - Date.now());
      const window = !m.success ? "minute" : "hour";
      return NextResponse.json(
        {
          error: `Rate limit exceeded — too many questions this ${window}. Try again in ${Math.ceil(retry / 1000)}s.`,
          retry_after_ms: retry,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(retry / 1000)),
            "X-RateLimit-Limit-Minute": "5",
            "X-RateLimit-Remaining-Minute": String(m.remaining),
            "X-RateLimit-Limit-Hour": "30",
            "X-RateLimit-Remaining-Hour": String(h.remaining),
          },
        },
      );
    }
  } else if (process.env.NODE_ENV === "production") {
    console.warn(
      "[ask] rate limiting DISABLED — set KV_URL + KV_REST_API_TOKEN on Vercel",
    );
  }

  let question: string;
  try {
    const body = await req.json();
    question = String(body.question ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!question || question.length < 3) {
    return NextResponse.json(
      { error: "Question too short" },
      { status: 400 },
    );
  }
  if (question.length > 1000) {
    return NextResponse.json(
      { error: "Question too long (1000 char max)" },
      { status: 400 },
    );
  }

  const chunks = rankByQuery(question, 6);
  const usedCites = new Set<string>();
  for (const c of chunks) for (const id of c.cites) usedCites.add(id);

  const context = chunks.length
    ? chunks.map((c) => c.text).join("\n\n---\n\n")
    : "(no peptide in the catalog matched this question)";

  const userPrompt = `[CONTEXT]
${context}

[CITATION REGISTRY]
${citationAppendix(usedCites)}

[QUESTION]
${question}`;

  const client = new Anthropic({ apiKey });
  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{ role: "user", content: userPrompt }],
    });
    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    const referencedCites = chunks.map((c) => c.slug);

    return NextResponse.json(
      {
        answer: text,
        retrieved_peptides: referencedCites,
        retrieved_citations: [...usedCites],
        model: "claude-sonnet-4-5-20250929",
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[ask] Anthropic API error:", message);
    return NextResponse.json(
      { error: "AI assistant temporarily unavailable" },
      { status: 502 },
    );
  }
}

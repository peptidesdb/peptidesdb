"use client";

import { useState } from "react";
import { Loader2, MessageCircle, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

interface Answer {
  answer: string;
  retrieved_peptides: string[];
  retrieved_citations: string[];
}

/**
 * Format the answer text — turn [cite-id] markers into hyperlinks.
 */
function renderAnswer(
  text: string,
  retrievedCitations: string[],
): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let last = 0;
  const re = /\[([a-z0-9][a-z0-9-]*)\]/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const id = match[1];
    if (retrievedCitations.includes(id)) {
      parts.push(
        <a
          key={`${id}-${match.index}`}
          href={`/refs/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-1.5 py-px text-[10px] font-mono rounded-sm text-[var(--color-accent)] ring-1 ring-inset ring-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/10 transition-colors mx-0.5"
          title={`Citation ${id}`}
        >
          {id}
        </a>,
      );
    } else {
      parts.push(match[0]);
    }
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function AskPanel() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || loading) return;
    setLoading(true);
    setErrorMsg(null);
    setAnswer(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong");
      } else {
        setAnswer(data);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={ask} className="space-y-3">
        <label className="block text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
          Your research question
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Compare semaglutide and tirzepatide for weight loss…"
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-md text-[14px] bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-[var(--color-tesamorelin)] focus:ring-2 focus:ring-[var(--color-tesamorelin-soft)] outline-none transition-colors text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className={cn(
              "inline-flex items-center gap-2 px-5 rounded-md text-[13px] font-semibold transition-opacity",
              loading || !question.trim()
                ? "bg-[var(--color-surface-offset)] text-[var(--color-text-muted)] cursor-not-allowed"
                : "bg-[var(--color-accent)] text-[#0c1421] hover:opacity-90",
            )}
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            Ask
          </button>
        </div>
        <p className="text-[11px] text-[var(--color-text-muted)]">
          Grounded in PeptidesDB content. Cited claims link to the source paper.
          Not medical advice.
        </p>
      </form>

      {errorMsg && (
        <div className="rounded-md border border-[var(--color-badge-red-soft)] bg-[var(--color-badge-red-soft)] p-4 text-[13px] text-[var(--color-text)]">
          <div className="flex items-center gap-2 text-[var(--color-badge-red)] mb-1 text-[12px] font-semibold uppercase tracking-wider">
            <MessageCircle size={14} />
            Error
          </div>
          {errorMsg}
        </div>
      )}

      {answer && (
        <div className="space-y-4">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="flex items-center gap-2 mb-4 text-[var(--color-accent)]">
              <Sparkles size={14} />
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                PeptidesDB Answer
              </span>
            </div>
            <div className="text-[14px] leading-relaxed text-[var(--color-text)] whitespace-pre-wrap">
              {renderAnswer(answer.answer, answer.retrieved_citations)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                Retrieved peptides
              </div>
              {answer.retrieved_peptides.length === 0 ? (
                <span className="text-[12px] text-[var(--color-text-muted)] font-mono">
                  none
                </span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {answer.retrieved_peptides.map((slug) => (
                    <a
                      key={slug}
                      href={`/p/${slug}`}
                      className="text-[11px] px-2 py-1 rounded-full bg-[var(--color-tesamorelin-soft)] text-[var(--color-tesamorelin)] ring-1 ring-inset ring-[var(--color-tesamorelin-soft)] hover:ring-[var(--color-tesamorelin)] transition-colors font-mono"
                    >
                      {slug}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                Available citations ({answer.retrieved_citations.length})
              </div>
              <div className="flex flex-wrap gap-1">
                {answer.retrieved_citations.map((id) => (
                  <span
                    key={id}
                    className="text-[10px] px-1.5 py-px rounded-sm bg-[var(--color-surface-offset)] text-[var(--color-text-muted)] ring-1 ring-inset ring-[var(--color-border)] font-mono"
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

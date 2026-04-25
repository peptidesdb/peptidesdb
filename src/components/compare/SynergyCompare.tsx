import { cn } from "@/lib/cn";
import { Sparkles } from "lucide-react";
import { CitationChip } from "@/components/peptide/CitationChip";
import type { Peptide, StackProtocol } from "@/lib/schemas/peptide";

const COLOR_HEADER: Record<NonNullable<Peptide["color"]>, string> = {
  blue: "text-[var(--color-tesamorelin)]",
  green: "text-[var(--color-motsc)]",
  purple: "text-[#a78bfa]",
  amber: "text-[var(--color-badge-yellow)]",
  rose: "text-[var(--color-badge-red)]",
  cyan: "text-[#22d3ee]",
  teal: "text-[var(--color-badge-teal)]",
};

const SYNERGY_TONE: Record<StackProtocol["synergy"], string> = {
  strong:
    "text-[var(--color-motsc)] bg-[var(--color-motsc-soft)] ring-[color:color-mix(in_oklab,var(--color-motsc)_35%,transparent)]",
  moderate:
    "text-[var(--color-badge-teal)] bg-[var(--color-badge-teal-soft)] ring-[color:color-mix(in_oklab,var(--color-badge-teal)_35%,transparent)]",
  weak:
    "text-[var(--color-badge-yellow)] bg-[var(--color-badge-yellow-soft)] ring-[color:color-mix(in_oklab,var(--color-badge-yellow)_35%,transparent)]",
  "multi-pathway":
    "text-[#a78bfa] bg-[rgba(167,139,250,0.16)] ring-[rgba(167,139,250,0.32)]",
};

const SYNERGY_LABEL: Record<StackProtocol["synergy"], string> = {
  strong: "Strong",
  moderate: "Moderate",
  weak: "Weak",
  "multi-pathway": "Multi-pathway",
};

/**
 * Side-by-side synergy stacks for the /compare route. Renders each
 * peptide's stack list as a column. Each stack carries the same
 * citation chips that appear on the single-peptide page so the trust
 * metric on this route matches what the user can see + verify.
 *
 * If a peptide has no stacks, its column shows a muted dash.
 */
export function SynergyCompare({ peptides }: { peptides: Peptide[] }) {
  const hasAny = peptides.some(
    (p) => p.synergy && p.synergy.stacks.length > 0,
  );
  if (!hasAny) return null;

  const cols =
    peptides.length === 2
      ? "lg:grid-cols-2"
      : peptides.length === 3
        ? "lg:grid-cols-3"
        : "lg:grid-cols-1";

  return (
    <div className={`grid grid-cols-1 ${cols} gap-6`}>
      {peptides.map((p) => (
        <div key={p.slug} className="space-y-4">
          <div
            className={cn(
              "text-[11px] uppercase tracking-wider font-semibold",
              COLOR_HEADER[p.color] ?? COLOR_HEADER.blue,
            )}
          >
            {p.name}
          </div>
          {!p.synergy || p.synergy.stacks.length === 0 ? (
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-[13px] text-[var(--color-text-muted)] font-mono">
              — no documented stacks
            </div>
          ) : (
            <div className="space-y-3">
              {p.synergy.stacks.map((stack, i) => (
                <div
                  key={i}
                  className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-offset)] text-[var(--color-accent)]">
                      <Sparkles size={14} strokeWidth={2} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div className="text-[14px] font-semibold text-[var(--color-text)]">
                          + {stack.partner_label}
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset",
                            SYNERGY_TONE[stack.synergy],
                          )}
                        >
                          {SYNERGY_LABEL[stack.synergy]}
                        </span>
                      </div>
                      <a
                        href={`/p/${stack.partner_slug}`}
                        className="text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                      >
                        View {stack.partner_label} →
                      </a>
                    </div>
                  </div>

                  <p className="mt-3 text-[12px] leading-relaxed text-[var(--color-text-secondary)]">
                    {stack.rationale}
                  </p>

                  <dl className="mt-3 space-y-1 pt-3 border-t border-[var(--color-border)]">
                    {Object.entries(stack.protocol).map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-baseline justify-between gap-2 text-[11px]"
                      >
                        <dt className="text-[var(--color-text-muted)]">{k}</dt>
                        <dd className="font-mono text-[var(--color-text)] text-right">
                          {v}
                        </dd>
                      </div>
                    ))}
                    <div className="flex items-baseline justify-between gap-2 text-[11px] pt-2 mt-1 border-t border-[var(--color-border)]">
                      <dt className="text-[var(--color-text-muted)]">
                        Primary benefit
                      </dt>
                      <dd className="text-[var(--color-text)] text-right">
                        {stack.primary_benefit}
                      </dd>
                    </div>
                  </dl>

                  {stack.cite && stack.cite.length > 0 && (
                    <div className="mt-2">
                      <CitationChip refs={stack.cite} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

import { cn } from "@/lib/cn";
import { Sparkles } from "lucide-react";
import { CitationChip } from "./CitationChip";
import type { StackProtocol } from "@/lib/schemas/peptide";

const SYNERGY_CLASS: Record<StackProtocol["synergy"], string> = {
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
  strong: "Strong Synergy",
  moderate: "Moderate Synergy",
  weak: "Weak Synergy",
  "multi-pathway": "Multi-pathway",
};

/**
 * Stack synergy card. Renders peptide pair with rationale, per-peptide
 * protocol, and synergy strength badge. Mirrors reference dashboard's
 * blend-card pattern.
 */
export function StackCard({
  pep,
  partner_label,
  partner_slug,
  synergy,
  rationale,
  protocol,
  primary_benefit,
  cite,
  className,
}: StackProtocol & {
  pep: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-offset)] text-[var(--color-accent)]">
          <Sparkles size={18} strokeWidth={2} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="text-[15px] font-semibold text-[var(--color-text)]">
              {pep} + {partner_label}
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset",
                SYNERGY_CLASS[synergy]
              )}
            >
              {SYNERGY_LABEL[synergy]}
            </span>
          </div>
          <a
            href={`/p/${partner_slug}`}
            className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
          >
            View {partner_label} →
          </a>
        </div>
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
        {rationale}
      </p>

      <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-4 border-t border-[var(--color-border)]">
        {Object.entries(protocol).map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-2 text-[12px]">
            <dt className="text-[var(--color-text-muted)]">{k}</dt>
            <dd className="font-mono text-[var(--color-text)] text-right">{v}</dd>
          </div>
        ))}
        <div className="sm:col-span-2 flex items-baseline justify-between gap-2 text-[12px] pt-2 mt-1 border-t border-[var(--color-border)]">
          <dt className="text-[var(--color-text-muted)]">Primary benefit</dt>
          <dd className="text-[var(--color-text)] text-right">{primary_benefit}</dd>
        </div>
      </dl>

      {cite && cite.length > 0 && (
        <div className="mt-3">
          <CitationChip refs={cite} />
        </div>
      )}
    </div>
  );
}

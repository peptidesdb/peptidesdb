import { cn } from "@/lib/cn";
import { CitationChip } from "./CitationChip";
import type { Peptide } from "@/lib/schemas/peptide";

/* Color → CSS variable map. Drives accent + soft fill. */
const COLOR_VAR: Record<NonNullable<Peptide["color"]>, { bg: string; border: string; text: string }> = {
  blue: {
    bg: "bg-[var(--color-tesamorelin-soft)]",
    border: "border-[color:color-mix(in_oklab,var(--color-tesamorelin)_45%,transparent)]",
    text: "text-[var(--color-tesamorelin)]",
  },
  green: {
    bg: "bg-[var(--color-motsc-soft)]",
    border: "border-[color:color-mix(in_oklab,var(--color-motsc)_45%,transparent)]",
    text: "text-[var(--color-motsc)]",
  },
  purple: {
    bg: "bg-[rgba(167,139,250,0.10)]",
    border: "border-[rgba(167,139,250,0.40)]",
    text: "text-[#a78bfa]",
  },
  amber: {
    bg: "bg-[rgba(251,191,36,0.10)]",
    border: "border-[rgba(251,191,36,0.40)]",
    text: "text-[var(--color-badge-yellow)]",
  },
  rose: {
    bg: "bg-[rgba(248,113,113,0.10)]",
    border: "border-[rgba(248,113,113,0.40)]",
    text: "text-[var(--color-badge-red)]",
  },
  cyan: {
    bg: "bg-[rgba(34,211,238,0.10)]",
    border: "border-[rgba(34,211,238,0.40)]",
    text: "text-[#22d3ee]",
  },
  teal: {
    bg: "bg-[var(--color-badge-teal-soft)]",
    border: "border-[color:color-mix(in_oklab,var(--color-badge-teal)_45%,transparent)]",
    text: "text-[var(--color-badge-teal)]",
  },
};

/**
 * Hero peptide card. Shows: name badge, classification line, three
 * stat blocks, route line. Color-coded per peptide identity.
 */
export function QuickCard({
  peptide,
  className,
}: {
  peptide: Peptide;
  className?: string;
}) {
  const c = COLOR_VAR[peptide.color];
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border bg-[var(--color-surface)] p-6",
        c.border,
        className
      )}
    >
      <div
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium",
          c.bg,
          c.text
        )}
      >
        {peptide.name}
      </div>
      <div className="mt-3 text-[13px] text-[var(--color-text-secondary)]">
        {peptide.classification ?? peptide.peptide_class}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        {peptide.hero_stats.map((stat, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className={cn("font-mono text-[20px] font-semibold leading-none", c.text)}>
              {stat.value}
            </span>
            <span className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">
              {stat.label}
            </span>
            {stat.cite && stat.cite.length > 0 && (
              <CitationChip refs={stat.cite} className="ml-0" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-[var(--color-border)] text-[12px] text-[var(--color-text-secondary)] font-mono">
        {peptide.hero_route}
      </div>
    </div>
  );
}

import { cn } from "@/lib/cn";

/**
 * Editorial maturity badge.
 *
 * Atlas-faithful per DESIGN.md (no border-radius, no fill, no ring,
 * no icons in pills, no off-palette tokens). Tier is signalled by:
 *   1. a leading typographic mark (· / ·· / ··· / ★) — scannable rank
 *   2. all-caps mono folio for tiers 1-3, italic Instrument Serif for flagship
 *   3. ink-tone progression mapped to atlas tokens, gold reserved for flagship
 *
 * Color-blind safe: tiers are distinguished by character + label, not just
 * color. Print-faithful per DESIGN.md § 9.
 */

type Maturity = "auto-drafted" | "human-reviewed" | "community-edited" | "flagship";

const TIER_META: Record<
  Maturity,
  { label: string; color: string; mark: string; emphasize?: boolean }
> = {
  "auto-drafted":     { label: "AUTO-DRAFTED",     color: "var(--at-ink-muted)", mark: "·"     },
  "human-reviewed":   { label: "HUMAN-REVIEWED",   color: "var(--at-ink-soft)",  mark: "··"    },
  "community-edited": { label: "COMMUNITY-EDITED", color: "var(--at-ink-warm)",  mark: "···"   },
  "flagship":         { label: "Flagship",         color: "var(--at-gold)",      mark: "★", emphasize: true },
};

export function MaturityBadge({
  maturity,
  className,
}: {
  maturity: Maturity;
  className?: string;
}) {
  const meta = TIER_META[maturity];
  return (
    <span
      className={cn(
        "at-folio inline-flex items-baseline gap-1.5",
        meta.emphasize && "font-serif italic normal-case tracking-normal text-[15px]",
        className,
      )}
      style={{ color: meta.color }}
      aria-label={`Editorial maturity: ${meta.label.toLowerCase()}`}
    >
      <span aria-hidden="true">{meta.mark}</span>
      <span>{meta.label}</span>
    </span>
  );
}

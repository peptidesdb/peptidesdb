import { cn } from "@/lib/cn";
import type { EvidenceLevel } from "@/lib/schemas/peptide";

const LEVEL_LABEL: Record<EvidenceLevel, string> = {
  "fda-approved": "FDA-Approved",
  "phase-3": "Phase 3",
  "phase-2": "Phase 2",
  "phase-1": "Phase 1",
  "animal-strong": "Animal-Strong",
  "animal-mechanistic": "Animal-Mechanistic",
  "human-mechanistic": "Human-Mechanistic",
  anecdotal: "Anecdotal",
  theoretical: "Theoretical",
};

const LEVEL_TONE: Record<EvidenceLevel, string> = {
  "fda-approved":
    "text-[var(--color-motsc)] bg-[var(--color-motsc-soft)] ring-[color:color-mix(in_oklab,var(--color-motsc)_30%,transparent)]",
  "phase-3":
    "text-[var(--color-tesamorelin)] bg-[var(--color-tesamorelin-soft)] ring-[color:color-mix(in_oklab,var(--color-tesamorelin)_30%,transparent)]",
  "phase-2":
    "text-[var(--color-badge-teal)] bg-[var(--color-badge-teal-soft)] ring-[color:color-mix(in_oklab,var(--color-badge-teal)_30%,transparent)]",
  "phase-1":
    "text-[var(--color-badge-teal)] bg-[var(--color-badge-teal-soft)] ring-[color:color-mix(in_oklab,var(--color-badge-teal)_30%,transparent)]",
  "animal-strong":
    "text-[var(--color-badge-yellow)] bg-[var(--color-badge-yellow-soft)] ring-[color:color-mix(in_oklab,var(--color-badge-yellow)_30%,transparent)]",
  "animal-mechanistic":
    "text-[var(--color-badge-yellow)] bg-[var(--color-badge-yellow-soft)] ring-[color:color-mix(in_oklab,var(--color-badge-yellow)_30%,transparent)]",
  "human-mechanistic":
    "text-[var(--color-badge-yellow)] bg-[var(--color-badge-yellow-soft)] ring-[color:color-mix(in_oklab,var(--color-badge-yellow)_30%,transparent)]",
  anecdotal:
    "text-[var(--color-text-muted)] bg-[var(--color-surface-offset)] ring-[var(--color-border)]",
  theoretical:
    "text-[var(--color-text-muted)] bg-[var(--color-surface-offset)] ring-[var(--color-border)]",
};

/** Inline pill for the evidence-rubric tier of a peptide / claim. */
export function EvidenceLevelBadge({
  level,
  className,
}: {
  level: EvidenceLevel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-tight ring-1 ring-inset",
        LEVEL_TONE[level],
        className
      )}
    >
      {LEVEL_LABEL[level]}
    </span>
  );
}

import { cn } from "@/lib/cn";
import type { AdminStep } from "@/lib/schemas/peptide";

/**
 * 5-step administration protocol (reconstitution → site → timing →
 * storage → needle). Reference design: numbered chip + title + body.
 */
export function AdminSteps({
  steps,
  color = "blue",
  className,
}: {
  steps: AdminStep[];
  color?: "blue" | "green" | "purple" | "teal" | "amber" | "rose" | "cyan";
  className?: string;
}) {
  const numClass: Record<string, string> = {
    blue: "bg-[var(--color-tesamorelin-soft)] text-[var(--color-tesamorelin)] ring-[var(--color-tesamorelin-soft)]",
    green: "bg-[var(--color-motsc-soft)] text-[var(--color-motsc)] ring-[var(--color-motsc-soft)]",
    purple: "bg-[rgba(167,139,250,0.16)] text-[#a78bfa] ring-[rgba(167,139,250,0.16)]",
    teal: "bg-[var(--color-badge-teal-soft)] text-[var(--color-badge-teal)] ring-[var(--color-badge-teal-soft)]",
    amber: "bg-[var(--color-badge-yellow-soft)] text-[var(--color-badge-yellow)] ring-[var(--color-badge-yellow-soft)]",
    rose: "bg-[var(--color-badge-red-soft)] text-[var(--color-badge-red)] ring-[var(--color-badge-red-soft)]",
    cyan: "bg-[rgba(34,211,238,0.16)] text-[#22d3ee] ring-[rgba(34,211,238,0.16)]",
  };

  return (
    <ol className={cn("space-y-4", className)}>
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="flex gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
        >
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-[13px] font-semibold ring-1 ring-inset tabular-nums",
              numClass[color] ?? numClass.blue
            )}
          >
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-[var(--color-text)]">
              {step.title}
            </div>
            <div className="mt-1 text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
              {step.body}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

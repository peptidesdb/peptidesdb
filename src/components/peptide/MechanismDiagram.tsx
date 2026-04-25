import { cn } from "@/lib/cn";
import { CitableValueView } from "./CitableValue";
import type { DiagramStep } from "@/lib/schemas/peptide";

/**
 * Vertical pathway diagram (Hypothalamus → Pituitary → Liver → Outcome).
 * Reference dashboard pattern: nodes are pill-shaped, arrows are thin
 * descriptive lines, the final outcome node is highlighted in accent.
 *
 * Each step.text is a CitableValue post-parse — labels can carry citations
 * and flow through the trust metric like every other rendered claim.
 */
export function MechanismDiagram({
  steps,
  color = "blue",
  className,
}: {
  steps: DiagramStep[];
  color?: "blue" | "green" | "purple" | "teal";
  className?: string;
}) {
  if (!steps || steps.length === 0) return null;

  const colorMap: Record<string, { node: string; outcome: string; arrow: string }> = {
    blue: {
      node: "border-[color:color-mix(in_oklab,var(--color-tesamorelin)_30%,transparent)] bg-[var(--color-surface)]",
      outcome:
        "border-[var(--color-tesamorelin)] bg-[var(--color-tesamorelin-soft)] text-[var(--color-tesamorelin)]",
      arrow: "text-[var(--color-text-muted)]",
    },
    green: {
      node: "border-[color:color-mix(in_oklab,var(--color-motsc)_30%,transparent)] bg-[var(--color-surface)]",
      outcome:
        "border-[var(--color-motsc)] bg-[var(--color-motsc-soft)] text-[var(--color-motsc)]",
      arrow: "text-[var(--color-text-muted)]",
    },
    purple: {
      node: "border-[rgba(167,139,250,0.30)] bg-[var(--color-surface)]",
      outcome: "border-[#a78bfa] bg-[rgba(167,139,250,0.15)] text-[#a78bfa]",
      arrow: "text-[var(--color-text-muted)]",
    },
    teal: {
      node: "border-[color:color-mix(in_oklab,var(--color-badge-teal)_30%,transparent)] bg-[var(--color-surface)]",
      outcome:
        "border-[var(--color-badge-teal)] bg-[var(--color-badge-teal-soft)] text-[var(--color-badge-teal)]",
      arrow: "text-[var(--color-text-muted)]",
    },
  };
  const c = colorMap[color] ?? colorMap.blue;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {steps.map((step, i) => {
        if (step.kind === "arrow") {
          return (
            <div
              key={i}
              className={cn(
                "px-3 py-1 text-[11px] font-mono leading-tight",
                c.arrow,
              )}
            >
              <CitableValueView value={step.text} inline />
            </div>
          );
        }
        return (
          <div
            key={i}
            className={cn(
              "rounded-[var(--radius-md)] border px-4 py-3 text-[13px] font-medium",
              step.kind === "outcome" ? c.outcome : c.node,
            )}
          >
            <CitableValueView value={step.text} inline />
          </div>
        );
      })}
    </div>
  );
}

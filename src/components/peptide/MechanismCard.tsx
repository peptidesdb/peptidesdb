import { cn } from "@/lib/cn";
import { CitableValueView } from "./CitableValue";
import { MechanismDiagram } from "./MechanismDiagram";
import type { MechanismSection, Peptide } from "@/lib/schemas/peptide";

type CitableMechKey =
  | "primary_target"
  | "pathway"
  | "downstream_effect"
  | "feedback_intact"
  | "origin"
  | "antibody_development"
  | "receptor_class"
  | "half_life_basis";

const MECH_FIELDS: Array<{ key: CitableMechKey; label: string }> = [
  { key: "primary_target", label: "Primary target" },
  { key: "pathway", label: "Pathway" },
  { key: "downstream_effect", label: "Downstream effect" },
  { key: "feedback_intact", label: "Feedback intact?" },
  { key: "origin", label: "Origin" },
  { key: "antibody_development", label: "Antibody development" },
  { key: "receptor_class", label: "Receptor class" },
  { key: "half_life_basis", label: "Half-life basis" },
];

/**
 * Mechanism-of-action info-block + diagram. Renders rows for each
 * structured field that exists, plus any extra_rows in declaration order,
 * plus the optional pathway diagram.
 */
export function MechanismCard({
  mechanism,
  color,
  className,
}: {
  mechanism: MechanismSection;
  color: NonNullable<Peptide["color"]>;
  className?: string;
}) {
  const diagramColor: "blue" | "green" | "purple" | "teal" = ((): "blue" | "green" | "purple" | "teal" => {
    if (color === "green") return "green";
    if (color === "purple") return "purple";
    if (color === "teal") return "teal";
    return "blue";
  })();

  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6",
        className
      )}
    >
      <dl className="space-y-3">
        {MECH_FIELDS.map(({ key, label }) => {
          const v = mechanism[key];
          if (!v) return null;
          return (
            <div
              key={String(key)}
              className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4 pb-3 border-b border-[var(--color-border)] last:border-0 last:pb-0"
            >
              <dt className="text-[12px] uppercase tracking-wider text-[var(--color-text-muted)] sm:w-44 sm:shrink-0">
                {label}
              </dt>
              <dd className="text-[13px] text-[var(--color-text)] flex-1">
                <CitableValueView value={v} inline />
              </dd>
            </div>
          );
        })}
        {mechanism.extra_rows?.map((r) => (
          <div
            key={r.key}
            className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4 pb-3 border-b border-[var(--color-border)] last:border-0 last:pb-0"
          >
            <dt className="text-[12px] uppercase tracking-wider text-[var(--color-text-muted)] sm:w-44 sm:shrink-0">
              {r.key}
            </dt>
            <dd className="text-[13px] text-[var(--color-text)] flex-1">
              <CitableValueView value={r.value} inline />
            </dd>
          </div>
        ))}
      </dl>
      {mechanism.diagram && mechanism.diagram.length > 0 && (
        <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
          <div className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
            Pathway diagram
          </div>
          <MechanismDiagram steps={mechanism.diagram} color={diagramColor} />
        </div>
      )}
    </div>
  );
}

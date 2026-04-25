import { cn } from "@/lib/cn";
import { CitableValueView } from "@/components/peptide/CitableValue";
import type {
  CitableValue,
  Peptide,
  TableRow,
  AdminStep,
} from "@/lib/schemas/peptide";

type SectionKey =
  | "mechanism"
  | "dosage_rows"
  | "fat_loss_rows"
  | "side_effects_rows"
  | "administration_steps";

interface MechanismColumn {
  key:
    | "primary_target"
    | "pathway"
    | "downstream_effect"
    | "feedback_intact"
    | "origin"
    | "antibody_development"
    | "receptor_class"
    | "half_life_basis";
  label: string;
}

/* =========================================================
   ParameterGrid
   N-way (1, 2, 3) parameter-aligned comparison renderer.
   For each parameter row, shows the cell value for each
   peptide column. Empty cells render as a muted dash so the
   user immediately sees "no data" vs "no citation."
   ========================================================= */

const COLOR_HEADER: Record<NonNullable<Peptide["color"]>, string> = {
  blue: "text-[var(--color-tesamorelin)]",
  green: "text-[var(--color-motsc)]",
  purple: "text-[#a78bfa]",
  amber: "text-[var(--color-badge-yellow)]",
  rose: "text-[var(--color-badge-red)]",
  cyan: "text-[#22d3ee]",
  teal: "text-[var(--color-badge-teal)]",
};

interface Row {
  parameter: string;
  cells: (CitableValue | null)[]; // one per peptide
  notes?: (string | undefined)[];
}

function pickMechanism(p: Peptide, col: MechanismColumn): CitableValue | null {
  const v = p.mechanism[col.key];
  return v ?? null;
}

function buildRows(
  peptides: Peptide[],
  section: SectionKey,
  mechCols?: MechanismColumn[],
): Row[] {
  if (section === "mechanism" && mechCols) {
    return mechCols.map((col) => ({
      parameter: col.label,
      cells: peptides.map((p) => pickMechanism(p, col)),
    }));
  }
  if (section === "dosage_rows" || section === "fat_loss_rows" || section === "side_effects_rows") {
    // Union of all parameters across peptides, in first-seen order
    const order: string[] = [];
    const seen = new Set<string>();
    const tableByPeptide = peptides.map((p): TableRow[] => {
      if (section === "dosage_rows") return p.dosage.rows;
      if (section === "fat_loss_rows") return p.fat_loss?.rows ?? [];
      return p.side_effects.rows;
    });
    for (const rows of tableByPeptide) {
      for (const r of rows) {
        if (!seen.has(r.parameter)) {
          seen.add(r.parameter);
          order.push(r.parameter);
        }
      }
    }
    return order.map((param) => ({
      parameter: param,
      cells: tableByPeptide.map((rows) => {
        const r = rows.find((x) => x.parameter === param);
        return r ? r.value : null;
      }),
      notes: tableByPeptide.map((rows) => rows.find((x) => x.parameter === param)?.notes),
    }));
  }
  if (section === "administration_steps") {
    // Step-1, Step-2, etc — line up by step index. Preserve step.cite so
    // the compare-page surfaces the same citation evidence that the
    // single-peptide page (and the trust metric) does.
    const maxSteps = Math.max(
      ...peptides.map((p) => p.administration.steps.length),
    );
    const rows: Row[] = [];
    for (let i = 0; i < maxSteps; i++) {
      const stepName = peptides
        .map((p) => p.administration.steps[i])
        .find((s): s is AdminStep => !!s)?.title ?? `Step ${i + 1}`;
      rows.push({
        parameter: `${i + 1}. ${stepName}`,
        cells: peptides.map((p) => {
          const step = p.administration.steps[i];
          if (!step) return null;
          return { value: step.body, cite: step.cite ?? [] };
        }),
      });
    }
    return rows;
  }
  return [];
}

export function ParameterGrid({
  peptides,
  section,
  columns,
}: {
  peptides: Peptide[];
  section: SectionKey;
  columns?: MechanismColumn[];
}) {
  const rows = buildRows(peptides, section, columns);
  if (rows.length === 0) return null;

  const colWidth =
    peptides.length === 1
      ? "minmax(0,1fr)"
      : peptides.length === 2
        ? "minmax(0,1fr) minmax(0,1fr)"
        : "minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)";

  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* Header row */}
      <div
        className="grid border-b border-[var(--color-border)] bg-[color:color-mix(in_oklab,var(--color-surface-offset)_50%,transparent)]"
        style={{
          gridTemplateColumns: `200px ${colWidth}`,
        }}
      >
        <div className="px-4 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
          Parameter
        </div>
        {peptides.map((p) => (
          <div
            key={p.slug}
            className={cn(
              "px-4 py-3 text-[11px] uppercase tracking-wider font-semibold",
              COLOR_HEADER[p.color] ?? COLOR_HEADER.blue,
            )}
          >
            {p.name}
          </div>
        ))}
      </div>

      {/* Body */}
      {rows.map((row, i) => (
        <div
          key={`${row.parameter}-${i}`}
          className="grid border-b border-[var(--color-border)] last:border-0 hover:bg-[color:color-mix(in_oklab,var(--color-surface-offset)_30%,transparent)] transition-colors"
          style={{
            gridTemplateColumns: `200px ${colWidth}`,
          }}
        >
          <div className="px-4 py-3 text-[12px] font-medium text-[var(--color-text-secondary)]">
            {row.parameter}
          </div>
          {row.cells.map((cell, ci) => (
            <div key={ci} className="px-4 py-3 text-[13px]">
              {cell ? (
                <>
                  <CitableValueView value={cell} inline />
                  {row.notes?.[ci] && (
                    <div className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                      {row.notes[ci]}
                    </div>
                  )}
                </>
              ) : (
                <span className="text-[var(--color-text-muted)] font-mono text-[12px]">
                  —
                </span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

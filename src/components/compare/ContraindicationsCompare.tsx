import { cn } from "@/lib/cn";
import { AlertOctagon, AlertTriangle } from "lucide-react";
import { CitationChip } from "@/components/peptide/CitationChip";
import type { Peptide } from "@/lib/schemas/peptide";

const COLOR_HEADER: Record<NonNullable<Peptide["color"]>, string> = {
  blue: "text-[var(--color-tesamorelin)]",
  green: "text-[var(--color-motsc)]",
  purple: "text-[#a78bfa]",
  amber: "text-[var(--color-badge-yellow)]",
  rose: "text-[var(--color-badge-red)]",
  cyan: "text-[#22d3ee]",
  teal: "text-[var(--color-badge-teal)]",
};

/**
 * Side-by-side absolute + relative contraindications for the /compare
 * route. Renders the same data as ContraindicationPanel but in N columns
 * so the trust metric on the compare page is verifiable per peptide.
 */
export function ContraindicationsCompare({
  peptides,
}: {
  peptides: Peptide[];
}) {
  const hasAny = peptides.some(
    (p) =>
      (p.side_effects.contraindications_absolute?.length ?? 0) > 0 ||
      (p.side_effects.contraindications_relative?.length ?? 0) > 0,
  );
  if (!hasAny) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Absolute */}
      <div
        className={cn(
          "rounded-[var(--radius-lg)] border p-5",
          "border-[color:color-mix(in_oklab,var(--color-badge-red)_35%,transparent)]",
          "bg-[var(--color-badge-red-soft)]",
        )}
      >
        <div className="flex items-center gap-2 text-[var(--color-badge-red)] mb-4">
          <AlertOctagon size={16} strokeWidth={2.5} />
          <span className="font-semibold tracking-tight uppercase text-[12px]">
            Absolute Contraindications
          </span>
        </div>
        <div className="space-y-4">
          {peptides.map((p) => (
            <div key={p.slug}>
              <div
                className={cn(
                  "text-[11px] uppercase tracking-wider mb-2 font-semibold",
                  COLOR_HEADER[p.color] ?? COLOR_HEADER.blue,
                )}
              >
                {p.name}
              </div>
              {(p.side_effects.contraindications_absolute?.length ?? 0) === 0 ? (
                <span className="text-[12px] text-[var(--color-text-muted)] font-mono">
                  —
                </span>
              ) : (
                <ul className="space-y-1.5 text-[13px] text-[var(--color-text)]">
                  {p.side_effects.contraindications_absolute!.map((c, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[var(--color-badge-red)]">·</span>
                      <span>
                        {c.value}
                        {c.cite && c.cite.length > 0 && (
                          <CitationChip refs={c.cite} />
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Relative */}
      <div
        className={cn(
          "rounded-[var(--radius-lg)] border p-5",
          "border-[color:color-mix(in_oklab,var(--color-badge-yellow)_35%,transparent)]",
          "bg-[var(--color-badge-yellow-soft)]",
        )}
      >
        <div className="flex items-center gap-2 text-[var(--color-badge-yellow)] mb-4">
          <AlertTriangle size={16} strokeWidth={2.5} />
          <span className="font-semibold tracking-tight uppercase text-[12px]">
            Relative Contraindications
          </span>
        </div>
        <div className="space-y-4">
          {peptides.map((p) => (
            <div key={p.slug}>
              <div
                className={cn(
                  "text-[11px] uppercase tracking-wider mb-2 font-semibold",
                  COLOR_HEADER[p.color] ?? COLOR_HEADER.blue,
                )}
              >
                {p.name}
              </div>
              {(p.side_effects.contraindications_relative?.length ?? 0) === 0 ? (
                <span className="text-[12px] text-[var(--color-text-muted)] font-mono">
                  —
                </span>
              ) : (
                <ul className="space-y-1.5 text-[13px] text-[var(--color-text)]">
                  {p.side_effects.contraindications_relative!.map((c, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[var(--color-badge-yellow)]">·</span>
                      <span>
                        {c.value}
                        {c.cite && c.cite.length > 0 && (
                          <CitationChip refs={c.cite} />
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

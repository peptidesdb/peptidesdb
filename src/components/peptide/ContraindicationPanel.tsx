import { cn } from "@/lib/cn";
import { AlertOctagon, AlertTriangle } from "lucide-react";

/**
 * Two-block contraindication panel. Mirrors reference dashboard's
 * absolute (red) vs relative (yellow) split.
 */
export function ContraindicationPanel({
  absolute,
  relative,
  className,
}: {
  absolute?: string[];
  relative?: string[];
  className?: string;
}) {
  if ((!absolute || absolute.length === 0) && (!relative || relative.length === 0)) {
    return null;
  }
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6", className)}>
      {absolute && absolute.length > 0 && (
        <div
          className={cn(
            "rounded-[var(--radius-lg)] border p-5",
            "border-[color:color-mix(in_oklab,var(--color-badge-red)_35%,transparent)]",
            "bg-[var(--color-badge-red-soft)]"
          )}
        >
          <div className="flex items-center gap-2 text-[var(--color-badge-red)] mb-3">
            <AlertOctagon size={16} strokeWidth={2.5} />
            <span className="font-semibold tracking-tight uppercase text-[12px]">
              Absolute Contraindications
            </span>
          </div>
          <ul className="space-y-2 text-[13px] text-[var(--color-text)]">
            {absolute.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[var(--color-badge-red)]">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {relative && relative.length > 0 && (
        <div
          className={cn(
            "rounded-[var(--radius-lg)] border p-5",
            "border-[color:color-mix(in_oklab,var(--color-badge-yellow)_35%,transparent)]",
            "bg-[var(--color-badge-yellow-soft)]"
          )}
        >
          <div className="flex items-center gap-2 text-[var(--color-badge-yellow)] mb-3">
            <AlertTriangle size={16} strokeWidth={2.5} />
            <span className="font-semibold tracking-tight uppercase text-[12px]">
              Relative Contraindications
            </span>
          </div>
          <ul className="space-y-2 text-[13px] text-[var(--color-text)]">
            {relative.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[var(--color-badge-yellow)]">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

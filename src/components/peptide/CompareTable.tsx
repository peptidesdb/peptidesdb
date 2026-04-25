"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { CitableValueView } from "./CitableValue";
import type { TableRow } from "@/lib/schemas/peptide";

/* CitableValueView already imported above — used for both value + notes cells. */

/**
 * Sortable comparison table. Each row's `value` may be a CitableValue.
 * Click a column header to sort. Mirrors reference dashboard sortable-th
 * pattern but reactive instead of imperative.
 */
export function CompareTable({
  rows,
  className,
  columns = ["Parameter", "Value", "Notes"],
  showSeverity = false,
}: {
  rows: TableRow[];
  className?: string;
  columns?: string[];
  showSeverity?: boolean;
}) {
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [asc, setAsc] = useState(true);

  function handleSort(col: number) {
    if (sortCol === col) {
      setAsc(!asc);
    } else {
      setSortCol(col);
      setAsc(true);
    }
  }

  function valueText(row: TableRow, col: number): string {
    if (col === 0) return row.parameter;
    if (col === 1) {
      return typeof row.value === "string" ? row.value : row.value.value;
    }
    if (col === 2) return row.notes?.value ?? "";
    if (col === 3 && showSeverity) return row.severity ?? "";
    return "";
  }

  let display = rows;
  if (sortCol !== null) {
    display = [...rows].sort((a, b) => {
      const at = valueText(a, sortCol);
      const bt = valueText(b, sortCol);
      const an = parseFloat(at.replace(/[^0-9.-]/g, ""));
      const bn = parseFloat(bt.replace(/[^0-9.-]/g, ""));
      let cmp: number;
      if (!isNaN(an) && !isNaN(bn)) cmp = an - bn;
      else cmp = at.localeCompare(bt);
      return asc ? cmp : -cmp;
    });
  }

  const cols = showSeverity ? [...columns, "Severity"] : columns;

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]",
        className
      )}
    >
      <table className="min-w-full text-[13px]">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            {cols.map((col, i) => (
              <th
                key={col}
                onClick={() => handleSort(i)}
                className={cn(
                  "px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider cursor-pointer select-none",
                  "text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors",
                  sortCol === i && "text-[var(--color-text)]"
                )}
              >
                <span className="inline-flex items-center gap-1">
                  {col}
                  <span className="text-[10px]">
                    {sortCol === i ? (asc ? "▲" : "▼") : "⇅"}
                  </span>
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {display.map((row, i) => (
            <tr
              key={i}
              className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-offset)] transition-colors"
            >
              <td className="px-4 py-3 font-medium text-[var(--color-text-secondary)] align-top">
                {row.parameter}
              </td>
              <td className="px-4 py-3 align-top">
                <CitableValueView value={row.value} inline />
              </td>
              <td className="px-4 py-3 text-[var(--color-text-muted)] align-top">
                {row.notes ? <CitableValueView value={row.notes} inline /> : ""}
              </td>
              {showSeverity && (
                <td className="px-4 py-3 align-top">
                  {row.severity && (
                    <span
                      className={cn(
                        "inline-block px-2 py-0.5 rounded text-[11px] font-medium ring-1 ring-inset",
                        row.severity === "mild" &&
                          "text-[var(--color-badge-green)] bg-[var(--color-badge-green-soft)] ring-[var(--color-badge-green-soft)]",
                        row.severity === "moderate" &&
                          "text-[var(--color-badge-yellow)] bg-[var(--color-badge-yellow-soft)] ring-[var(--color-badge-yellow-soft)]",
                        row.severity === "severe" &&
                          "text-[var(--color-badge-red)] bg-[var(--color-badge-red-soft)] ring-[var(--color-badge-red-soft)]"
                      )}
                    >
                      {row.severity}
                    </span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

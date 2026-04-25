"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "mechanism", label: "Mechanism" },
  { id: "dosage", label: "Dosage" },
  { id: "fat-loss", label: "Fat Loss" },
  { id: "side-effects", label: "Side Effects" },
  { id: "synergy", label: "Synergy" },
  { id: "administration", label: "Administration" },
] as const;

/**
 * Section filter chips. When non-"all" is selected, hides every
 * `<section data-category="...">` whose category does not match.
 * Pure DOM manipulation — works with SSG content. Persists in URL hash.
 */
export function SectionFilter({
  available,
}: {
  /** Subset of category IDs that exist on the current peptide. */
  available: string[];
}) {
  const [active, setActive] = useState<string>("all");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && (hash === "all" || available.includes(hash))) {
      apply(hash);
      setActive(hash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function apply(filter: string) {
    const all = document.querySelectorAll<HTMLElement>("section[data-category]");
    all.forEach((sec) => {
      const cat = sec.getAttribute("data-category") ?? "";
      if (filter === "all") {
        sec.classList.remove("hidden");
      } else {
        sec.classList.toggle("hidden", cat !== filter);
      }
    });
    if (filter === "all") {
      history.replaceState(null, "", window.location.pathname);
    } else {
      history.replaceState(null, "", `#${filter}`);
    }
  }

  function handleClick(id: string) {
    setActive(id);
    apply(id);
  }

  const visibleFilters = FILTERS.filter((f) => f.id === "all" || available.includes(f.id));

  return (
    <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-[color:color-mix(in_oklab,var(--color-background)_88%,transparent)] backdrop-blur-md border-b border-[var(--color-border)] no-print">
      <div className="flex items-center gap-3 overflow-x-auto">
        <span className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] shrink-0">
          Filter sections
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {visibleFilters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleClick(f.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ring-1 ring-inset",
                active === f.id
                  ? "bg-[var(--color-tesamorelin)] text-white ring-[var(--color-tesamorelin)]"
                  : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] ring-[var(--color-border)] hover:text-[var(--color-text)] hover:ring-[var(--color-border-strong)]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

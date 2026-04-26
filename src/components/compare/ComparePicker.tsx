"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { ArrowRight, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { EmptyState } from "@/components/site/EmptyState";

export interface PeptideSummary {
  slug: string;
  name: string;
  peptide_class: string;
  classification?: string;
  color: string;
  aliases: string[];
  evidence_level: string;
}

const COLOR_DOT: Record<string, string> = {
  blue: "bg-[var(--color-tesamorelin)]",
  green: "bg-[var(--color-motsc)]",
  purple: "bg-[#a78bfa]",
  amber: "bg-[var(--color-badge-yellow)]",
  rose: "bg-[var(--color-badge-red)]",
  cyan: "bg-[#22d3ee]",
  teal: "bg-[var(--color-badge-teal)]",
};

/**
 * Two-slot peptide picker for the /compare landing page. Fuse.js fuzzy
 * search across name + class + aliases. Submits to /compare/[a]-vs-[b].
 */
export function ComparePicker({ peptides }: { peptides: PeptideSummary[] }) {
  const router = useRouter();
  const [a, setA] = useState<PeptideSummary | null>(null);
  const [b, setB] = useState<PeptideSummary | null>(null);

  const onPick = (slot: "a" | "b", p: PeptideSummary | null) => {
    if (slot === "a") setA(p);
    else setB(p);
  };

  const ready = a && b && a.slug !== b.slug;

  function go() {
    if (!ready) return;
    router.push(`/compare/${a.slug}-vs-${b.slug}`);
  }

  return (
    <div className="space-y-6">
      {!a && !b && (
        <EmptyState
          message="Choose two peptides to compare."
          action={{ label: "Browse the catalogue", href: "/catalog" }}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PeptideSlot
          label="Peptide A"
          peptides={peptides}
          selected={a}
          excludeSlug={b?.slug}
          onPick={(p) => onPick("a", p)}
        />
        <PeptideSlot
          label="Peptide B"
          peptides={peptides}
          selected={b}
          excludeSlug={a?.slug}
          onPick={(p) => onPick("b", p)}
        />
      </div>

      <div className="flex items-center justify-end">
        <button
          type="button"
          disabled={!ready}
          onClick={go}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-opacity",
            ready
              ? "bg-[var(--color-accent)] text-[#0c1421] hover:opacity-90"
              : "bg-[var(--color-surface-offset)] text-[var(--color-text-muted)] cursor-not-allowed"
          )}
        >
          Compare {a?.name ?? "Peptide A"} vs {b?.name ?? "Peptide B"}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

function PeptideSlot({
  label,
  peptides,
  selected,
  excludeSlug,
  onPick,
}: {
  label: string;
  peptides: PeptideSummary[];
  selected: PeptideSummary | null;
  excludeSlug?: string;
  onPick: (p: PeptideSummary | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const fuse = useMemo(
    () =>
      new Fuse(peptides, {
        keys: ["name", "peptide_class", "aliases", "classification"],
        threshold: 0.4,
        includeScore: true,
      }),
    [peptides],
  );

  const results = useMemo(() => {
    if (!query.trim()) return peptides.slice(0, 8);
    return fuse.search(query).slice(0, 8).map((r) => r.item);
  }, [query, peptides, fuse]);

  if (selected) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
          {label}
        </div>
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "size-2.5 rounded-full mt-2 shrink-0",
              COLOR_DOT[selected.color] ?? COLOR_DOT.blue,
            )}
          />
          <div className="flex-1 min-w-0">
            <div className="text-[18px] font-semibold text-[var(--color-text)]">
              {selected.name}
            </div>
            <div className="text-[12px] text-[var(--color-text-muted)] font-mono">
              {selected.classification ?? selected.peptide_class}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onPick(null)}
            aria-label="Clear selection"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
        {label}
      </div>
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder="Search peptides..."
          className="w-full pl-9 pr-3 py-2 rounded-md text-[13px] bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-tesamorelin)] focus:ring-2 focus:ring-[var(--color-tesamorelin-soft)] outline-none transition-colors text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
        />
      </div>
      {open && results.length > 0 && (
        <ul className="mt-2 max-h-64 overflow-y-auto rounded-md border border-[var(--color-border)] bg-[var(--color-background)] divide-y divide-[var(--color-border)]">
          {results
            .filter((p) => p.slug !== excludeSlug)
            .map((p) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onPick(p);
                  }}
                  className="w-full px-3 py-2 flex items-center gap-3 text-left hover:bg-[var(--color-surface-offset)] transition-colors"
                >
                  <span
                    className={cn(
                      "size-2 rounded-full shrink-0",
                      COLOR_DOT[p.color] ?? COLOR_DOT.blue,
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-[var(--color-text)]">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-[var(--color-text-muted)] truncate">
                      {p.classification ?? p.peptide_class}
                    </div>
                  </div>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

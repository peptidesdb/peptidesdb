"use client";

import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  detectStackConflicts,
  type StackConflict,
} from "@/lib/stack-conflicts";
import type { Peptide } from "@/lib/schemas/peptide";
import { EmptyState } from "@/components/site/EmptyState";

interface PeptideLite {
  slug: string;
  name: string;
  peptide_class: string;
  classification?: string;
  color: NonNullable<Peptide["color"]>;
  aliases: string[];
  evidence_level: string;
  categories: string[];
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

const SEVERITY_TONE: Record<
  StackConflict["severity"],
  { ring: string; text: string; bg: string; Icon: typeof Info }
> = {
  info: {
    ring: "ring-[var(--color-badge-teal-soft)]",
    text: "text-[var(--color-badge-teal)]",
    bg: "bg-[var(--color-badge-teal-soft)]",
    Icon: Sparkles,
  },
  caution: {
    ring: "ring-[var(--color-badge-yellow-soft)]",
    text: "text-[var(--color-badge-yellow)]",
    bg: "bg-[var(--color-badge-yellow-soft)]",
    Icon: AlertTriangle,
  },
  warn: {
    ring: "ring-[var(--color-badge-yellow-soft)]",
    text: "text-[var(--color-badge-yellow)]",
    bg: "bg-[var(--color-badge-yellow-soft)]",
    Icon: AlertTriangle,
  },
  block: {
    ring: "ring-[var(--color-badge-red-soft)]",
    text: "text-[var(--color-badge-red)]",
    bg: "bg-[var(--color-badge-red-soft)]",
    Icon: AlertOctagon,
  },
};

/**
 * Interactive stack designer. Search the catalog, click peptides to add
 * them to your stack, see rule-based conflict warnings + recognised
 * synergies, and share the URL.
 *
 * State is encoded in the query string: ?p=slug-a,slug-b,slug-c
 * Initial selection comes from URL on mount; subsequent edits update it.
 */
export function StackDesigner({ peptides }: { peptides: PeptideLite[] }) {
  const [selected, setSelected] = useState<PeptideLite[]>([]);
  const [query, setQuery] = useState("");

  // Hydrate from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("p");
    if (p) {
      const slugs = p.split(",");
      const found = slugs
        .map((s) => peptides.find((x) => x.slug === s))
        .filter((x): x is PeptideLite => !!x);
      setSelected(found);
    }
    // Listen for back/forward
    const onPop = () => {
      const ps = new URLSearchParams(window.location.search);
      const pp = ps.get("p");
      if (pp) {
        const slugs = pp.split(",");
        setSelected(
          slugs
            .map((s) => peptides.find((x) => x.slug === s))
            .filter((x): x is PeptideLite => !!x),
        );
      } else {
        setSelected([]);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [peptides]);

  // Sync URL when selection changes
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selected.length > 0) {
      url.searchParams.set("p", selected.map((s) => s.slug).join(","));
    } else {
      url.searchParams.delete("p");
    }
    history.replaceState(null, "", url.toString());
  }, [selected]);

  const fuse = useMemo(
    () =>
      new Fuse(peptides, {
        keys: ["name", "peptide_class", "aliases", "classification"],
        threshold: 0.4,
      }),
    [peptides],
  );

  const results = useMemo(() => {
    const pool = peptides.filter((p) => !selected.some((s) => s.slug === p.slug));
    if (!query.trim()) return pool.slice(0, 12);
    return fuse
      .search(query)
      .map((r) => r.item)
      .filter((p) => !selected.some((s) => s.slug === p.slug))
      .slice(0, 12);
  }, [query, peptides, selected, fuse]);

  const conflicts = useMemo(
    () =>
      detectStackConflicts(
        // Cast PeptideLite → Peptide for the rule input. Rules only read
        // categories + slug + name + synergy, all of which are covered.
        selected as unknown as Peptide[],
      ),
    [selected],
  );

  function add(p: PeptideLite) {
    setSelected((s) => [...s, p]);
    setQuery("");
  }

  function remove(slug: string) {
    setSelected((s) => s.filter((p) => p.slug !== slug));
  }

  function clearAll() {
    setSelected([]);
    setQuery("");
  }

  function copyShareLink() {
    void navigator.clipboard
      ?.writeText(window.location.href)
      .catch(() => {});
  }

  const blockingConflicts = conflicts.filter((c) => c.severity === "block");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">
      {/* LEFT: catalog picker */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:sticky lg:top-24 self-start max-h-[80vh] overflow-y-auto">
        <div className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
          Catalog ({peptides.length})
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
            placeholder="Search…"
            className="w-full pl-9 pr-3 py-2 rounded-md text-[13px] bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-tesamorelin)] focus:ring-2 focus:ring-[var(--color-tesamorelin-soft)] outline-none transition-colors text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
          />
        </div>
        <ul className="mt-3 space-y-1">
          {results.length === 0 ? (
            <li className="text-[12px] text-[var(--color-text-muted)] px-2 py-3">
              {query ? "No matches" : "All peptides selected"}
            </li>
          ) : (
            results.map((p) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => add(p)}
                  className="w-full px-2 py-2 flex items-center gap-2 text-left rounded-md hover:bg-[var(--color-surface-offset)] transition-colors group"
                >
                  <span className={cn("size-2 rounded-full shrink-0", COLOR_DOT[p.color] ?? COLOR_DOT.blue)} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13px] font-medium text-[var(--color-text)] truncate">
                      {p.name}
                    </span>
                    <span className="block text-[10px] text-[var(--color-text-muted)] truncate">
                      {p.peptide_class}
                    </span>
                  </span>
                  <Plus
                    size={14}
                    className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors"
                  />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* RIGHT: selected stack + conflicts */}
      <div className="space-y-4">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-baseline justify-between mb-4">
            <div className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
              Your stack ({selected.length})
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={copyShareLink}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                >
                  Copy share link
                </button>
              )}
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-badge-red)] transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {selected.length === 0 ? (
            <EmptyState
              message="The atlas waits."
              detail="Add peptides from the catalogue to design a stack."
              action={{ label: "Browse plates", href: "/catalog" }}
            />
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selected.map((p) => (
                <li
                  key={p.slug}
                  className="flex items-start gap-3 p-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-offset)]"
                >
                  <span
                    className={cn(
                      "size-2.5 rounded-full mt-1.5 shrink-0",
                      COLOR_DOT[p.color] ?? COLOR_DOT.blue,
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <a
                      href={`/p/${p.slug}`}
                      className="block text-[14px] font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors truncate"
                    >
                      {p.name}
                    </a>
                    <div className="text-[11px] text-[var(--color-text-muted)] truncate">
                      {p.classification ?? p.peptide_class}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(p.slug)}
                    aria-label={`Remove ${p.name}`}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Conflicts + recognised synergies */}
        {conflicts.length > 0 && (
          <div className="space-y-2">
            <div className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
              Stack analysis ({conflicts.length})
            </div>
            {conflicts.map((c, i) => {
              const tone = SEVERITY_TONE[c.severity];
              const Icon = tone.Icon;
              return (
                <div
                  key={i}
                  className={cn(
                    "rounded-[var(--radius-md)] border p-4 ring-1 ring-inset",
                    tone.bg,
                    tone.ring,
                  )}
                >
                  <div className={cn("flex items-center gap-2 mb-1", tone.text)}>
                    <Icon size={14} strokeWidth={2.5} />
                    <span className="text-[12px] font-semibold uppercase tracking-wider">
                      {c.severity}
                    </span>
                    <span className="text-[13px] font-semibold text-[var(--color-text)] ml-1">
                      {c.title}
                    </span>
                  </div>
                  <div className="text-[12px] leading-relaxed text-[var(--color-text-secondary)]">
                    {c.detail}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {blockingConflicts.length === 0 && selected.length >= 2 && (
          <div className="rounded-[var(--radius-md)] border border-[var(--color-motsc-soft)] bg-[var(--color-motsc-soft)] p-4 ring-1 ring-inset ring-[var(--color-motsc-soft)]">
            <div className="flex items-center gap-2 text-[var(--color-motsc)] mb-1">
              <Sparkles size={14} strokeWidth={2.5} />
              <span className="text-[12px] font-semibold uppercase tracking-wider">
                No blocking conflicts
              </span>
            </div>
            <div className="text-[12px] leading-relaxed text-[var(--color-text-secondary)]">
              {selected.length}-peptide stack passed the structural rule check.
              Always confirm with current literature, your clinician, and your
              own monitoring (HbA1c, IGF-1, lipid panel as appropriate).
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

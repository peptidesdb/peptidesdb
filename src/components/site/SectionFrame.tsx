/*
 * SectionFrame — pass-through section heading + per-section "Edit on GitHub"
 * pencil affordance.
 *
 * Per D17, the component renders its heading INLINE before children using
 * a React fragment — it does NOT wrap children in a <div>. That preserves
 * the layout shape of the surrounding <section> (border / grid / table
 * layouts in existing sections would break under a wrapping element).
 *
 * Per D11, this is the single host for cross-cutting per-section
 * affordances. Future cross-cutting features (issue link, contributors
 * facet) hang off the same heading.
 *
 * Per D5, hover state for the pencil is single gold across all plates.
 * Mobile: pencil always at 30% opacity. Desktop: 0 → 30% on header hover.
 *
 * Line number powering the GitHub deep-link comes from the build-time
 * yaml-line-map (Phase 6.1, D10). Fallback to #L1 when missing.
 */
import type { ReactNode } from "react";
import {
  PEPTIDE_LINES,
  type SectionKey,
} from "@/generated/peptide-lines";

const REPO_BASE = "https://github.com/peptidesdb/peptidesdb/edit/main";

export interface SectionFrameProps {
  slug: string;
  sectionKey: SectionKey;
  number: string;
  title: string;
  children: ReactNode;
}

export function buildSectionEditUrl(slug: string, key: SectionKey): string {
  const line = PEPTIDE_LINES[slug]?.[key] ?? 1;
  return `${REPO_BASE}/content/peptides/${slug}.yaml#L${line}`;
}

export function SectionFrame({
  slug,
  sectionKey,
  number,
  title,
  children,
}: SectionFrameProps) {
  const editUrl = buildSectionEditUrl(slug, sectionKey);
  return (
    <>
      <header className="group flex items-baseline gap-3 sm:gap-4 mb-6">
        <span className="at-folio text-[11px] tracking-[0.22em] text-[var(--at-soft)] shrink-0">
          {number}
        </span>
        <h2 className="font-serif text-[24px] sm:text-[28px] leading-[1.2] text-[var(--at-ink)] flex-1 m-0">
          {title}
        </h2>
        <a
          href={editUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Edit ${title} section on GitHub`}
          className="at-folio text-[10px] tracking-[0.22em] shrink-0 opacity-30 sm:opacity-0 sm:group-hover:opacity-30 hover:!opacity-100 hover:text-[var(--at-gold)] focus-visible:opacity-100 focus-visible:text-[var(--at-gold)] transition-opacity duration-150"
        >
          Edit ↗
        </a>
      </header>
      {children}
    </>
  );
}

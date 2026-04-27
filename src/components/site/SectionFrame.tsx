/*
 * SectionFrame — pass-through section heading + per-section "Edit on GitHub"
 * affordance.
 *
 * Per D17, the component renders its heading column INLINE before children
 * via React fragment — it does NOT wrap children. The plate page's outer
 * <section> uses `grid grid-cols-12`; SectionFrame renders the left
 * heading column (col-span-12 lg:col-span-3) and the consumer supplies the
 * body column(s) as children. Children remain direct grid items of the
 * outer section, preserving every existing layout (border / table / inner
 * grid / list).
 *
 * Per D11, this is the single host for cross-cutting per-section
 * affordances. Future cross-cutting features hang off this component.
 *
 * Per D5, hover state for the edit link is single gold across all plates.
 * Mobile: link always at 30% opacity. Desktop: 0 → 30% on heading-column
 * hover (group-hover). Focus-visible bumps to 100% for keyboard users.
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
  caption?: string;
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
  caption,
  children,
}: SectionFrameProps) {
  const editUrl = buildSectionEditUrl(slug, sectionKey);
  return (
    <>
      <div className="col-span-12 lg:col-span-3 group">
        <div className="at-folio mb-3">{number}</div>
        <h2 className="at-display text-[40px] leading-[1.05]">{title}</h2>
        {caption && (
          <p className="at-folio mt-3 leading-[1.6] normal-case tracking-normal text-[12px]">
            {caption}
          </p>
        )}
        <a
          href={editUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Edit ${title} section on GitHub`}
          className="at-folio text-[10px] tracking-[0.22em] mt-4 inline-block opacity-30 lg:opacity-0 lg:group-hover:opacity-30 hover:!opacity-100 hover:text-at-gold focus-visible:opacity-100 focus-visible:text-at-gold transition-opacity duration-150"
        >
          Edit ↗
        </a>
      </div>
      {children}
    </>
  );
}

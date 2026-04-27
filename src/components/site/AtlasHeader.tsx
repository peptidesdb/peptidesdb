import Link from "next/link";
import { loadAllPeptides } from "@/lib/content";
import { MobileNav } from "./MobileNav";

/* Single source of truth for site navigation. Used by both the
   desktop nav (rendered inline at >=sm) and <MobileNav> (rendered
   below sm). */
export const NAV_LINKS = [
  { href: "/catalog", label: "Catalogue" },
  { href: "/compare", label: "Compare" },
  { href: "/stack", label: "Stack" },
  { href: "/ask", label: "Ask" },
  { href: "/contribute", label: "Contribute" },
] as const;

export const EXTERNAL_NAV_LINKS = [
  { href: "https://github.com/peptidesdb/peptidesdb", label: "GitHub ↗" },
] as const;

/* Canonical site header for the Specimen Atlas. Two-row monogram-like
   ribbon: top folio strip + main wordmark/nav. Used by the root layout
   on every public route. */
export function AtlasHeader() {
  const total = loadAllPeptides().length;
  return (
    <header className="relative z-20 no-print">
      {/* Skip-to-content for keyboard users (visible on focus only) */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-at-cream focus:border focus:border-at-ink focus:px-3 focus:py-2 focus:text-[12px] at-folio focus:tracking-[0.22em]"
      >
        Skip to content
      </a>
      <div className="border-b border-at-rule">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12 h-9 flex items-center justify-between">
          <span className="at-folio">
            Specimen Atlas of Research Peptides
          </span>
          <span className="at-folio hidden sm:inline">
            Vol. 01 · MCMXC–MMXXVI · Compiled from public literature
          </span>
          <span className="at-folio">{total} plates · MIT</span>
        </div>
      </div>
      <div className="border-b border-at-ink/20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12 h-16 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-baseline gap-3">
            <span className="at-display text-[26px] leading-none">
              PeptidesDB
            </span>
            <span className="at-display-italic text-[16px] text-at-ink-soft">
              an atlas
            </span>
          </Link>
          {/* Desktop nav (>=640px) */}
          <nav className="hidden sm:flex items-center gap-5 sm:gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="at-link text-[13px] tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            {EXTERNAL_NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="at-folio hover:text-at-gold"
              >
                {link.label}
              </a>
            ))}
          </nav>
          {/* Mobile nav (<640px) */}
          <MobileNav links={NAV_LINKS} externalLinks={EXTERNAL_NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}

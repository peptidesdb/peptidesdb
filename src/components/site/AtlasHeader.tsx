import Link from "next/link";
import { loadAllPeptides } from "@/lib/content";

/* Canonical site header for the Specimen Atlas. Two-row monogram-like
   ribbon: top folio strip + main wordmark/nav. Used by the root layout
   on every public route. */
export function AtlasHeader() {
  const total = loadAllPeptides().length;
  return (
    <header className="relative z-20 no-print">
      <div className="border-b border-[var(--at-rule)]">
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
      <div className="border-b border-[var(--at-ink)]/20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12 h-16 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-baseline gap-3">
            <span className="at-display text-[26px] leading-none">
              PeptidesDB
            </span>
            <span className="at-display-italic text-[16px] text-[var(--at-ink-soft)]">
              an atlas
            </span>
          </Link>
          <nav className="flex items-center gap-5 sm:gap-7">
            <Link
              href="/catalog"
              className="at-link text-[13px] tracking-wide hidden sm:inline"
            >
              Catalogue
            </Link>
            <Link
              href="/compare"
              className="at-link text-[13px] tracking-wide hidden sm:inline"
            >
              Compare
            </Link>
            <Link
              href="/stack"
              className="at-link text-[13px] tracking-wide hidden sm:inline"
            >
              Stack
            </Link>
            <Link
              href="/ask"
              className="at-link text-[13px] tracking-wide"
            >
              Ask
            </Link>
            <a
              href="https://github.com/peptidesdb/peptidesdb"
              target="_blank"
              rel="noopener noreferrer"
              className="at-folio hover:text-[var(--at-gold)]"
            >
              GitHub ↗
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

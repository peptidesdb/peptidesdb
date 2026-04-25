import Link from "next/link";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] no-print mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-16">
        <div className="max-w-md">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-[15px] font-semibold tracking-tight text-[var(--color-text)]">
              PeptideDB
            </span>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
            Open-source, citation-dense, side-by-side comparable research
            peptide reference. Every claim cited, every change diffed, every
            contributor named.
          </p>
          <p className="mt-4 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
            For research use and educational reference only · not medical advice
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-[13px]">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              Browse
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
                  All peptides
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
                  Compare
                </Link>
              </li>
              <li>
                <Link href="/stacks" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
                  Stacks
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              Project
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/peptidedb/peptidedb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/peptidedb/peptidedb/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                >
                  Contribute
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              Data
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/api/peptides" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link href="/llms.txt" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
                  llms.txt
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-8 text-[11px] text-[var(--color-text-muted)] flex flex-col sm:flex-row sm:justify-between gap-2">
        <span>© {new Date().getFullYear()} PeptideDB Contributors. Released under MIT.</span>
        <span>Data and citations sourced from peer-reviewed literature where available.</span>
      </div>
    </footer>
  );
}

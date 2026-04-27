import Link from "next/link";

/* Canonical 4-column footer for the Specimen Atlas. Colophon on the
   left, sections + repository in the middle, license + disclaimer on
   the right. Modelled after the Claude Design refinement. */
export function AtlasFooter() {
  return (
    <footer className="relative z-10 mt-32 border-t border-at-ink/20 no-print">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12 py-12 grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-4">
          <div className="at-display text-[28px] leading-tight">
            PeptidesDB <em className="at-display-italic">— an atlas</em>
          </div>
          <p className="mt-3 text-[13px] leading-[1.6] text-at-ink-soft max-w-md">
            Set in <em>Instrument Serif</em> and <em>Geist</em>; tabular
            numerals in JetBrains Mono. Pigments after Werner; specimen
            motifs hashed from slug. MIT-licensed throughout.
          </p>
        </div>
        <div className="col-span-6 md:col-span-2">
          <div className="at-folio mb-3">Sections</div>
          <ul className="space-y-1.5 text-[13px]">
            <li>
              <Link href="/catalog" className="at-link">
                Catalogue
              </Link>
            </li>
            <li>
              <Link href="/compare" className="at-link">
                Compare
              </Link>
            </li>
            <li>
              <Link href="/stack" className="at-link">
                Stack
              </Link>
            </li>
            <li>
              <Link href="/ask" className="at-link">
                Ask
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-6 md:col-span-2">
          <div className="at-folio mb-3">Repository</div>
          <ul className="space-y-1.5 text-[13px]">
            <li>
              <a
                href="https://github.com/peptidesdb/peptidesdb"
                className="at-link"
              >
                GitHub
              </a>
            </li>
            <li>
              <Link href="/llms.txt" className="at-link">
                llms.txt
              </Link>
            </li>
            <li>
              <Link href="/sitemap.xml" className="at-link">
                Sitemap
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-12 md:col-span-4">
          <div className="at-folio mb-3">Disclaimer</div>
          <p className="text-[12px] leading-[1.6] text-at-ink-soft">
            Reference material only. Nothing here is medical advice or a
            recommendation to use any compound. Consult a qualified
            clinician. The data is the citation; if a claim cannot point
            at a paper, it does not appear in the atlas.
          </p>
        </div>
      </div>
      <div className="border-t border-at-rule-faint">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12 h-10 flex items-center justify-between at-folio">
          <span>
            © {new Date().getFullYear()} · The data is the citation
          </span>
          <span>For research purposes only</span>
        </div>
      </div>
    </footer>
  );
}

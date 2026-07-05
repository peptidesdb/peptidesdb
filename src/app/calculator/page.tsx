import type { Metadata } from "next";
import { loadAllPeptides } from "@/lib/content";
import { pigmentFor } from "@/lib/peptide-motif";
import { SITE_URL } from "@/lib/site";
import { CalculatorClient } from "@/components/peptide/CalculatorClient";

export const metadata: Metadata = {
  title: "Reconstitution calculator",
  description:
    "Reconstitution math for research peptides — mass-to-volume, insulin-syringe units, and doses per vial, with a blend mode for multi-component vials. Pure unit conversion, not a dose recommendation.",
  alternates: { canonical: `${SITE_URL}/calculator` },
};

/** Best-effort vial size from the hero stats (first "N mg" value). */
function inferMg(heroStats: { value: string }[]): number {
  for (const s of heroStats) {
    const m = /(\d+(?:\.\d+)?)\s*mg\b/i.exec(s.value);
    if (m) return parseFloat(m[1]);
  }
  return 5;
}

export default function CalculatorPage() {
  const compounds = loadAllPeptides()
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      pigment: pigmentFor(p.peptide_class),
      mg: inferMg(p.hero_stats),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <article className="mx-auto max-w-[1100px] px-6 sm:px-16 py-16 sm:py-24">
      <header className="text-center mb-16 sm:mb-24">
        <p className="at-folio mb-6">Bench utility</p>
        <h1 className="at-display text-[56px] sm:text-[80px] leading-[0.95] mb-6">
          Reconstitution calculator
        </h1>
        <p className="at-display-italic text-[24px] sm:text-[28px] text-at-ink-soft max-w-[620px] mx-auto">
          Mass in, <span className="text-at-gold">volume</span> out. The atlas
          does the arithmetic, not the dosing.
        </p>
      </header>

      <hr className="border-0 border-t border-at-rule mb-16" />

      <CalculatorClient compounds={compounds} />

      <hr className="border-0 border-t-2 border-at-ink mt-24 mb-8" />
      <p className="at-folio normal-case tracking-normal text-[12px] leading-[1.6] text-at-ink-soft max-w-[720px]">
        A unit-conversion tool: it converts a vial&rsquo;s peptide mass and your
        chosen diluent volume into a per-dose draw volume. It does not recommend
        a dose, a schedule, or a protocol. For research use only; not medical
        advice.
      </p>
    </article>
  );
}

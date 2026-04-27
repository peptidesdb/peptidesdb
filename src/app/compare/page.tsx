import type { Metadata } from "next";
import { loadAllPeptides } from "@/lib/content";
import { ComparePicker } from "@/components/compare/ComparePicker";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Compare plates",
  description:
    "Pick any two or three plates from the Specimen Atlas for side-by-side comparison.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  const peptides = loadAllPeptides().map((p) => ({
    slug: p.slug,
    name: p.name,
    peptide_class: p.peptide_class,
    classification: p.classification,
    color: p.color,
    aliases: p.aliases,
    evidence_level: p.evidence_level,
  }));

  return (
    <div className="mx-auto max-w-[1280px] px-6 lg:px-12 pt-12 lg:pt-20">
      <header className="border-b-2 border-at-ink pb-8 mb-12 at-plate at-d1">
        <div className="at-folio mb-6">§ Comparison</div>
        <div className="grid grid-cols-12 gap-8 items-end">
          <h1 className="col-span-12 lg:col-span-9 at-display text-[clamp(48px,7vw,108px)] leading-[0.95]">
            Compare,{" "}
            <em
              className="at-display-italic"
              style={{ color: "var(--at-pigment-rust)" }}
            >
              parameter by parameter.
            </em>
          </h1>
          <p className="col-span-12 lg:col-span-3 text-[13px] leading-[1.6] text-at-ink-soft">
            Pick any two — or three — plates and the atlas will line them
            up at the same parameter rows: mechanism, dosage, evidence,
            side effects, and stack synergies, with citations on every
            claim.
          </p>
        </div>
      </header>

      <div className="at-plate at-d2">
        <ComparePicker peptides={peptides} />
      </div>
    </div>
  );
}

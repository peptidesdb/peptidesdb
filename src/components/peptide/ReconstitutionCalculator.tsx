"use client";

import { useId, useState, useMemo } from "react";

/* =========================================================
   Reconstitution calculator — Atlas-skinned
   Inputs: total mg of lyophilized peptide in vial,
           volume of bacteriostatic water added (mL),
           desired single dose in mcg.
   Outputs: concentration (mcg/mL), volume per dose (mL),
            volume per dose in insulin units (1 mL = 100 IU),
            total doses available from the vial.

   Pure math — no medical advice, no preset doses, no
   schedule. The atlas treats this as a unit-conversion
   utility, not a prescription tool. The user supplies the
   target dose; we compute the volume.
   ========================================================= */

interface Props {
  peptideName: string;
  pigment: string;
  /** Default mg per vial (e.g. 5 for "5 mg vial") — pulled from YAML if available */
  defaultMg?: number;
}

export function ReconstitutionCalculator({
  peptideName,
  pigment,
  defaultMg = 5,
}: Props) {
  const [mg, setMg] = useState<number>(defaultMg);
  const [waterMl, setWaterMl] = useState<number>(2);
  const [doseMcg, setDoseMcg] = useState<number>(250);

  // Stable per-instance ids so <label htmlFor> binds to the right input
  // even if multiple calculators ever render on one page.
  const reactId = useId();
  const mgId = `${reactId}-mg`;
  const waterId = `${reactId}-water`;
  const doseId = `${reactId}-dose`;

  const result = useMemo(() => {
    if (mg <= 0 || waterMl <= 0 || doseMcg <= 0) return null;
    const totalMcg = mg * 1000;
    const concMcgPerMl = totalMcg / waterMl;
    const volumeMl = doseMcg / concMcgPerMl;
    const insulinUnits = volumeMl * 100; // 1 mL = 100 IU on a U-100 syringe
    const dosesPerVial = totalMcg / doseMcg;
    return {
      concMcgPerMl,
      volumeMl,
      insulinUnits,
      dosesPerVial,
    };
  }, [mg, waterMl, doseMcg]);

  const fmt = (n: number, digits: number = 2) =>
    Number.isFinite(n) ? n.toFixed(digits) : "—";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* INPUT panel */}
      <div className="col-span-12 lg:col-span-5 space-y-5">
        <div className="at-folio">Inputs</div>

        <div>
          <label htmlFor={mgId} className="at-folio block mb-2">
            Lyophilized peptide in vial
          </label>
          <div className="flex items-baseline gap-3">
            <input
              id={mgId}
              type="number"
              min={0.1}
              step={0.1}
              value={mg}
              onChange={(e) => setMg(parseFloat(e.target.value) || 0)}
              className="w-32 bg-transparent border-b border-at-ink py-2 text-[28px] at-display focus:outline-none focus:border-at-pigment-rust transition-colors"
              aria-label="Peptide mass in milligrams"
            />
            <span className="at-folio">mg</span>
          </div>
        </div>

        <div>
          <label htmlFor={waterId} className="at-folio block mb-2">
            Bacteriostatic water added
          </label>
          <div className="flex items-baseline gap-3">
            <input
              id={waterId}
              type="number"
              min={0.1}
              step={0.1}
              value={waterMl}
              onChange={(e) => setWaterMl(parseFloat(e.target.value) || 0)}
              className="w-32 bg-transparent border-b border-at-ink py-2 text-[28px] at-display focus:outline-none focus:border-at-pigment-rust transition-colors"
              aria-label="Diluent volume in millilitres"
            />
            <span className="at-folio">mL</span>
          </div>
        </div>

        <div>
          <label htmlFor={doseId} className="at-folio block mb-2">
            Desired dose
          </label>
          <div className="flex items-baseline gap-3">
            <input
              id={doseId}
              type="number"
              min={1}
              step={1}
              value={doseMcg}
              onChange={(e) => setDoseMcg(parseFloat(e.target.value) || 0)}
              className="w-32 bg-transparent border-b border-at-ink py-2 text-[28px] at-display focus:outline-none focus:border-at-pigment-rust transition-colors"
              aria-label="Target dose in micrograms"
            />
            <span className="at-folio">mcg</span>
          </div>
        </div>

        <div className="border-t border-at-rule pt-4 at-folio leading-[1.6] normal-case tracking-normal text-[12px] text-at-ink-soft">
          The calculator does pure mass-to-volume math. It does not
          recommend a dose. Refer to {peptideName}&apos;s cited
          literature for protocol specifics.
        </div>
      </div>

      {/* OUTPUT panel */}
      <div className="col-span-12 lg:col-span-7 at-card p-6 lg:p-8">
        <div className="flex items-baseline justify-between mb-6">
          <span className="at-folio">Volumetric output</span>
          <span className="at-folio">Fig. C — reconstitution math</span>
        </div>

        {result ? (
          <>
            <div className="mb-8">
              <div className="at-folio mb-2">Volume per dose</div>
              <div className="flex items-baseline gap-3">
                <span
                  className="at-display text-[88px] leading-none"
                  style={{ color: pigment }}
                >
                  {fmt(result.volumeMl, 3)}
                </span>
                <span className="at-display-italic text-[24px] text-at-ink-soft">
                  mL
                </span>
              </div>
              <div className="at-folio mt-3 normal-case tracking-normal text-[13px] text-at-ink-warm">
                ≈{" "}
                <span
                  className="at-display text-[20px]"
                  style={{ color: pigment }}
                >
                  {fmt(result.insulinUnits, 1)}
                </span>{" "}
                <em className="at-display-italic">
                  units on a U-100 insulin syringe
                </em>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-at-rule pt-6">
              <div>
                <div className="at-folio mb-1">Concentration</div>
                <div className="at-display text-[28px] leading-none">
                  {fmt(result.concMcgPerMl, 0)}
                </div>
                <div className="at-folio normal-case tracking-normal text-[12px] text-at-ink-soft mt-1">
                  mcg per mL
                </div>
              </div>
              <div>
                <div className="at-folio mb-1">Doses per vial</div>
                <div className="at-display text-[28px] leading-none">
                  {fmt(result.dosesPerVial, 0)}
                </div>
                <div className="at-folio normal-case tracking-normal text-[12px] text-at-ink-soft mt-1">
                  at this dose
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-[14px] text-at-ink-soft">
            Enter positive values for all three inputs.
          </div>
        )}
      </div>
    </div>
  );
}

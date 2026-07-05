"use client";

import { useMemo, useState } from "react";
import { ReconstitutionCalculator } from "./ReconstitutionCalculator";

/* =========================================================
   Standalone /calculator client. Two modes:
   - Single: pick a catalog compound (prefills the vial mass)
     or "custom", then the existing ReconstitutionCalculator.
   - Blend: several co-lyophilized components share one vial +
     one diluent volume. Pick a primary component + its target
     dose; we compute the draw volume, then the delivered dose
     of EVERY component at that same volume (that's the number
     that matters for a blend — you can't draw them separately).
   Pure mass-to-volume math. No recommended doses.
   ========================================================= */

interface Compound {
  slug: string;
  name: string;
  pigment: string;
  mg: number;
}

const GOLD = "var(--at-gold)";

export function CalculatorClient({
  compounds,
  initialMode = "single",
}: {
  compounds: Compound[];
  initialMode?: "single" | "blend";
}) {
  const [mode, setMode] = useState<"single" | "blend">(initialMode);
  return (
    <div>
      <div className="flex gap-6 mb-12 border-b border-at-rule">
        {(["single", "blend"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={`at-folio pb-3 -mb-px border-b-2 transition-colors ${
              mode === m
                ? "border-at-ink text-at-ink"
                : "border-transparent text-at-ink-soft hover:text-at-ink"
            }`}
          >
            {m === "single" ? "Single compound" : "Blend"}
          </button>
        ))}
      </div>
      {mode === "single" ? (
        <SingleMode compounds={compounds} />
      ) : (
        <BlendMode />
      )}
    </div>
  );
}

function SingleMode({ compounds }: { compounds: Compound[] }) {
  const [slug, setSlug] = useState<string>("__custom");
  const chosen = compounds.find((c) => c.slug === slug);
  const name = chosen?.name ?? "your peptide";
  const pigment = chosen?.pigment ?? GOLD;
  const mg = chosen?.mg ?? 5;

  return (
    <div className="space-y-8">
      <div>
        <label htmlFor="cmp" className="at-folio block mb-2">
          Compound (optional — prefills vial size)
        </label>
        <select
          id="cmp"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full max-w-md bg-transparent border-b border-at-ink py-2 at-display text-[20px] focus:outline-none focus:border-at-gold"
        >
          <option value="__custom">Custom / manual</option>
          {compounds.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      {/* key remounts the calculator so the prefilled vial size re-applies */}
      <ReconstitutionCalculator
        key={slug}
        peptideName={name}
        pigment={pigment}
        defaultMg={mg}
      />
    </div>
  );
}

interface Component {
  name: string;
  mg: number;
}

function BlendMode() {
  const [rows, setRows] = useState<Component[]>([
    { name: "BPC-157", mg: 10 },
    { name: "TB-500", mg: 10 },
  ]);
  const [waterMl, setWaterMl] = useState<number>(3);
  const [primary, setPrimary] = useState<number>(0);
  const [doseMcg, setDoseMcg] = useState<number>(250);

  const result = useMemo(() => {
    if (waterMl <= 0 || doseMcg <= 0) return null;
    const p = rows[primary];
    if (!p || p.mg <= 0) return null;
    const concPrimary = (p.mg * 1000) / waterMl; // mcg/mL
    const volumeMl = doseMcg / concPrimary;
    const insulinUnits = volumeMl * 100;
    const delivered = rows.map((r) => ({
      name: r.name,
      // mcg at this draw volume; clamp negatives so a mis-typed mass can't
      // produce a negative dose.
      dose: ((Math.max(0, r.mg) * 1000) / waterMl) * volumeMl,
    }));
    return { volumeMl, insulinUnits, delivered };
  }, [rows, waterMl, primary, doseMcg]);

  const fmt = (n: number, d = 2) => (Number.isFinite(n) ? n.toFixed(d) : "—");
  const setRow = (i: number, patch: Partial<Component>) =>
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="col-span-12 lg:col-span-6 space-y-6">
        <div className="at-folio">Blend components</div>
        <div className="space-y-3">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="radio"
                name="primary"
                checked={primary === i}
                onChange={() => setPrimary(i)}
                aria-label={`Set ${r.name || "component"} as the dosing reference`}
                className="accent-at-ink"
              />
              <input
                type="text"
                value={r.name}
                onChange={(e) => setRow(i, { name: e.target.value })}
                aria-label={`Component ${i + 1} name`}
                className="flex-1 min-w-0 bg-transparent border-b border-at-rule py-1.5 text-[15px] focus:outline-none focus:border-at-gold"
              />
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={r.mg}
                onChange={(e) =>
                  setRow(i, { mg: parseFloat(e.target.value) || 0 })
                }
                aria-label={`Component ${i + 1} mass in milligrams`}
                className="w-20 bg-transparent border-b border-at-ink py-1.5 at-display text-[20px] focus:outline-none focus:border-at-gold"
              />
              <span className="at-folio">mg</span>
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setRows((rs) => rs.filter((_, j) => j !== i));
                    // Keep the dosing reference pointing at a valid row.
                    setPrimary((p) => (i < p ? p - 1 : i === p ? 0 : p));
                  }}
                  aria-label={`Remove ${r.name || "component"}`}
                  className="at-folio text-at-ink-soft hover:text-at-bad"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setRows((rs) => [...rs, { name: "", mg: 5 }])}
          className="at-folio hover:text-at-gold"
        >
          + Add component
        </button>

        <div className="border-t border-at-rule pt-5 space-y-5">
          <div>
            <label htmlFor="bwater" className="at-folio block mb-2">
              Bacteriostatic water added
            </label>
            <div className="flex items-baseline gap-3">
              <input
                id="bwater"
                type="number"
                min={0.1}
                step={0.1}
                value={waterMl}
                onChange={(e) => setWaterMl(parseFloat(e.target.value) || 0)}
                className="w-28 bg-transparent border-b border-at-ink py-2 at-display text-[24px] focus:outline-none focus:border-at-gold"
              />
              <span className="at-folio">mL</span>
            </div>
          </div>
          <div>
            <label htmlFor="bdose" className="at-folio block mb-2">
              Target dose of the selected component
            </label>
            <div className="flex items-baseline gap-3">
              <input
                id="bdose"
                type="number"
                min={1}
                step={1}
                value={doseMcg}
                onChange={(e) => setDoseMcg(parseFloat(e.target.value) || 0)}
                className="w-28 bg-transparent border-b border-at-ink py-2 at-display text-[24px] focus:outline-none focus:border-at-gold"
              />
              <span className="at-folio">mcg</span>
            </div>
          </div>
        </div>

        <div className="border-t border-at-rule pt-4 at-folio leading-[1.6] normal-case tracking-normal text-[12px] text-at-ink-soft">
          A blend shares one vial and one diluent volume, so a single draw
          delivers all components at once. Pick the component you dose by (the
          radio button); the table shows what every other component comes along
          for the ride. Pure math — not a dose recommendation.
        </div>
      </div>

      <div className="col-span-12 lg:col-span-6 at-card p-6 lg:p-8">
        <div className="flex items-baseline justify-between mb-6">
          <span className="at-folio">Draw volume</span>
          <span className="at-folio">Fig. C — blend math</span>
        </div>
        {result ? (
          <>
            <div className="mb-8">
              <div className="flex items-baseline gap-3">
                <span
                  className="at-display text-[80px] leading-none"
                  style={{ color: GOLD }}
                >
                  {fmt(result.volumeMl, 3)}
                </span>
                <span className="at-display-italic text-[24px] text-at-ink-soft">
                  mL
                </span>
              </div>
              <div className="at-folio mt-3 normal-case tracking-normal text-[13px] text-at-ink-warm">
                ≈{" "}
                <span className="at-display text-[20px]" style={{ color: GOLD }}>
                  {fmt(result.insulinUnits, 1)}
                </span>{" "}
                <em className="at-display-italic">units on a U-100 syringe</em>
              </div>
            </div>
            <div className="border-t border-at-rule pt-6">
              <div className="at-folio mb-3">Delivered per draw</div>
              <div className="space-y-2">
                {result.delivered.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <span className="text-[14px] text-at-ink-warm truncate">
                      {d.name || `Component ${i + 1}`}
                    </span>
                    <span>
                      <span className="at-display text-[20px]">
                        {fmt(d.dose, 0)}
                      </span>{" "}
                      <span className="at-folio">mcg</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-[14px] text-at-ink-soft">
            Enter positive values and select a reference component.
          </div>
        )}
      </div>
    </div>
  );
}

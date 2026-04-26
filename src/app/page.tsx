import Link from "next/link";
import { loadAllPeptides } from "@/lib/content";
import { computePeptideStats } from "@/lib/peptide-stats";
import { citationsUsedBy } from "@/lib/peptide-cites";
import { CitationSpark, PeptideMotif, pigmentFor } from "@/lib/peptide-motif";

export const dynamic = "force-static";

const ROMAN: Record<number, string> = {
  1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII", 8: "VIII",
  9: "IX", 10: "X", 11: "XI", 12: "XII", 13: "XIII", 14: "XIV", 15: "XV",
  16: "XVI", 17: "XVII", 18: "XVIII", 19: "XIX", 20: "XX", 21: "XXI",
  22: "XXII", 23: "XXIII", 24: "XXIV", 25: "XXV", 26: "XXVI", 27: "XXVII",
  28: "XXVIII", 29: "XXIX", 30: "XXX",
};

export default function HomePage() {
  const peptides = loadAllPeptides();

  /* Curated front-of-book reading order — first the FDA-approved
     anchors, then a representative spread across classes. */
  const order = [
    "tesamorelin",
    "semaglutide",
    "tirzepatide",
    "bpc-157",
    "ghk-cu",
    "epitalon",
    "mots-c",
    "ipamorelin",
    "retatrutide",
    "tb-500",
    "kpv",
    "pinealon",
  ];
  /* Featured cards — `plate` is the canonical alphabetical position
     in the full catalog (so it matches what /p/[slug] and the OG card
     show). The curated `order` array controls *display sequence* on
     the home, not the plate numbers themselves. Single source of
     truth: the alphabetical catalog index. */
  const featured = order
    .map((s) => {
      const p = peptides.find((x) => x.slug === s);
      if (!p) return null;
      const catIdx = peptides.findIndex((x) => x.slug === s);
      return { p, plate: catIdx + 1 };
    })
    .filter(Boolean) as { p: (typeof peptides)[number]; plate: number }[];

  const tesamorelin = peptides.find((p) => p.slug === "tesamorelin");
  const tesamorelinPlate = tesamorelin
    ? peptides.findIndex((p) => p.slug === "tesamorelin") + 1
    : null;

  // Aggregate metrics
  let totalClaims = 0;
  let citedClaims = 0;
  const allCites = new Set<string>();
  for (const p of peptides) {
    const s = computePeptideStats(p);
    totalClaims += s.total_claims;
    citedClaims += s.cited_claims;
    for (const c of citationsUsedBy(p)) allCites.add(c);
  }
  const fdaCount = peptides.filter((p) => p.fda_approved).length;
  const overallPct = Math.round(
    (citedClaims / Math.max(1, totalClaims)) * 100,
  );

  // Class pigment palette for the Werner legend
  const pigmentLegend: { name: string; hex: string; cssVar: string }[] = [
    { name: "Healing", hex: "#5C7459", cssVar: "var(--at-pigment-sage)" },
    { name: "GLP-1 family", hex: "#A2553B", cssVar: "var(--at-pigment-rust)" },
    { name: "GH-axis", hex: "#1F4F4F", cssVar: "var(--at-pigment-teal)" },
    { name: "Mitochondrial", hex: "#A37F3D", cssVar: "var(--at-pigment-ochre)" },
    { name: "Melanocortin", hex: "#4F3D5C", cssVar: "var(--at-pigment-plum)" },
    { name: "Russian bioregulator", hex: "#3D5C5C", cssVar: "var(--at-pigment-smoke)" },
    { name: "Lipolytic", hex: "#3D4F24", cssVar: "var(--at-pigment-fern)" },
    { name: "Nootropic", hex: "#8C5E3C", cssVar: "var(--at-pigment-clay)" },
  ];

  return (
    <article className="mx-auto max-w-[1280px] px-6 lg:px-12">
      {/* MASTHEAD ——————————————————————————————————————— */}
      <section className="grid grid-cols-12 gap-8 lg:gap-12 pt-12 lg:pt-20 pb-16 items-start">
        <div className="col-span-12 lg:col-span-8 at-plate at-d1">
          <div className="at-folio mb-8">
            Plate I of {ROMAN[peptides.length] ?? peptides.length} ·
            Frontispiece
          </div>
          <h1 className="at-display text-[clamp(64px,11vw,184px)] leading-[0.92]">
            Specimen Atlas
            <br />
            <em
              className="at-display-italic"
              style={{ color: "var(--at-pigment-rust)" }}
            >
              of research peptides.
            </em>
          </h1>
          <p className="mt-10 text-[18px] leading-[1.55] max-w-2xl text-[var(--at-ink-warm)]">
            <em>{peptides.length} plates</em> of the molecules most often
            discussed in contemporary peptide therapeutics — each drawn
            from the public literature, foot-noted, and rendered with a{" "}
            <em>per-class mineral pigment</em> after the manner of Werner.
            No advice. No commerce. Only citations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center bg-[var(--at-ink)] text-[var(--at-bone)] px-6 py-3 text-[12px] tracking-[0.18em] uppercase hover:bg-[var(--at-pigment-rust)] transition-colors"
            >
              Open the atlas →
            </Link>
            <Link
              href="/p/tesamorelin"
              className="inline-flex items-center border border-[var(--at-ink)] px-6 py-3 text-[12px] tracking-[0.18em] uppercase hover:bg-[var(--at-ink)] hover:text-[var(--at-bone)] transition-colors"
            >
              Read the cover plate
            </Link>
          </div>
        </div>

        {/* Cover plate — Tesamorelin specimen card on the right */}
        {tesamorelin && tesamorelinPlate && (
          <aside className="col-span-12 lg:col-span-4 at-plate at-d3">
            <div className="at-card">
              <div
                className="at-swatch"
                style={{ background: pigmentFor(tesamorelin.peptide_class) }}
              />
              <div className="px-6 pt-5 pb-6">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="at-folio">
                    Plate {ROMAN[tesamorelinPlate] ?? tesamorelinPlate}
                  </span>
                  <span
                    className="at-folio"
                    style={{ color: "var(--at-gold)" }}
                  >
                    FDA · 2010
                  </span>
                </div>
                <div className="at-display text-[40px] leading-[1] mt-3">
                  Tesamorelin
                </div>
                <div className="at-display-italic text-[14px] text-[var(--at-ink-soft)] mt-1">
                  GHRH analogue · Egrifta®
                </div>
                <div className="my-6 flex items-center justify-center">
                  <PeptideMotif
                    slug={tesamorelin.slug}
                    peptide_class={tesamorelin.peptide_class}
                    size={200}
                  />
                </div>
                <p className="text-[13px] leading-[1.55] text-[var(--at-ink-warm)]">
                  Synthetic 44-amino-acid GHRH analogue. Stimulates
                  pulsatile growth hormone release; reduces visceral
                  adipose tissue 15–20% over 26 weeks.
                </p>
                <Link
                  href="/p/tesamorelin"
                  className="at-link mt-5 inline-block text-[12px] tracking-wide"
                >
                  Read the plate →
                </Link>
              </div>
            </div>
          </aside>
        )}
      </section>

      {/* WERNER PIGMENT LEGEND ——————————————————————————— */}
      <section className="border-t border-[var(--at-rule)] py-8 mb-16 at-plate at-d2">
        <div className="at-folio mb-4">
          Mineral pigment legend — after Werner
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {pigmentLegend.map((p) => (
            <div key={p.name}>
              <div
                className="h-2 w-full mb-2"
                style={{ background: p.cssVar }}
              />
              <div className="at-display-italic text-[13px] leading-tight">
                {p.name}
              </div>
              <div className="at-folio mt-0.5 text-[9px]">
                {p.hex}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RULE BREAK ——————————————————————————————————————— */}
      <div className="border-t-2 border-[var(--at-ink)] mb-16" />

      {/* TUFTE-STYLE METRICS — small multiples ——————————— */}
      <section className="py-4 mb-20 at-plate at-d2">
        <div className="at-folio mb-6">§ II · The atlas, in figures</div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-12">
          {[
            {
              num: peptides.length,
              label: "Plates compiled",
              spark: 100,
            },
            {
              num: fdaCount,
              label: "FDA-approved",
              spark: Math.round((fdaCount / peptides.length) * 100),
            },
            {
              num: totalClaims.toLocaleString(),
              label: "Claims tracked",
              spark: 100,
            },
            {
              num: `${overallPct}%`,
              label: "Cited literature",
              spark: overallPct,
            },
            {
              num: allCites.size,
              label: "PubMed references",
              spark: 100,
            },
          ].map((m, i) => (
            <div key={i} className="border-t border-[var(--at-ink)] pt-3">
              <div className="at-folio">{m.label}</div>
              <div className="at-display text-[56px] leading-none mt-3">
                {m.num}
              </div>
              <div className="mt-3 text-[var(--at-ink-soft)]">
                <CitationSpark pct={m.spark} width={72} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTENTS — plates I…XII as illustrated index ——— */}
      <section className="pb-24">
        <div className="grid grid-cols-12 gap-6 mb-10 items-end border-b border-[var(--at-rule)] pb-4">
          <div className="col-span-12 lg:col-span-9">
            <div className="at-folio mb-3">§ III · Contents</div>
            <h2 className="at-display text-[40px] sm:text-[56px] leading-none">
              A beginner&apos;s tour,{" "}
              <em className="at-display-italic">twelve plates.</em>
            </h2>
            <p className="at-display-italic text-[15px] mt-2 text-[var(--at-ink-soft)] max-w-2xl">
              Twelve molecules to start with — three approved drugs, three
              healing-class specimens, two GH-axis, two mitochondrial-or-
              bioregulator, and a pair of modulatory short peptides.
              Plate numbers below are catalog positions, not tour
              positions.
            </p>
          </div>
          <Link
            href="/catalog"
            className="col-span-12 lg:col-span-3 at-link text-[13px] lg:text-right"
          >
            See all {peptides.length} plates →
          </Link>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 at-plate at-d3">
          {featured.map(({ p, plate }) => {
            const stats = computePeptideStats(p);
            const cites = citationsUsedBy(p);
            const pct = Math.round(
              (stats.cited_claims / Math.max(1, stats.total_claims)) * 100,
            );
            const pigment = pigmentFor(p.peptide_class);
            return (
              <li key={p.slug}>
                <Link
                  href={`/p/${p.slug}`}
                  className="at-card block"
                  aria-label={`Plate ${plate}: ${p.name}`}
                >
                  <div
                    className="at-swatch"
                    style={{ background: pigment }}
                  />
                  <div className="px-6 pt-4 pb-5">
                    <div className="flex items-baseline justify-between">
                      <span className="at-folio">
                        Plate {ROMAN[plate]}
                      </span>
                      <span
                        className="at-folio"
                        style={{
                          color: p.fda_approved
                            ? "var(--at-gold)"
                            : "var(--at-ink-muted)",
                        }}
                      >
                        {p.fda_approved
                          ? `FDA · ${p.approval_year ?? ""}`
                          : "research"}
                      </span>
                    </div>

                    <div className="at-display text-[32px] leading-[1.05] mt-3">
                      {p.name}
                    </div>
                    <div className="at-display-italic text-[13px] text-[var(--at-ink-soft)] mt-1">
                      {p.peptide_class}
                    </div>

                    <div className="my-5 flex items-center justify-center">
                      <PeptideMotif
                        slug={p.slug}
                        peptide_class={p.peptide_class}
                        size={140}
                      />
                    </div>

                    <p className="text-[12.5px] leading-[1.55] text-[var(--at-ink-warm)] line-clamp-3 min-h-[60px]">
                      {p.summary.value}
                    </p>

                    {/* Tufte sparkline ledger */}
                    <div className="mt-4 pt-3 border-t border-[var(--at-rule)] grid grid-cols-3 gap-2 items-baseline">
                      <div>
                        <div className="at-folio text-[9px]">claims</div>
                        <div className="at-mono text-[14px]">
                          {stats.total_claims}
                        </div>
                      </div>
                      <div>
                        <div className="at-folio text-[9px]">cited</div>
                        <div className="at-mono text-[14px]">{pct}%</div>
                      </div>
                      <div>
                        <div className="at-folio text-[9px]">refs</div>
                        <div className="at-mono text-[14px]">
                          {cites.length}
                        </div>
                      </div>
                    </div>
                    <div
                      className="mt-2"
                      style={{ color: pigment }}
                    >
                      <CitationSpark
                        pct={pct}
                        width={232}
                        pigment={pigment}
                      />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* PULL QUOTE ——————————————————————————————————————— */}
      <section className="border-t-2 border-[var(--at-ink)] pt-16 pb-24 at-plate at-d4">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-2">
            <div className="at-folio">Editor&apos;s note</div>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <p className="at-display text-[clamp(28px,3.6vw,48px)] leading-[1.18]">
              <span style={{ color: "var(--at-pigment-rust)" }}>“</span>
              The chronic problem with peptide reference content online is
              that it is either marketing copy or anonymous forum lore.
              This atlas is neither. Every claim is anchored to{" "}
              <em className="at-display-italic">a paper</em>; every paper
              opens in PubMed; the data{" "}
              <em className="at-display-italic">is</em> the citation.
              <span style={{ color: "var(--at-pigment-rust)" }}>”</span>
            </p>
            <div className="mt-6 at-folio">
              R. Hwang, Editor — Letter to contributors, IV.MMXXVI
            </div>
          </div>
          <aside className="col-span-12 lg:col-span-2 at-folio leading-[1.7] normal-case tracking-normal text-[12px] text-[var(--at-ink-soft)]">
            ¶ 003 — A profile with no citations is a draft. A profile
            with broken citations is a bug. Both are blocking.
          </aside>
        </div>
      </section>

      {/* METHODOLOGY ——————————————————————————————————— */}
      <section className="border-t border-[var(--at-rule)] py-20 at-plate at-d4">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-3">
            <div className="at-folio mb-3">§ IV · Methodology</div>
            <h3 className="at-display text-[36px] leading-[1.05]">
              How a plate is{" "}
              <em className="at-display-italic">composed.</em>
            </h3>
          </div>
          <div className="col-span-12 lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {[
              {
                num: "01",
                title: "Schema-validated YAML",
                body: "Every peptide is one structured document. Build fails if a claim lacks a citation array — even an empty one. The shape is enforced at compile time by Zod.",
              },
              {
                num: "02",
                title: "Citations resolve to a registry",
                body: "PubMed IDs, DOIs, and ClinicalTrials.gov NCTs are stored once in refs.yaml. Every cite ID in a plate must resolve, or the build is rejected.",
              },
              {
                num: "03",
                title: "Build-time parity audit",
                body: "A second pass walks every claim and verifies it is counted in the trust metric. Smuggling an uncited claim past the audit fails the build.",
              },
              {
                num: "04",
                title: "Specimen motifs are deterministic",
                body: "Each plate's SVG fingerprint is derived from its slug — the same peptide produces the same motif across every page, every time.",
              },
            ].map((m) => (
              <div key={m.num}>
                <div className="flex items-baseline gap-3 mb-2">
                  <span
                    className="at-display text-[28px] leading-none"
                    style={{ color: "var(--at-gold)" }}
                  >
                    {m.num}
                  </span>
                  <span className="at-folio">Step {m.num}</span>
                </div>
                <div className="at-display text-[20px] leading-[1.2] mb-2">
                  {m.title}
                </div>
                <p className="text-[13.5px] leading-[1.6] text-[var(--at-ink-warm)]">
                  {m.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CODA — community manuscript ————————————————————— */}
      <section className="border-t-2 border-[var(--at-ink)] py-20 at-plate at-d5 text-center">
        <div className="at-folio mb-6">§ V · Coda</div>
        <h2 className="at-display text-[clamp(48px,7vw,96px)] leading-[0.92] max-w-4xl mx-auto">
          The atlas is{" "}
          <em
            className="at-display-italic"
            style={{ color: "var(--at-gold)" }}
          >
            a community manuscript.
          </em>
        </h2>
        <p className="mt-8 text-[15px] leading-[1.6] text-[var(--at-ink-warm)] max-w-2xl mx-auto">
          MIT-licensed YAML, foot-noted to public literature, edited in
          the open. Open a pull request; correct an error; add a plate.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <a
            href="https://github.com/peptidesdb/peptidesdb"
            className="inline-flex items-center gap-2 bg-[var(--at-ink)] text-[var(--at-bone)] px-6 py-3 text-[12px] tracking-[0.18em] uppercase hover:bg-[var(--at-pigment-rust)] transition-colors"
          >
            Open the repository →
          </a>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 border border-[var(--at-ink)] px-6 py-3 text-[12px] tracking-[0.18em] uppercase hover:bg-[var(--at-ink)] hover:text-[var(--at-bone)] transition-colors"
          >
            View all {peptides.length} plates
          </Link>
        </div>
      </section>
    </article>
  );
}

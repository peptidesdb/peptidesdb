import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPeptide, loadAllPeptides } from "@/lib/content";
import { computePeptideStats } from "@/lib/peptide-stats";
import { citationsUsedBy } from "@/lib/peptide-cites";
import { CitationSpark, PeptideMotif, pigmentFor } from "@/lib/peptide-motif";
import { CITATIONS } from "@/generated/citations";
import { citationLabel, citationUrl } from "@/lib/citations";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReconstitutionCalculator } from "@/components/peptide/ReconstitutionCalculator";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return loadAllPeptides().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPeptide(slug);
  if (!p) return { title: "Not found" };
  return {
    title: `${p.name} — ${p.peptide_class}`,
    description: p.summary.value,
    openGraph: {
      title: `${p.name} · PeptidesDB`,
      description: p.summary.value,
      type: "article",
    },
    alternates: {
      canonical: `/p/${p.slug}`,
    },
  };
}

interface CitableLike {
  value: string;
  cite?: string[];
  badge?: string;
  note?: string;
}

function CiteRefs({ refs }: { refs: string[] }) {
  if (!refs.length) return null;
  return (
    <span className="inline-flex flex-wrap gap-1.5 align-baseline">
      {refs.map((id) => {
        const c = CITATIONS[id];
        if (!c) return null;
        return (
          <a
            key={id}
            href={citationUrl(c)}
            target="_blank"
            rel="noopener noreferrer"
            title={`${citationLabel(c)} · ${c.title}`}
            className="at-mono text-[10px] tracking-wider text-[var(--at-gold)] hover:text-[var(--at-ink)] transition-colors"
            style={{ verticalAlign: "super" }}
          >
            [{id}]
          </a>
        );
      })}
    </span>
  );
}

const SEVERITY: Record<string, string> = {
  green: "var(--at-good)",
  blue: "var(--at-pigment-teal)",
  teal: "var(--at-good)",
  yellow: "var(--at-warn)",
  red: "var(--at-bad)",
  purple: "var(--at-pigment-plum)",
};

function Citable({ v, className }: { v: CitableLike; className?: string }) {
  const c = v.badge ? SEVERITY[v.badge] : undefined;
  return (
    <span className={className} style={c ? { color: c } : undefined}>
      {v.value}
      {v.note ? (
        <em className="text-[var(--at-ink-soft)] ml-1">— {v.note}</em>
      ) : null}
      {v.cite?.length ? (
        <>
          {" "}
          <CiteRefs refs={v.cite} />
        </>
      ) : null}
    </span>
  );
}

const ROMAN: Record<number, string> = {
  1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII", 8: "VIII",
  9: "IX", 10: "X", 11: "XI", 12: "XII", 13: "XIII", 14: "XIV", 15: "XV",
  16: "XVI", 17: "XVII", 18: "XVIII", 19: "XIX", 20: "XX", 21: "XXI",
  22: "XXII", 23: "XXIII", 24: "XXIV", 25: "XXV", 26: "XXVI", 27: "XXVII",
  28: "XXVIII", 29: "XXIX", 30: "XXX",
};

export default async function PeptidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getPeptide(slug);
  if (!p) notFound();

  const all = loadAllPeptides();
  const idx = all.findIndex((x) => x.slug === slug);
  const plateNum = idx + 1;
  const plateRoman = ROMAN[plateNum] ?? String(plateNum);
  const totalRoman = ROMAN[all.length] ?? String(all.length);

  const stats = computePeptideStats(p);
  const cites = citationsUsedBy(p);
  const pct = Math.round(
    (stats.cited_claims / Math.max(1, stats.total_claims)) * 100,
  );
  const pigment = pigmentFor(p.peptide_class);

  /* Heuristic default mg for the reconstitution calculator — try to
     infer from hero stats (e.g. "5 mg / day" → 5). Falls back to 5 mg,
     the most common research-vial size. User can override at runtime. */
  const defaultMg = (() => {
    for (const s of p.hero_stats) {
      const m = String(s.value).match(/(\d+(?:\.\d+)?)\s*mg/i);
      if (m) {
        const n = parseFloat(m[1]);
        if (n > 0 && n <= 50) return n;
      }
    }
    return 5;
  })();

  // schema.org/Drug structured data — improves AI citation surface.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Drug",
    name: p.name,
    alternateName: p.aliases,
    description: p.summary.value,
    drugClass: p.peptide_class,
    legalStatus: p.fda_approved ? "FDA-approved" : "Research use only",
    url: `${SITE_URL}/p/${p.slug}`,
  };

  return (
    <article className="mx-auto max-w-[1280px] px-6 lg:px-12 pt-12 lg:pt-16 pb-16">
      <JsonLd data={jsonLd} />

      {/* Folio breadcrumb */}
      <div className="flex items-baseline justify-between border-b border-[var(--at-rule)] pb-3 mb-12">
        <Link
          href="/catalog"
          className="at-folio hover:text-[var(--at-gold)]"
        >
          ← Catalogue
        </Link>
        <span className="at-folio">
          Plate {plateRoman} of {totalRoman}
        </span>
      </div>

      {/* PLATE MASTHEAD ——————————————————————————————————— */}
      <header className="grid grid-cols-12 gap-8 lg:gap-12 mb-20 at-plate at-d1 items-start">
        <div className="col-span-12 lg:col-span-7">
          <div
            className="at-swatch mb-6"
            style={{ background: pigment, height: 6 }}
          />
          <div className="flex items-baseline gap-4 mb-4 flex-wrap">
            <span
              className="at-display text-[36px] leading-none"
              style={{ color: pigment }}
            >
              {plateRoman}
            </span>
            <span className="at-folio">Plate {plateRoman}</span>
            {p.fda_approved && (
              <span
                className="at-folio"
                style={{ color: "var(--at-gold)" }}
              >
                FDA approved · {p.approval_year}
              </span>
            )}
            <span className="at-folio">
              Reviewed {p.last_reviewed}
            </span>
          </div>
          <h1 className="at-display text-[clamp(64px,12vw,176px)] leading-[0.88]">
            {p.name}
          </h1>
          <div className="at-display-italic text-[18px] mt-3 text-[var(--at-ink-soft)]">
            {p.peptide_class}
          </div>
          {p.aliases?.length ? (
            <p className="mt-4 text-[13px] text-[var(--at-ink-soft)]">
              also known as <em className="at-display-italic">{p.aliases.join(", ")}</em>
            </p>
          ) : null}
          <p className="mt-8 text-[17px] leading-[1.55] max-w-2xl text-[var(--at-ink-warm)]">
            {p.summary.value}
          </p>
        </div>

        {/* The big specimen motif */}
        <aside className="col-span-12 lg:col-span-5 flex flex-col items-center at-plate at-d2">
          <div className="at-card p-6 lg:p-8 w-full">
            <div className="flex items-baseline justify-between">
              <span className="at-folio">Fig. 1 — Specimen motif</span>
              <span className="at-folio">{p.slug}</span>
            </div>
            <div className="my-6 flex items-center justify-center">
              <PeptideMotif
                slug={p.slug}
                peptide_class={p.peptide_class}
                size={340}
                variant="hero"
              />
            </div>
            <p className="at-folio leading-[1.6] normal-case tracking-normal text-[12px] text-[var(--at-ink-soft)]">
              Deterministic SVG fingerprint generated from the slug{" "}
              <em>{p.slug}</em>. Pigment: {p.peptide_class.toLowerCase()}.
              The motif is iconography, not crystallography — it is
              identical across every page where this peptide appears.
            </p>
          </div>
        </aside>
      </header>

      {/* HERO STATS — Tufte small multiples ——————————————— */}
      <section className="border-y-2 border-[var(--at-ink)] py-10 mb-20 at-plate at-d2">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-2">
            <div className="at-folio">§ I</div>
            <h2 className="at-display text-[24px] leading-none mt-1">
              At a glance
            </h2>
          </div>
          {p.hero_stats.map((s, i) => (
            <div
              key={i}
              className="col-span-6 lg:col-span-3 border-l border-[var(--at-rule)] pl-6"
            >
              <div className="at-folio">{s.label}</div>
              <div
                className="at-display text-[56px] sm:text-[64px] leading-none mt-2"
                style={{ color: pigment }}
              >
                {s.value}
              </div>
              {s.cite?.length ? (
                <div className="mt-2 text-[10px]">
                  <CiteRefs refs={s.cite} />
                </div>
              ) : null}
            </div>
          ))}
          <div className="col-span-12 lg:col-span-1 border-l border-[var(--at-rule)] pl-6">
            <div className="at-folio">Route</div>
            <p className="text-[13px] leading-[1.4] mt-1 font-medium">
              {p.hero_route.value}
            </p>
          </div>
        </div>
      </section>

      {/* MECHANISM ——————————————————————————————————————— */}
      {p.mechanism && (
        <section
          id="mechanism"
          className="grid grid-cols-12 gap-8 lg:gap-12 pb-20 at-plate scroll-mt-12"
        >
          <div className="col-span-12 lg:col-span-3">
            <div className="at-folio mb-3">§ II</div>
            <h2 className="at-display text-[40px] leading-[1.05]">
              Mechanism
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-6 space-y-5">
            <p className="text-[15px] leading-[1.7]">
              <span className="at-folio">Primary target —</span>{" "}
              <Citable v={p.mechanism.primary_target} />.
            </p>
            <p className="text-[15px] leading-[1.7]">
              <span className="at-folio">Pathway —</span>{" "}
              <Citable v={p.mechanism.pathway} />.
            </p>
            <p className="text-[15px] leading-[1.7]">
              <span className="at-folio">Downstream effect —</span>{" "}
              <Citable v={p.mechanism.downstream_effect} />.
            </p>
            {p.mechanism.origin && (
              <p className="text-[15px] leading-[1.7]">
                <span className="at-folio">Origin —</span>{" "}
                <Citable v={p.mechanism.origin} />.
              </p>
            )}
            {p.mechanism.feedback_intact && (
              <p className="text-[15px] leading-[1.7]">
                <span className="at-folio">Feedback intact —</span>{" "}
                <Citable v={p.mechanism.feedback_intact} />.
              </p>
            )}
          </div>
          {p.mechanism.diagram?.length ? (
            <aside className="col-span-12 lg:col-span-3 border-l border-[var(--at-rule)] pl-6">
              <div className="at-folio mb-4">Fig. 2 — Pathway</div>
              <ol className="space-y-2 text-[13px] leading-[1.5]">
                {p.mechanism.diagram.map((step, i) => (
                  <li key={i}>
                    {step.kind === "node" && (
                      <span className="font-medium">{step.text.value}</span>
                    )}
                    {step.kind === "arrow" && (
                      <span className="text-[var(--at-ink-soft)] block pl-3 italic">
                        {step.text.value}
                      </span>
                    )}
                    {step.kind === "outcome" && (
                      <span
                        className="block pt-2 mt-2 border-t border-[var(--at-rule-faint)] at-folio"
                        style={{ color: pigment }}
                      >
                        → {step.text.value}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </aside>
          ) : null}
        </section>
      )}

      {/* DOSAGE TABLE ——————————————————————————————————— */}
      {p.dosage?.rows?.length ? (
        <section
          id="dosage"
          className="border-t border-[var(--at-rule)] grid grid-cols-12 gap-8 lg:gap-12 pt-12 pb-20 at-plate scroll-mt-12"
        >
          <div className="col-span-12 lg:col-span-3">
            <div className="at-folio mb-3">§ III</div>
            <h2 className="at-display text-[40px] leading-[1.05]">
              Dosage
            </h2>
            <p className="at-folio mt-3 leading-[1.6] normal-case tracking-normal text-[12px]">
              Protocols described in the cited literature; not medical
              advice.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-9">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b-2 border-[var(--at-ink)]">
                  <th className="at-folio text-left py-3 w-1/3">
                    Parameter
                  </th>
                  <th className="at-folio text-left py-3">Value</th>
                </tr>
              </thead>
              <tbody>
                {p.dosage.rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-[var(--at-rule)]"
                  >
                    <td className="py-4 pr-4 align-top">
                      <span className="at-folio">{row.parameter}</span>
                    </td>
                    <td className="py-4 align-top leading-[1.55]">
                      <Citable v={row.value} />
                      {row.notes ? (
                        <em className="block at-folio mt-1 normal-case tracking-normal text-[12px] text-[var(--at-ink-soft)]">
                          {row.notes.value}
                          {row.notes.cite?.length ? (
                            <>
                              {" "}
                              <CiteRefs refs={row.notes.cite} />
                            </>
                          ) : null}
                        </em>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {/* RECONSTITUTION CALCULATOR ——————————————————————— */}
      <section
        id="reconstitute"
        className="border-t border-[var(--at-rule)] grid grid-cols-12 gap-8 lg:gap-12 pt-12 pb-20 at-plate scroll-mt-12"
      >
        <div className="col-span-12 lg:col-span-3">
          <div className="at-folio mb-3">§ III · b</div>
          <h2 className="at-display text-[40px] leading-[1.05]">
            Reconstitution
          </h2>
          <p className="at-folio mt-3 leading-[1.6] normal-case tracking-normal text-[12px]">
            A pure mass-to-volume utility. Enter what you have in the
            vial; the atlas computes the volume per dose. No prescription
            information.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-9">
          <ReconstitutionCalculator
            peptideName={p.name}
            pigment={pigment}
            defaultMg={defaultMg}
          />
        </div>
      </section>

      {/* EVIDENCE ——————————————————————————————————————— */}
      {p.fat_loss && (
        <section
          id="fat-loss"
          className="border-t border-[var(--at-rule)] grid grid-cols-12 gap-8 lg:gap-12 pt-12 pb-20 at-plate scroll-mt-12"
        >
          <div className="col-span-12 lg:col-span-3">
            <div className="at-folio mb-3">§ IV</div>
            <h2 className="at-display text-[40px] leading-[1.05]">
              Evidence
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-9">
            <div className="at-card p-6 lg:p-8 mb-8 grid grid-cols-12 gap-6 items-end">
              <div className="col-span-12 md:col-span-3">
                <div className="at-folio">Strength</div>
                <div className="at-display text-[88px] leading-none mt-2">
                  {p.fat_loss.evidence_strength}
                  <span className="text-[28px] text-[var(--at-ink-soft)]">
                    /100
                  </span>
                </div>
                <div className="mt-3" style={{ color: pigment }}>
                  <CitationSpark
                    pct={p.fat_loss.evidence_strength}
                    width={120}
                    pigment={pigment}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-9">
                <div className="at-folio mb-2">
                  {p.fat_loss.evidence_level.replace(/-/g, " ")}
                </div>
                <p className="at-display-italic text-[20px] leading-[1.35]">
                  <Citable v={p.fat_loss.evidence_meta} />
                </p>
              </div>
            </div>

            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b-2 border-[var(--at-ink)]">
                  <th className="at-folio text-left py-3 w-1/3">
                    Outcome
                  </th>
                  <th className="at-folio text-left py-3">Finding</th>
                </tr>
              </thead>
              <tbody>
                {p.fat_loss.rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-[var(--at-rule)]"
                  >
                    <td className="py-4 pr-4 align-top">
                      <span className="at-folio">{row.parameter}</span>
                    </td>
                    <td className="py-4 align-top leading-[1.55]">
                      <Citable v={row.value} />
                      {row.notes ? (
                        <em className="block at-folio mt-1 normal-case tracking-normal text-[12px] text-[var(--at-ink-soft)]">
                          {row.notes.value}
                        </em>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ADVERSE EVENTS ——————————————————————————————————— */}
      {p.side_effects?.rows?.length ? (
        <section
          id="side-effects"
          className="border-t border-[var(--at-rule)] grid grid-cols-12 gap-8 lg:gap-12 pt-12 pb-20 at-plate scroll-mt-12"
        >
          <div className="col-span-12 lg:col-span-3">
            <div className="at-folio mb-3">§ V</div>
            <h2 className="at-display text-[40px] leading-[1.05]">
              Adverse events
            </h2>
            <p className="at-folio mt-3 leading-[1.6] normal-case tracking-normal text-[12px]">
              Severities follow the FDA / CTCAE convention.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-9 space-y-3">
            {p.side_effects.rows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-4 border-b border-[var(--at-rule)] py-4 items-baseline"
              >
                <div className="col-span-12 md:col-span-4">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="at-folio">{row.parameter}</span>
                    {row.severity && (
                      <span
                        className="at-mono text-[10px] tracking-wider px-1.5"
                        style={{
                          color:
                            row.severity === "severe"
                              ? "var(--at-bad)"
                              : row.severity === "moderate"
                                ? "var(--at-warn)"
                                : "var(--at-good)",
                          background:
                            row.severity === "severe"
                              ? "rgba(127,29,29,0.10)"
                              : row.severity === "moderate"
                                ? "rgba(161,98,7,0.10)"
                                : "rgba(63,98,18,0.10)",
                        }}
                      >
                        {row.severity}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-8 text-[14px] leading-[1.55]">
                  <Citable v={row.value} />
                </div>
              </div>
            ))}
            {(p.side_effects.contraindications_absolute?.length ?? 0) +
              (p.side_effects.contraindications_relative?.length ?? 0) >
              0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {p.side_effects.contraindications_absolute?.length ? (
                  <div
                    className="at-card p-5"
                    style={{ borderLeft: "3px solid var(--at-bad)" }}
                  >
                    <div
                      className="at-folio"
                      style={{ color: "var(--at-bad)" }}
                    >
                      Absolute contraindications
                    </div>
                    <ul className="mt-3 space-y-1.5 text-[13px]">
                      {p.side_effects.contraindications_absolute.map(
                        (c, i) => (
                          <li key={i}>
                            — <Citable v={c} />
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                ) : null}
                {p.side_effects.contraindications_relative?.length ? (
                  <div
                    className="at-card p-5"
                    style={{ borderLeft: "3px solid var(--at-warn)" }}
                  >
                    <div
                      className="at-folio"
                      style={{ color: "var(--at-warn)" }}
                    >
                      Relative contraindications
                    </div>
                    <ul className="mt-3 space-y-1.5 text-[13px]">
                      {p.side_effects.contraindications_relative.map(
                        (c, i) => (
                          <li key={i}>
                            — <Citable v={c} />
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* ADMINISTRATION ——————————————————————————————————— */}
      {p.administration?.steps?.length ? (
        <section
          id="administration"
          className="border-t border-[var(--at-rule)] grid grid-cols-12 gap-8 lg:gap-12 pt-12 pb-20 at-plate scroll-mt-12"
        >
          <div className="col-span-12 lg:col-span-3">
            <div className="at-folio mb-3">§ VI</div>
            <h2 className="at-display text-[40px] leading-[1.05]">
              Administration
            </h2>
          </div>
          <ol className="col-span-12 lg:col-span-9 space-y-6">
            {p.administration.steps.map((step, i) => (
              <li
                key={i}
                className="grid grid-cols-12 gap-4 items-baseline"
              >
                <div className="col-span-2 md:col-span-1">
                  <span
                    className="at-display text-[40px] leading-none"
                    style={{ color: pigment }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="col-span-10 md:col-span-11 border-l border-[var(--at-rule)] pl-5">
                  <div className="at-folio">{step.title}</div>
                  <p className="text-[15px] mt-1 leading-[1.65]">
                    {step.body}
                    {step.cite?.length ? (
                      <>
                        {" "}
                        <CiteRefs refs={step.cite} />
                      </>
                    ) : null}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {/* SYNERGIES ——————————————————————————————————————— */}
      {p.synergy?.stacks?.length ? (
        <section
          id="synergy"
          className="border-t border-[var(--at-rule)] grid grid-cols-12 gap-8 lg:gap-12 pt-12 pb-20 at-plate scroll-mt-12"
        >
          <div className="col-span-12 lg:col-span-3">
            <div className="at-folio mb-3">§ VII</div>
            <h2 className="at-display text-[40px] leading-[1.05]">
              Synergies
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
            {p.synergy.stacks.map((s, i) => {
              const partner = all.find((x) => x.slug === s.partner_slug);
              const pPigment = partner
                ? pigmentFor(partner.peptide_class)
                : pigment;
              return (
                <Link
                  key={i}
                  href={`/p/${s.partner_slug}`}
                  className="at-card block p-6"
                >
                  <div className="at-folio mb-3">
                    {s.synergy} synergy
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <PeptideMotif
                      slug={p.slug}
                      peptide_class={p.peptide_class}
                      size={64}
                    />
                    <span
                      className="at-display text-[28px]"
                      style={{ color: "var(--at-gold)" }}
                    >
                      +
                    </span>
                    {partner ? (
                      <PeptideMotif
                        slug={partner.slug}
                        peptide_class={partner.peptide_class}
                        size={64}
                      />
                    ) : null}
                  </div>
                  <div className="at-display text-[22px] leading-[1.15]">
                    {p.name}{" "}
                    <span style={{ color: pPigment }}>
                      + {s.partner_label}
                    </span>
                  </div>
                  <p className="mt-3 text-[13px] leading-[1.6] text-[var(--at-ink-warm)]">
                    {s.rationale}
                  </p>
                  <div className="at-folio mt-3 leading-[1.6] normal-case tracking-normal text-[12px] text-[var(--at-ink-soft)]">
                    Primary benefit — {s.primary_benefit}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* CITATION APPENDIX ——————————————————————————————— */}
      <section className="border-t-2 border-[var(--at-ink)] grid grid-cols-12 gap-8 lg:gap-12 pt-12 pb-20 at-plate">
        <div className="col-span-12 lg:col-span-3">
          <div className="at-folio mb-3">Appendix</div>
          <h2 className="at-display text-[40px] leading-[1.05]">Sources</h2>
          <div className="mt-6 flex items-baseline gap-2">
            <span
              className="at-display text-[64px] leading-none"
              style={{ color: pigment }}
            >
              {pct}
            </span>
            <span className="at-folio">%</span>
          </div>
          <p className="at-folio mt-2 normal-case tracking-normal text-[12px] leading-[1.6] text-[var(--at-ink-soft)]">
            of {stats.total_claims} rendered claims carry a resolvable
            citation.
          </p>
          <div className="mt-3" style={{ color: pigment }}>
            <CitationSpark pct={pct} width={140} pigment={pigment} />
          </div>
        </div>
        <ol className="col-span-12 lg:col-span-9 space-y-4">
          {cites.map((id) => {
            const c = CITATIONS[id];
            if (!c) return null;
            return (
              <li
                key={id}
                className="grid grid-cols-12 gap-4 border-b border-[var(--at-rule)] pb-4 items-baseline"
              >
                <div className="col-span-12 md:col-span-2">
                  <span className="at-mono text-[11px] text-[var(--at-gold)]">
                    [{id}]
                  </span>
                </div>
                <div className="col-span-12 md:col-span-8 text-[14px] leading-[1.55]">
                  <strong className="at-display-italic">
                    {citationLabel(c)}
                  </strong>
                  {" — "}
                  {c.title}
                  <br />
                  <em className="at-folio normal-case tracking-normal">
                    {c.journal ?? c.type}, {c.year}
                  </em>
                </div>
                <div className="col-span-12 md:col-span-2 md:text-right">
                  <a
                    href={citationUrl(c)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="at-link at-mono text-[11px]"
                  >
                    {c.pmid
                      ? "PubMed →"
                      : c.doi
                        ? "DOI →"
                        : c.nct
                          ? "ClinicalTrials →"
                          : "Source →"}
                  </a>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* COLOPHON / CONTRIBUTORS / EDIT ON GITHUB ————————— */}
      <section className="border-t border-[var(--at-rule)] pt-8 mt-4 grid grid-cols-12 gap-6 items-baseline at-folio leading-[1.6] normal-case tracking-normal text-[12px] text-[var(--at-ink-soft)]">
        <div className="col-span-12 lg:col-span-7">
          Plate composed {p.last_reviewed} · maturity{" "}
          <em>{p.maturity}</em> · schema v{p.schema_version}
          {p.contributors.length > 0 && (
            <>
              {" · "}
              Contributors:{" "}
              {p.contributors.map((c, i) => (
                <span key={c} className="font-mono">
                  {c}
                  {i < p.contributors.length - 1 && ", "}
                </span>
              ))}
            </>
          )}
          {stats.uncited_claims > 0 && (
            <>
              {" · "}
              <span style={{ color: "var(--at-warn)" }}>
                {stats.uncited_claims} field
                {stats.uncited_claims === 1 ? "" : "s"} uncited — open
                contributions
              </span>
            </>
          )}
        </div>
        <div className="col-span-12 lg:col-span-5 lg:text-right flex flex-wrap gap-4 lg:justify-end">
          <a
            href={`https://github.com/peptidesdb/peptidesdb/blob/main/content/peptides/${p.slug}.yaml`}
            target="_blank"
            rel="noopener noreferrer"
            className="at-link"
          >
            Edit on GitHub →
          </a>
          <Link href="/catalog" className="at-link">
            Read another →
          </Link>
        </div>
      </section>
    </article>
  );
}

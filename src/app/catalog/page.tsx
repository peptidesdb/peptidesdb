import Link from "next/link";
import type { Metadata } from "next";
import { loadAllPeptides } from "@/lib/content";
import { computePeptideStats } from "@/lib/peptide-stats";
import { citationsUsedBy } from "@/lib/peptide-cites";
import { CitationSpark, PeptideMotif, pigmentFor } from "@/lib/peptide-motif";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Every plate in the Specimen Atlas — research peptides grouped by class, with citation density and PubMed reference counts.",
  alternates: { canonical: "/catalog" },
};

export default function CatalogPage() {
  const peptides = loadAllPeptides();

  // Group by class
  const groups = new Map<string, typeof peptides>();
  for (const p of peptides) {
    const k = p.peptide_class;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(p);
  }
  const sortedGroups = [...groups.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <div className="mx-auto max-w-[1280px] px-6 lg:px-12 pt-12 lg:pt-20">
      <header className="border-b-2 border-at-ink pb-8 mb-16 at-plate at-d1">
        <div className="at-folio mb-6">§ II · The Catalogue</div>
        <div className="grid grid-cols-12 gap-8 items-end">
          <h1 className="col-span-12 lg:col-span-9 at-display text-[clamp(56px,9vw,144px)] leading-[0.92]">
            Catalogue,{" "}
            <em
              className="at-display-italic"
              style={{ color: "var(--at-pigment-rust)" }}
            >
              {peptides.length}
            </em>{" "}
            plates.
          </h1>
          <p className="col-span-12 lg:col-span-3 text-[13px] leading-[1.6] text-at-ink-soft">
            Grouped by class. Each plate carries a deterministic specimen
            motif, a class-pigment swatch, and a citation sparkline showing
            the percentage of claims with a resolved reference.
          </p>
        </div>
      </header>

      <div className="space-y-20">
        {sortedGroups.map(([cls, items], gi) => {
          const pigment = pigmentFor(cls);
          return (
            <section
              key={cls}
              className="at-plate"
              style={{ animationDelay: `${120 + gi * 50}ms` }}
            >
              <div className="border-b border-at-rule pb-3 mb-8 grid grid-cols-12 gap-4 items-baseline">
                <div className="col-span-12 lg:col-span-9 flex items-baseline gap-4">
                  <div
                    className="h-8 w-2"
                    style={{ background: pigment }}
                  />
                  <h2 className="at-display text-[28px] sm:text-[40px] leading-none">
                    {cls}
                  </h2>
                </div>
                <div className="col-span-12 lg:col-span-3 lg:text-right at-folio">
                  {items.length} {items.length === 1 ? "plate" : "plates"}
                </div>
              </div>

              <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((p) => {
                  const stats = computePeptideStats(p);
                  const cites = citationsUsedBy(p);
                  const pct = Math.round(
                    (stats.cited_claims /
                      Math.max(1, stats.total_claims)) *
                      100,
                  );
                  return (
                    <li key={p.slug}>
                      <Link
                        href={`/p/${p.slug}`}
                        className="at-card block"
                      >
                        <div
                          className="at-swatch"
                          style={{ background: pigment }}
                        />
                        <div className="px-5 py-4">
                          <div className="flex items-baseline justify-between">
                            <span className="at-folio">{p.slug}</span>
                            <span
                              className="at-folio"
                              style={{
                                color: p.fda_approved
                                  ? "var(--at-gold)"
                                  : "var(--at-ink-muted)",
                              }}
                            >
                              {p.fda_approved ? "FDA" : "—"}
                            </span>
                          </div>
                          <div className="at-display text-[22px] leading-[1.05] mt-2">
                            {p.name}
                          </div>
                          <div className="my-3 flex items-center justify-center">
                            <PeptideMotif
                              slug={p.slug}
                              peptide_class={p.peptide_class}
                              size={104}
                            />
                          </div>
                          <div className="flex items-baseline justify-between border-t border-at-rule-faint pt-2">
                            <span className="at-folio text-[9px]">
                              {stats.total_claims} claims · {cites.length} refs
                            </span>
                            <span
                              className="at-mono text-[12px]"
                              style={{ color: pigment }}
                            >
                              {pct}%
                            </span>
                          </div>
                          <div
                            className="mt-1"
                            style={{ color: pigment }}
                          >
                            <CitationSpark
                              pct={pct}
                              width={188}
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
          );
        })}
      </div>
    </div>
  );
}

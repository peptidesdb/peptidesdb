import Link from "next/link";
import type { Metadata } from "next";
import { loadAllPeptides } from "@/lib/content";
import { computePeptideStats } from "@/lib/peptide-stats";
import { citationsUsedBy } from "@/lib/peptide-cites";
import { CitationSpark, PeptideMotif, pigmentFor } from "@/lib/peptide-motif";
import { JsonLd } from "@/components/seo/JsonLd";
import { HUB_CATEGORIES } from "@/lib/categories";
import { SITE_URL } from "@/lib/site";

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

  // Dataset structured data — makes the atlas a citable dataset an AI engine
  // or another database can reference, not just a page it reads.
  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "PeptidesDB — Specimen Atlas of Research Peptides",
    description:
      "An open, citation-dense reference dataset of research peptides: mechanism, dosage, evidence tier, side effects, and per-claim PubMed citations for each compound, plus third-party lab-report provenance.",
    url: `${SITE_URL}/catalog`,
    sameAs: "https://github.com/peptidesdb/peptidesdb",
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "PeptidesDB", url: SITE_URL },
    keywords: [
      "research peptides",
      "peptide reference",
      "HPLC purity",
      "PubMed citations",
      "mechanism",
      "dosage",
    ],
    variableMeasured: [
      "mechanism",
      "dosage",
      "evidence tier",
      "side effects",
      "citation density",
      "HPLC purity",
    ],
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${SITE_URL}/api/peptides`,
      },
      {
        "@type": "DataDownload",
        encodingFormat: "text/yaml",
        contentUrl:
          "https://github.com/peptidesdb/peptidesdb/tree/main/content/peptides",
      },
    ],
  };

  return (
    <div className="mx-auto max-w-[1280px] px-6 lg:px-12 pt-12 lg:pt-20">
      <JsonLd data={datasetLd} />
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

      {/* BROWSE BY CATEGORY — hub links (class-level landing pages) —— */}
      <nav aria-label="Browse by category" className="mb-16 at-plate at-d2">
        <div className="at-folio mb-4">Browse by category</div>
        <div className="flex flex-wrap gap-3">
          {HUB_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/catalog/${c.slug}`}
              className="at-card px-4 py-2 text-[14px] hover:border-at-ink transition-colors"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </nav>

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

      {/* CITE THIS DATASET ——————————————————————————————— */}
      <footer className="mt-24 border-t-2 border-at-ink pt-8 pb-16">
        <div className="at-folio mb-3">Cite this dataset</div>
        <p className="text-[15px] leading-[1.7] text-at-ink-warm max-w-[720px]">
          PeptidesDB — Specimen Atlas of Research Peptides.{" "}
          {SITE_URL.replace(/^https?:\/\//, "")} (accessed{" "}
          {new Date().getFullYear()}). MIT-licensed; source at
          github.com/peptidesdb/peptidesdb.
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-3 mt-5">
          <a
            href={`${SITE_URL}/api/peptides`}
            className="at-folio hover:text-at-gold"
            target="_blank"
            rel="noopener noreferrer"
          >
            JSON API ↗
          </a>
          <a
            href="https://github.com/peptidesdb/peptidesdb/tree/main/content/peptides"
            className="at-folio hover:text-at-gold"
            target="_blank"
            rel="noopener noreferrer"
          >
            YAML source ↗
          </a>
          <Link href="/verify" className="at-folio hover:text-at-gold">
            Lab reports →
          </Link>
        </div>
      </footer>
    </div>
  );
}

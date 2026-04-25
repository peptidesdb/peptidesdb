import Link from "next/link";
import { loadAllPeptides } from "@/lib/content";
import { QuickCard } from "@/components/peptide/QuickCard";
import { EvidenceLevelBadge } from "@/components/peptide/EvidenceLevelBadge";
import { MaturityBadge } from "@/components/peptide/MaturityBadge";

export const dynamic = "force-static";

export default function HomePage() {
  const peptides = loadAllPeptides();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-20">
      <header className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
          <span className="size-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
          Open research peptide reference · v0.1
        </div>
        <h1 className="mt-6 text-[40px] sm:text-[56px] leading-[1.05] font-semibold tracking-tight text-[var(--color-text)]">
          The peptide reference researchers can{" "}
          <span className="text-[var(--color-accent)]">cite</span>,{" "}
          <span className="text-[var(--color-tesamorelin)]">compare</span>, and{" "}
          <span className="text-[#a78bfa]">contribute</span> to.
        </h1>
        <p className="mt-6 text-[16px] leading-relaxed text-[var(--color-text-secondary)] max-w-2xl">
          Side-by-side analysis of mechanism, dosage, evidence, side effects,
          administration, and stack synergy. PubMed-cited claims, version-controlled
          edits, MIT-licensed data. Built for researchers, by researchers.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={`/p/${peptides[0]?.slug ?? "tesamorelin"}`}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-[13px] font-semibold text-[#0c1421] hover:opacity-90 transition-opacity"
          >
            Browse a profile →
          </Link>
          <a
            href="https://github.com/peptidedb/peptidedb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-[13px] font-semibold text-[var(--color-text)] hover:border-[var(--color-border-strong)] transition-colors"
          >
            Star on GitHub
          </a>
        </div>
      </header>

      <section className="mt-16">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="text-[20px] font-semibold tracking-tight text-[var(--color-text)]">
            Catalog
          </h2>
          <span className="text-[12px] text-[var(--color-text-muted)] font-mono">
            {peptides.length} peptide{peptides.length === 1 ? "" : "s"}
          </span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {peptides.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/p/${p.slug}`}
                className="block group transition-transform hover:-translate-y-0.5"
              >
                <article className="relative">
                  <QuickCard peptide={p} />
                  <div className="absolute top-5 right-5 flex flex-col items-end gap-2">
                    <EvidenceLevelBadge level={p.evidence_level} />
                    <MaturityBadge maturity={p.maturity} />
                  </div>
                  <div className="mt-3 px-1 text-[12px] text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors">
                    Read profile →
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-accent)] mb-3">
            Citations first
          </div>
          <h3 className="text-[16px] font-semibold text-[var(--color-text)]">
            Every claim, linked to source
          </h3>
          <p className="mt-2 text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
            Numerical claims and protocol decisions cite PubMed, NEJM, Lancet, or
            ClinicalTrials.gov directly. No untraceable folklore.
          </p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-tesamorelin)] mb-3">
            Side by side
          </div>
          <h3 className="text-[16px] font-semibold text-[var(--color-text)]">
            Compare any two peptides instantly
          </h3>
          <p className="mt-2 text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
            Pick any two — or three — and see mechanism, dosage, evidence, and
            stack synergy lined up at the same parameter rows.
          </p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="text-[11px] font-medium uppercase tracking-wider text-[#a78bfa] mb-3">
            Open data
          </div>
          <h3 className="text-[16px] font-semibold text-[var(--color-text)]">
            Every peptide is one PR away
          </h3>
          <p className="mt-2 text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
            Content lives as YAML in a public GitHub repo. Edit a fact, propose a
            new peptide, fix a citation — all via standard pull requests.
          </p>
        </div>
      </section>
    </div>
  );
}

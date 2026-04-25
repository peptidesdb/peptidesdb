import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ChevronRight } from "lucide-react";
import { getPeptide, loadAllPeptides } from "@/lib/content";
import { QuickCard } from "@/components/peptide/QuickCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CompareTable } from "@/components/peptide/CompareTable";
import { MechanismCard } from "@/components/peptide/MechanismCard";
import { ContraindicationPanel } from "@/components/peptide/ContraindicationPanel";
import { AdminSteps } from "@/components/peptide/AdminSteps";
import { StackCard } from "@/components/peptide/StackCard";
import { EvidenceBar } from "@/components/peptide/EvidenceBar";
import { MaturityBadge } from "@/components/peptide/MaturityBadge";
import { EvidenceLevelBadge } from "@/components/peptide/EvidenceLevelBadge";
import { SectionFilter } from "@/components/site/SectionFilter";

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
    description: p.summary,
    openGraph: {
      title: `${p.name} · PeptideDB`,
      description: p.summary,
      type: "article",
    },
  };
}

export default async function PeptidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getPeptide(slug);
  if (!p) notFound();

  const available: string[] = [];
  if (p.mechanism) available.push("mechanism");
  if (p.dosage) available.push("dosage");
  if (p.fat_loss) available.push("fat-loss");
  if (p.side_effects) available.push("side-effects");
  if (p.administration) available.push("administration");
  if (p.synergy && p.synergy.stacks.length > 0) available.push("synergy");

  // schema.org/Drug structured data — improves AI citation surface.
  // Content is built from typed Zod-validated peptide data; no user input.
  // We escape `<` to neutralize any future content containing HTML chars.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Drug",
    name: p.name,
    alternateName: p.aliases,
    description: p.summary,
    drugClass: p.peptide_class,
    legalStatus: p.fda_approved ? "FDA-approved" : "Research use only",
    url: `https://peptidedb.org/p/${p.slug}`,
  };
  const jsonLdString = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  const evidenceColor: "blue" | "green" | "purple" | "amber" | "teal" | "rose" | "cyan" = p.color;

  return (
    <article>
      {/* JSON-LD via next/script — hook-safe, no dangerouslySetInnerHTML */}
      <Script
        id={`ld-json-${p.slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {jsonLdString}
      </Script>

      {/* HERO */}
      <header className="border-b border-[var(--color-border)] bg-[color:color-mix(in_oklab,var(--color-surface)_50%,transparent)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
          <nav className="flex items-center gap-1 text-[12px] text-[var(--color-text-muted)] mb-6">
            <Link href="/" className="hover:text-[var(--color-text)] transition-colors">
              Catalog
            </Link>
            <ChevronRight size={12} />
            <span className="text-[var(--color-text)]">{p.name}</span>
          </nav>

          <div className="flex flex-wrap items-baseline gap-3 mb-4">
            <h1 className="text-[44px] sm:text-[60px] leading-[1.04] font-semibold tracking-tight text-[var(--color-text)]">
              {p.name}
            </h1>
            <span className="text-[15px] text-[var(--color-text-muted)] font-mono">
              {p.peptide_class}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            <EvidenceLevelBadge level={p.evidence_level} />
            <MaturityBadge maturity={p.maturity} />
            {p.fda_approved && p.approval_year && (
              <span className="text-[11px] text-[var(--color-text-muted)] font-mono">
                FDA-approved {p.approval_year}
              </span>
            )}
            <span className="text-[11px] text-[var(--color-text-muted)] font-mono ml-auto">
              Last reviewed {p.last_reviewed}
            </span>
          </div>

          <p className="max-w-3xl text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            {p.summary}
          </p>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl">
            <QuickCard peptide={p} />
          </div>
        </div>
      </header>

      <SectionFilter available={available} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-16">
        {/* MECHANISM */}
        <section data-category="mechanism" id="mechanism" className="scroll-mt-32">
          <SectionHeading number="01" title="Mechanism of Action" />
          <MechanismCard mechanism={p.mechanism} color={p.color} />
        </section>

        {/* DOSAGE */}
        <section data-category="dosage" id="dosage" className="scroll-mt-32">
          <SectionHeading number="02" title="Dosage Protocols" />
          <CompareTable rows={p.dosage.rows} />
        </section>

        {/* FAT LOSS / METABOLIC EVIDENCE */}
        {p.fat_loss && (
          <section data-category="fat-loss" id="fat-loss" className="scroll-mt-32">
            <SectionHeading number="03" title="Metabolic / Fat Loss Evidence" />
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 mb-6">
              <EvidenceBar
                label={`${p.name} — Evidence Strength`}
                percent={p.fat_loss.evidence_strength}
                meta={p.fat_loss.evidence_meta}
                color={evidenceColor}
              />
            </div>
            <CompareTable rows={p.fat_loss.rows} />
          </section>
        )}

        {/* SIDE EFFECTS */}
        <section data-category="side-effects" id="side-effects" className="scroll-mt-32">
          <SectionHeading number="04" title="Side Effects & Safety" />
          <CompareTable
            rows={p.side_effects.rows}
            showSeverity
            columns={["Effect", "Detail", "Notes"]}
          />
          <ContraindicationPanel
            absolute={p.side_effects.contraindications_absolute}
            relative={p.side_effects.contraindications_relative}
          />
        </section>

        {/* ADMINISTRATION */}
        <section data-category="administration" id="administration" className="scroll-mt-32">
          <SectionHeading number="05" title="Administration Protocol" />
          <AdminSteps steps={p.administration.steps} color={p.color} />
        </section>

        {/* SYNERGY */}
        {p.synergy && p.synergy.stacks.length > 0 && (
          <section data-category="synergy" id="synergy" className="scroll-mt-32">
            <SectionHeading number="06" title="Stack Synergy" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {p.synergy.stacks.map((stack, i) => (
                <StackCard key={i} {...stack} pep={p.name} />
              ))}
            </div>
          </section>
        )}

        {/* CONTRIBUTOR FOOTER */}
        <section className="border-t border-[var(--color-border)] pt-8 text-[12px] text-[var(--color-text-muted)] flex flex-wrap items-center gap-3">
          {p.contributors.length > 0 && (
            <span>
              Contributors:{" "}
              {p.contributors.map((c, i) => (
                <span key={c} className="font-mono">
                  {c}
                  {i < p.contributors.length - 1 && ", "}
                </span>
              ))}
            </span>
          )}
          <a
            href={`https://github.com/peptidedb/peptidedb/blob/main/content/peptides/${p.slug}.yaml`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto hover:text-[var(--color-accent)] transition-colors"
          >
            Edit on GitHub →
          </a>
        </section>
      </div>
    </article>
  );
}

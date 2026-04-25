import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowLeftRight } from "lucide-react";
import { getPeptide, loadAllPeptides } from "@/lib/content";
import { computePeptideStats } from "@/lib/peptide-stats";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ComparisonHeroCards } from "@/components/compare/ComparisonHeroCards";
import { ParameterGrid } from "@/components/compare/ParameterGrid";
import { ContraindicationsCompare } from "@/components/compare/ContraindicationsCompare";
import { CitationDensityBadge } from "@/components/peptide/CitationDensityBadge";
import { EvidenceLevelBadge } from "@/components/peptide/EvidenceLevelBadge";
import { MaturityBadge } from "@/components/peptide/MaturityBadge";

export const dynamic = "force-static";
export const dynamicParams = true; // ISR for rare pairs not pre-built
export const revalidate = 3600;

/**
 * Pre-render the canonical (alphabetically sorted, unique-pair) compares.
 * Non-canonical permutations (b-vs-a) redirect to the canonical form to
 * avoid duplicate canonical URLs. Cap at 100; rest go via ISR.
 */
export function generateStaticParams() {
  const peptides = loadAllPeptides();
  const params: { slugs: string }[] = [];
  for (let i = 0; i < peptides.length; i++) {
    for (let j = i + 1; j < peptides.length; j++) {
      const sorted = [peptides[i].slug, peptides[j].slug].sort();
      params.push({ slugs: `${sorted[0]}-vs-${sorted[1]}` });
      if (params.length >= 100) return params;
    }
  }
  return params;
}

function parseSlugs(combined: string): string[] | null {
  // Form: "a-vs-b" or "a-vs-b-vs-c"
  const parts = combined.split("-vs-");
  if (parts.length < 2 || parts.length > 3) return null;
  if (parts.some((p) => !/^[a-z0-9][a-z0-9-]*$/.test(p))) return null;
  // Reject self-compare (a-vs-a, a-vs-b-vs-a)
  const unique = new Set(parts);
  if (unique.size !== parts.length) return null;
  return parts;
}

/** Canonical form: slugs sorted alphabetically. */
function canonicalize(slugs: string[]): string {
  return [...slugs].sort().join("-vs-");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slugs: string }>;
}): Promise<Metadata> {
  const { slugs: combined } = await params;
  const slugs = parseSlugs(combined);
  if (!slugs) return { title: "Comparison not found" };
  const peptides = slugs.map(getPeptide).filter((p) => p !== undefined);
  if (peptides.length !== slugs.length) return { title: "Comparison not found" };
  const names = peptides.map((p) => p!.name).join(" vs ");
  return {
    title: `${names}`,
    description: `Side-by-side comparison: ${peptides
      .map((p) => `${p!.name} (${p!.peptide_class})`)
      .join(", ")}. Mechanism, dosage, evidence, side effects, and stack synergies.`,
    alternates: { canonical: `/compare/${combined}` },
  };
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slugs: string }>;
}) {
  const { slugs: combined } = await params;
  const slugs = parseSlugs(combined);
  if (!slugs) notFound();

  // Canonicalize: redirect non-sorted permutations to the canonical URL.
  const canonical = canonicalize(slugs);
  if (canonical !== combined) {
    redirect(`/compare/${canonical}`);
  }

  const peptides = slugs.map(getPeptide).filter((p): p is NonNullable<ReturnType<typeof getPeptide>> => p !== undefined);
  if (peptides.length !== slugs.length) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${peptides.map((p) => p.name).join(" vs ")} — Peptide Comparison`,
    description: peptides
      .map((p) => `${p.name}: ${p.summary.slice(0, 100)}...`)
      .join(" "),
    url: `https://peptidedb.org/compare/${combined}`,
  };

  const stats = peptides.map((p) => computePeptideStats(p));

  return (
    <article>
      <JsonLd data={jsonLd} />

      {/* HERO */}
      <header className="border-b border-[var(--color-border)] bg-[color:color-mix(in_oklab,var(--color-surface)_50%,transparent)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-14">
          <nav className="flex items-center gap-1 text-[12px] text-[var(--color-text-muted)] mb-6">
            <Link href="/" className="hover:text-[var(--color-text)] transition-colors">
              Catalog
            </Link>
            <ChevronRight size={12} />
            <Link href="/compare" className="hover:text-[var(--color-text)] transition-colors">
              Compare
            </Link>
            <ChevronRight size={12} />
            <span className="text-[var(--color-text)]">
              {peptides.map((p) => p.name).join(" vs ")}
            </span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
            <ArrowLeftRight size={11} /> Side-by-side · Research reference
          </div>

          <h1 className="mt-6 text-[40px] sm:text-[56px] leading-[1.05] font-semibold tracking-tight text-[var(--color-text)] flex flex-wrap items-baseline gap-x-4 gap-y-2">
            {peptides.map((p, i) => (
              <span key={p.slug} className="inline-flex items-baseline gap-3">
                <span>{p.name}</span>
                {i < peptides.length - 1 && (
                  <span className="text-[24px] font-mono text-[var(--color-text-muted)] mx-2">
                    vs
                  </span>
                )}
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            Side-by-side comparison across mechanism, dosage, evidence, side
            effects, administration, and stack synergies. Citations on every
            claim where available.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            {peptides.map((p, i) => (
              <div
                key={p.slug}
                className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] pl-2 pr-3 py-1"
              >
                <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
                  {String.fromCharCode(65 + i)}
                </span>
                <EvidenceLevelBadge level={p.evidence_level} />
                <MaturityBadge maturity={p.maturity} />
                <CitationDensityBadge
                  cited={stats[i].cited_claims}
                  total={stats[i].total_claims}
                  density={stats[i].citation_density}
                />
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-16">
        <ComparisonHeroCards peptides={peptides} />

        <section id="mechanism" className="scroll-mt-32">
          <SectionHeading number="01" title="Mechanism of Action" />
          <ParameterGrid
            peptides={peptides}
            columns={[
              { key: "primary_target", label: "Primary target" },
              { key: "pathway", label: "Pathway" },
              { key: "downstream_effect", label: "Downstream effect" },
              { key: "feedback_intact", label: "Feedback intact?" },
              { key: "origin", label: "Origin" },
              { key: "antibody_development", label: "Antibody development" },
            ]}
            section="mechanism"
          />
        </section>

        <section id="dosage" className="scroll-mt-32">
          <SectionHeading number="02" title="Dosage Protocols" />
          <ParameterGrid
            peptides={peptides}
            section="dosage_rows"
          />
        </section>

        {peptides.some((p) => p.fat_loss) && (
          <section id="fat-loss" className="scroll-mt-32">
            <SectionHeading number="03" title="Metabolic / Fat Loss Evidence" />
            <ParameterGrid peptides={peptides} section="fat_loss_rows" />
          </section>
        )}

        <section id="side-effects" className="scroll-mt-32">
          <SectionHeading number="04" title="Side Effects & Safety" />
          <ParameterGrid peptides={peptides} section="side_effects_rows" />
          <div className="mt-6">
            <ContraindicationsCompare peptides={peptides} />
          </div>
        </section>

        <section id="administration" className="scroll-mt-32">
          <SectionHeading number="05" title="Administration Protocol" />
          <ParameterGrid peptides={peptides} section="administration_steps" />
        </section>
      </div>
    </article>
  );
}

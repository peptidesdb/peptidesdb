import type { Metadata } from "next";
import { loadAllPeptides } from "@/lib/content";
import { StackDesigner } from "@/components/stack/StackDesigner";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Stack designer",
  description:
    "Build a peptide stack interactively. Search the atlas, add plates, see structural conflict warnings + recognised synergies, share the URL.",
  alternates: { canonical: "/stack" },
};

export default function StackPage() {
  const peptides = loadAllPeptides().map((p) => ({
    slug: p.slug,
    name: p.name,
    peptide_class: p.peptide_class,
    classification: p.classification,
    color: p.color,
    aliases: p.aliases,
    evidence_level: p.evidence_level,
    categories: p.categories,
  }));

  return (
    <div className="mx-auto max-w-[1280px] px-6 lg:px-12 pt-12 lg:pt-20">
      <header className="border-b-2 border-at-ink pb-8 mb-12 at-plate at-d1">
        <div className="at-folio mb-6">§ Stack designer</div>
        <div className="grid grid-cols-12 gap-8 items-end">
          <h1 className="col-span-12 lg:col-span-9 at-display text-[clamp(48px,7vw,108px)] leading-[0.95]">
            Design a stack,{" "}
            <em
              className="at-display-italic"
              style={{ color: "var(--at-pigment-rust)" }}
            >
              with structural guardrails.
            </em>
          </h1>
          <p className="col-span-12 lg:col-span-3 text-[13px] leading-[1.6] text-at-ink-soft">
            Click plates from the atlas to add them. PeptidesDB runs a
            rule-based conflict check and surfaces recognised synergies
            from the documented literature. Every selection is encoded in
            the URL — shareable instantly.
          </p>
        </div>
      </header>

      <div className="at-plate at-d2 mb-16">
        <StackDesigner peptides={peptides} />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-at-rule at-plate at-d3">
        {[
          {
            num: "01",
            title: "Rule-based, not AI",
            body: "Conflict checks come from the schema. Multiple GLP-1 RAs, two GHRPs at once, melanocortin overlap, GH-axis with angiogenic peptides — every rule is deterministic, auditable, and visible at src/lib/stack-conflicts.ts.",
          },
          {
            num: "02",
            title: "Synergies surfaced",
            body: "When you add two plates that share a documented synergy in the YAML (e.g. GHRH + GHRP), the designer flags the recognised stack with the citation that supports it.",
          },
          {
            num: "03",
            title: "Reference, not advice",
            body: "Conflict rules cover structural class-level concerns. Individual decisions about dose, timing, monitoring, and contraindications require your own literature review and a licensed clinician.",
          },
        ].map((m) => (
          <div key={m.num} className="bg-at-bone p-6">
            <div className="flex items-baseline gap-3 mb-3">
              <span
                className="at-display text-[28px] leading-none"
                style={{ color: "var(--at-gold)" }}
              >
                {m.num}
              </span>
              <span className="at-folio">Note {m.num}</span>
            </div>
            <div className="at-display text-[20px] leading-[1.2] mb-2">
              {m.title}
            </div>
            <p className="text-[13.5px] leading-[1.6] text-at-ink-warm">
              {m.body}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

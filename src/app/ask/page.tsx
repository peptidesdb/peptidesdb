import type { Metadata } from "next";
import { AskPanel } from "@/components/ask/AskPanel";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Ask the atlas",
  description:
    "Ask a research question about peptides. Answers are grounded only in the Specimen Atlas content + citations — no hallucination.",
  alternates: { canonical: "/ask" },
};

export default function AskPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 lg:px-12 pt-12 lg:pt-20">
      <header className="border-b-2 border-at-ink pb-8 mb-12 at-plate at-d1">
        <div className="at-folio mb-6">§ Ask</div>
        <div className="grid grid-cols-12 gap-8 items-end">
          <h1 className="col-span-12 lg:col-span-9 at-display text-[clamp(48px,7vw,108px)] leading-[0.95]">
            Ask the atlas,{" "}
            <em
              className="at-display-italic"
              style={{ color: "var(--at-pigment-rust)" }}
            >
              grounded in the catalogue.
            </em>
          </h1>
          <p className="col-span-12 lg:col-span-3 text-[13px] leading-[1.6] text-at-ink-soft">
            Powered by Claude Sonnet, restricted to atlas content. Every
            cited claim links to its source paper. The assistant declines
            to speculate beyond what is in the catalogue.
          </p>
        </div>
      </header>

      <div className="at-plate at-d2 mb-20">
        <AskPanel />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-at-rule at-plate at-d3">
        {[
          {
            num: "01",
            title: "Grounded retrieval",
            body: "Only your YAML files. The retriever scores keyword overlap against every plate, picks the top six, and passes them as context. Claude is instructed to refuse claims not in that context.",
            color: "var(--at-pigment-rust)",
          },
          {
            num: "02",
            title: "Cited inline",
            body: "Every claim, traceable. Cite IDs like falutz-2007 render as live chips. They link to the canonical source paper via PubMed, DOI, or ClinicalTrials.gov.",
            color: "var(--at-pigment-teal)",
          },
          {
            num: "03",
            title: "Disclaimer",
            body: "Research, not medical advice. The assistant is configured to refuse medical-advice requests and point you to a licensed clinician. Use it as a research-literature companion, not a prescription source.",
            color: "var(--at-bad)",
          },
        ].map((m) => (
          <div key={m.num} className="bg-at-bone p-6">
            <div className="flex items-baseline gap-3 mb-3">
              <span
                className="at-display text-[28px] leading-none"
                style={{ color: m.color }}
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

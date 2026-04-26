import { EmptyState } from "@/components/site/EmptyState";

/**
 * Per-route not-found for /p/[slug]. Triggered when a slug is not part
 * of the static-build set (`dynamicParams: false` in page.tsx).
 *
 * Editorial colophon style per D2 — italic message, plain-prose detail,
 * mono-caps action back to the catalogue.
 */
export default function PeptideNotFound() {
  return (
    <div className="mx-auto max-w-[880px] px-6 lg:px-12 pt-12 lg:pt-20">
      <EmptyState
        message="This plate isn't in the atlas."
        detail="The slug you followed doesn't match any peptide in the catalogue. Check the spelling, or browse the full set of plates below."
        action={{ label: "Return to catalogue", href: "/catalog" }}
      />
    </div>
  );
}

import { EmptyState } from "@/components/site/EmptyState";

/**
 * Per-route not-found for /compare/[slugs]. Triggered when one or both
 * slugs in the URL fail to resolve to a peptide, or when the URL shape
 * itself is invalid (e.g. self-compare, more than three slugs, malformed
 * separators).
 *
 * Editorial colophon style per D2 — italic message, plain-prose detail
 * explaining the slug format, mono-caps action back to the catalogue.
 */
export default function CompareNotFound() {
  return (
    <div className="mx-auto max-w-[880px] px-6 lg:px-12 pt-12 lg:pt-20">
      <EmptyState
        message="This comparison isn't in the atlas."
        detail="Comparison URLs follow the form /compare/peptide-a-vs-peptide-b. Both slugs must match peptides in the catalogue, and a comparison may join up to three plates."
        action={{ label: "Return to catalogue", href: "/catalog" }}
      />
    </div>
  );
}

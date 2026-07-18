import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { HUB_CATEGORIES, hubCategory, peptidesInCategory } from "@/lib/categories";
import { displayClass } from "@/lib/answer-blocks";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return HUB_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const hub = hubCategory(category);
  if (!hub) return { title: "Not found" };
  const n = peptidesInCategory(category).length;
  const desc = `${hub.label} in the PeptidesDB reference — ${n} research compounds with mechanism, evidence, and reference data and linked sources. Research use only.`;
  return {
    title: { absolute: `${hub.label} — PeptidesDB Reference` },
    description: desc,
    openGraph: { title: `${hub.label} · PeptidesDB`, description: desc, type: "website" },
    alternates: { canonical: `/catalog/${hub.slug}` },
  };
}

export default async function CategoryHubPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const hub = hubCategory(category);
  if (!hub) notFound();
  const members = peptidesInCategory(category);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${hub.label} — PeptidesDB`,
    description: `Research-peptide reference plates in the ${hub.label} category.`,
    url: `${SITE_URL}/catalog/${hub.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: members.length,
      itemListElement: members.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/p/${p.slug}`,
        name: p.name,
      })),
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Catalogue", item: `${SITE_URL}/catalog` },
      { "@type": "ListItem", position: 2, name: hub.label, item: `${SITE_URL}/catalog/${hub.slug}` },
    ],
  };

  return (
    <article className="mx-auto max-w-[1280px] px-6 lg:px-12 pt-12 lg:pt-16 pb-16">
      <JsonLd data={itemListLd} />
      <JsonLd data={breadcrumbLd} />

      <div className="flex items-baseline justify-between border-b border-at-rule pb-3 mb-12">
        <Link href="/catalog" className="at-folio hover:text-at-gold">
          ← Catalogue
        </Link>
        <span className="at-folio">{members.length} plates</span>
      </div>

      <header className="mb-14 at-plate at-d1">
        <div className="at-folio mb-3">Category</div>
        <h1 className="at-display text-[clamp(40px,7vw,88px)] leading-[0.95]">
          {hub.label}
        </h1>
        <p className="mt-6 text-[17px] leading-[1.55] max-w-2xl text-at-ink-warm">
          {hub.blurb} Each plate carries mechanism, evidence, and reference
          data, with primary-literature sources linked where available.
          Reference information for research use only.
        </p>
      </header>

      <section aria-label="Plates in this category" className="at-plate at-d2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {members.map((p) => (
            <Link
              key={p.slug}
              href={`/p/${p.slug}`}
              className="at-card p-5 hover:border-at-ink transition-colors block"
            >
              <div className="at-display text-[22px] leading-tight">{p.name}</div>
              <div className="at-folio normal-case tracking-normal text-[12px] text-at-ink-soft mt-1">
                {displayClass(p.peptide_class)}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-at-rule pt-8 mt-14 at-folio leading-[1.6] normal-case tracking-normal text-[12px] text-at-ink-soft">
        <Link href="/catalog" className="at-link">
          ← Back to full catalogue
        </Link>
      </section>
    </article>
  );
}

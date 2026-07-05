import type { MetadataRoute } from "next";
import { loadAllPeptides } from "@/lib/content";
import { SITE_URL as SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const peptides = loadAllPeptides();
  const now = new Date().toISOString().split("T")[0];

  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  // Per-peptide pages
  for (const p of peptides) {
    entries.push({
      url: `${SITE}/p/${p.slug}`,
      lastModified: p.last_reviewed,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  // All pairwise comparisons. Canonical form is the alphabetically-sorted
  // SLUG pair — must match canonicalize() in /compare/[slugs]/page.tsx,
  // otherwise the sitemap emits URLs that 308-redirect, which Google reports
  // as "Page with redirect" in the Indexing report. loadAllPeptides() sorts
  // by NAME, not slug, and a few peptides have name/slug ordering that
  // diverges (e.g. "5-Amino-1MQ" → "5-amino-1mq", "α-MSH" → "alpha-msh"),
  // so we sort the slug pair explicitly here.
  for (let i = 0; i < peptides.length; i++) {
    for (let j = i + 1; j < peptides.length; j++) {
      const [a, b] = [peptides[i].slug, peptides[j].slug].sort();
      entries.push({
        url: `${SITE}/compare/${a}-vs-${b}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}

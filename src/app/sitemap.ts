import type { MetadataRoute } from "next";
import { loadAllPeptides } from "@/lib/content";
import { allProvenance } from "@/lib/provenance";
import { HUB_CATEGORIES } from "@/lib/categories";
import { SITE_URL as SITE } from "@/lib/site";

/* Static routes worth advertising to search + AI crawlers. */
const CORE_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/catalog", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/compare", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/stack", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/calculator", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/verify", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/ask", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contribute", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/independence", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/funding", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/methodology", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/corrections", priority: 0.4, changeFrequency: "weekly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/imprint", priority: 0.3, changeFrequency: "yearly" as const },
];

/* Demand-ranked compounds whose pairwise comparisons are worth advertising in
   the sitemap. The full C(81,2) ≈ 3,240 combinatorial compare space is
   deliberately NOT enumerated: it drowned the 81 real plates and reads to
   Google as auto-generated bulk. Every pair still renders (ISR) at
   /compare/[slugs]; only this curated subset is listed. Pairs are generated
   only among seeds that exist as real plates. */
const COMPARE_SEEDS = [
  "semaglutide",
  "tirzepatide",
  "retatrutide",
  "cagrilintide",
  "bpc-157",
  "tb-500",
  "ghk-cu",
  "cjc-1295",
  "ipamorelin",
  "sermorelin",
  "tesamorelin",
  "mots-c",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const peptides = loadAllPeptides();
  const now = new Date().toISOString().split("T")[0];
  const slugs = new Set(peptides.map((p) => p.slug));

  const entries: MetadataRoute.Sitemap = CORE_ROUTES.map((r) => ({
    url: `${SITE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Per-peptide plates
  for (const p of peptides) {
    entries.push({
      url: `${SITE}/p/${p.slug}`,
      lastModified: p.last_reviewed,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  // Full-corpus markdown endpoint for AI crawlers (index lives at /llms.txt).
  entries.push({
    url: `${SITE}/llms-full.txt`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  });

  // Category hub pages — class-level landing pages (curated substantive set).
  for (const c of HUB_CATEGORIES) {
    entries.push({
      url: `${SITE}/catalog/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Lab-report permalinks — each a shareable, AI-citable verification artifact.
  for (const r of allProvenance()) {
    entries.push({
      url: `${SITE}/verify/${r.reportCode}`,
      lastModified: r.testDate,
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  // Curated compare pairs. Canonical alphabetical slug order matches
  // canonicalize() in /compare/[slugs]/page.tsx so the sitemap never emits a
  // URL that 308-redirects (which Google flags as "Page with redirect").
  const seeds = COMPARE_SEEDS.filter((s) => slugs.has(s));
  const seen = new Set<string>();
  for (let i = 0; i < seeds.length; i++) {
    for (let j = i + 1; j < seeds.length; j++) {
      const [a, b] = [seeds[i], seeds[j]].sort();
      const key = `${a}-vs-${b}`;
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push({
        url: `${SITE}/compare/${key}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}

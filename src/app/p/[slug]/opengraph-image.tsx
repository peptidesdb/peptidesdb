import { ImageResponse } from "next/og";
import { getPeptide, loadAllPeptides } from "@/lib/content";
import { computePeptideStats } from "@/lib/peptide-stats";
import { citationsUsedBy } from "@/lib/peptide-cites";
import { pigmentHexFor } from "@/lib/peptide-motif";
import { SITE_HOST } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const dynamicParams = false;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return loadAllPeptides().map((p) => ({ slug: p.slug }));
}

const ROMAN: Record<number, string> = {
  1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII", 8: "VIII",
  9: "IX", 10: "X", 11: "XI", 12: "XII", 13: "XIII", 14: "XIV", 15: "XV",
  16: "XVI", 17: "XVII", 18: "XVIII", 19: "XIX", 20: "XX", 21: "XXI",
  22: "XXII", 23: "XXIII", 24: "XXIV", 25: "XXV", 26: "XXVI", 27: "XXVII",
  28: "XXVIII", 29: "XXIX", 30: "XXX",
};

/* FNV-1a-ish stable hash — matches lib/peptide-motif.tsx so the OG
   card motif and the in-page motif are pixel-identical. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

/**
 * /p/[slug]/opengraph-image — 1200×630 Atlas-aesthetic share card.
 * Bone-white surface, class-pigment swatch + folio + Instrument-Serif-
 * style display name + specimen motif + Tufte ledger of claim counts.
 *
 * Satori can't easily load Google Fonts, so we fall back to system
 * serif (Georgia / Times) and monospace. The visual identity comes
 * from layout, color, and the deterministic motif — not from the
 * specific font face — so the card still reads as the atlas.
 */
export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getPeptide(slug);
  if (!p) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            background: "#f8f6f1",
            color: "#0c1814",
            fontFamily: "Georgia, serif",
            fontSize: 56,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          PeptidesDB · an atlas
        </div>
      ),
      { ...size },
    );
  }

  const all = loadAllPeptides();
  const idx = all.findIndex((x) => x.slug === slug);
  const plateRoman = ROMAN[idx + 1] ?? String(idx + 1);
  const totalRoman = ROMAN[all.length] ?? String(all.length);

  const stats = computePeptideStats(p);
  const cites = citationsUsedBy(p);
  const pct = Math.round(
    (stats.cited_claims / Math.max(1, stats.total_claims)) * 100,
  );
  const pigment = pigmentHexFor(p.peptide_class);

  // Build the deterministic motif coordinates (12-node hex coat-of-arms),
  // matching lib/peptide-motif.tsx so the OG and in-page render the same.
  const motifSize = 280;
  const cx = motifSize / 2;
  const cy = motifSize / 2;
  const ringR = motifSize * 0.34;
  const innerR = motifSize * 0.18;
  const h = hash(p.slug);
  const nodes = Array.from({ length: 12 }).map((_, i) => {
    const t = (i / 12) * Math.PI * 2;
    const jitter = ((h >> (i * 2)) & 0x07) - 3.5;
    const r = ringR + jitter * 1.3;
    const r2 = i % 3 === 0
      ? innerR + (((h >> (i * 3)) & 0x05) - 2.5) * 1.2
      : null;
    return {
      x: cx + r * Math.cos(t),
      y: cy + r * Math.sin(t),
      x2: r2 == null ? null : cx + r2 * Math.cos(t + Math.PI / 12),
      y2: r2 == null ? null : cy + r2 * Math.sin(t + Math.PI / 12),
      bigDot: ((h >> (i + 4)) & 1) === 1,
    };
  });

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#f8f6f1",
          color: "#0c1814",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Class-pigment swatch stripe at the very top */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 8,
            background: pigment,
          }}
        />

        {/* Top folio strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 64px",
            borderBottom: "1px solid rgba(12,24,20,0.14)",
            fontFamily:
              "ui-monospace, 'JetBrains Mono', SFMono-Regular, Menlo, monospace",
            fontSize: 14,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#4a5852",
          }}
        >
          <span style={{ display: "flex" }}>
            Specimen Atlas · Plate {plateRoman} of {totalRoman}
          </span>
          <span style={{ display: "flex" }}>
            {p.fda_approved ? `FDA · ${p.approval_year}` : "Research"}
          </span>
        </div>

        {/* Main body: title left, motif right */}
        <div
          style={{
            display: "flex",
            flex: 1,
            padding: "44px 64px 24px 64px",
            gap: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: 16,
            }}
          >
            {/* Wordmark */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                fontFamily: "Georgia, serif",
                fontSize: 24,
                color: "#0c1814",
              }}
            >
              <span style={{ display: "flex" }}>PeptidesDB</span>
              <span
                style={{
                  display: "flex",
                  fontStyle: "italic",
                  color: "#4a5852",
                  fontSize: 18,
                }}
              >
                — an atlas
              </span>
            </div>

            {/* Peptide name — display serif at scale */}
            <div
              style={{
                display: "flex",
                fontFamily: "Georgia, serif",
                fontSize: p.name.length > 12 ? 88 : 120,
                fontWeight: 400,
                letterSpacing: "-3px",
                lineHeight: 0.95,
                color: "#0c1814",
                marginTop: 8,
              }}
            >
              {p.name}
            </div>

            {/* Italic class */}
            <div
              style={{
                display: "flex",
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: 26,
                color: "#4a5852",
                marginTop: 4,
              }}
            >
              {p.peptide_class}
            </div>

            {/* Summary (truncated) */}
            <div
              style={{
                display: "flex",
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: 18,
                lineHeight: 1.45,
                color: "#1a2722",
                marginTop: 16,
                maxWidth: 560,
              }}
            >
              {p.summary.value.slice(0, 180)}
              {p.summary.value.length > 180 ? "…" : ""}
            </div>
          </div>

          {/* Right column — specimen motif */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: motifSize + 20,
            }}
          >
            <svg
              width={motifSize}
              height={motifSize}
              viewBox={`0 0 ${motifSize} ${motifSize}`}
            >
              <circle
                cx={cx}
                cy={cy}
                r={ringR + 18}
                fill="none"
                stroke={pigment}
                strokeOpacity="0.25"
                strokeDasharray="4 6"
                strokeWidth="1.1"
              />
              <circle
                cx={cx}
                cy={cy}
                r={innerR}
                fill="none"
                stroke={pigment}
                strokeOpacity="0.4"
                strokeWidth="1.1"
              />
              {nodes.map((n, i) => {
                const next = nodes[(i + 1) % nodes.length];
                const opacity = ((h >> i) & 1) === 1 ? 0.55 : 0.22;
                return (
                  <line
                    key={`edge-${i}`}
                    x1={n.x}
                    y1={n.y}
                    x2={next.x}
                    y2={next.y}
                    stroke={pigment}
                    strokeOpacity={opacity}
                    strokeWidth="1"
                  />
                );
              })}
              {nodes
                .filter((n) => n.x2 != null && n.y2 != null)
                .map((n, i) => (
                  <line
                    key={`spoke-${i}`}
                    x1={n.x}
                    y1={n.y}
                    x2={n.x2!}
                    y2={n.y2!}
                    stroke={pigment}
                    strokeOpacity="0.32"
                    strokeWidth="0.8"
                  />
                ))}
              {nodes.map((n, i) => (
                <circle
                  key={`node-${i}`}
                  cx={n.x}
                  cy={n.y}
                  r={n.bigDot ? 5 : 2.8}
                  fill={n.bigDot ? pigment : "#f8f6f1"}
                  stroke={pigment}
                  strokeWidth="1"
                />
              ))}
              <circle cx={cx} cy={cy} r="3.6" fill={pigment} />
            </svg>
            <div
              style={{
                display: "flex",
                fontFamily:
                  "ui-monospace, 'JetBrains Mono', SFMono-Regular, monospace",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#4a5852",
                marginTop: 12,
              }}
            >
              Fig. 1 · {p.slug}
            </div>
          </div>
        </div>

        {/* Tufte ledger footer: 4 cells (claims · cited · refs · url) */}
        <div
          style={{
            display: "flex",
            borderTop: "2px solid #0c1814",
            padding: "20px 64px",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily:
              "ui-monospace, 'JetBrains Mono', SFMono-Regular, monospace",
          }}
        >
          <div style={{ display: "flex", gap: 56 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span
                style={{
                  display: "flex",
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#4a5852",
                }}
              >
                Claims
              </span>
              <span
                style={{
                  display: "flex",
                  fontFamily: "Georgia, serif",
                  fontSize: 32,
                  color: "#0c1814",
                }}
              >
                {stats.total_claims}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span
                style={{
                  display: "flex",
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#4a5852",
                }}
              >
                Cited
              </span>
              <span
                style={{
                  display: "flex",
                  fontFamily: "Georgia, serif",
                  fontSize: 32,
                  color: pigment,
                }}
              >
                {pct}%
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span
                style={{
                  display: "flex",
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#4a5852",
                }}
              >
                References
              </span>
              <span
                style={{
                  display: "flex",
                  fontFamily: "Georgia, serif",
                  fontSize: 32,
                  color: "#0c1814",
                }}
              >
                {cites.length}
              </span>
            </div>
          </div>
          <span
            style={{
              display: "flex",
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#4a5852",
            }}
          >
            {SITE_HOST}/p/{p.slug}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from "next/og";
import { getPeptide, loadAllPeptides } from "@/lib/content";
import { pigmentHexFor } from "@/lib/peptide-motif";
import { SITE_HOST } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const dynamicParams = true;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

interface MotifNode {
  x: number;
  y: number;
  x2: number | null;
  y2: number | null;
  bigDot: boolean;
}

/* Build the deterministic motif coords for a slug. Inline to avoid
   a tsx component import at OG-render time (Satori prefers flat SVG). */
function buildMotif(slug: string, motifSize: number) {
  const cx = motifSize / 2;
  const cy = motifSize / 2;
  const ringR = motifSize * 0.34;
  const innerR = motifSize * 0.18;
  const h = hash(slug);
  const nodes: MotifNode[] = Array.from({ length: 12 }).map((_, i) => {
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
  return { cx, cy, ringR, innerR, h, nodes };
}

/**
 * /compare/[slugs]/opengraph-image — Atlas-aesthetic 1200×630 share
 * card for any two-peptide comparison. Two specimen motifs side-by-
 * side with a gold "+" between, three hero stats per peptide.
 */
export default async function ComparisonOGImage({
  params,
}: {
  params: Promise<{ slugs: string }>;
}) {
  const { slugs: combined } = await params;
  const parts = combined.split("-vs-");
  const peptides = parts.map((s) => getPeptide(s)).filter((p) => p !== undefined);
  if (peptides.length < 2) {
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
          PeptidesDB · Compare
        </div>
      ),
      { ...size },
    );
  }
  const a = peptides[0]!;
  const b = peptides[1]!;
  const pigA = pigmentHexFor(a.peptide_class);
  const pigB = pigmentHexFor(b.peptide_class);
  const gold = "#b8865b";

  const motifSize = 220;
  const ma = buildMotif(a.slug, motifSize);
  const mb = buildMotif(b.slug, motifSize);

  const renderMotif = (
    m: ReturnType<typeof buildMotif>,
    pigment: string,
  ) => (
    <svg
      width={motifSize}
      height={motifSize}
      viewBox={`0 0 ${motifSize} ${motifSize}`}
    >
      <circle
        cx={m.cx}
        cy={m.cy}
        r={m.ringR + 14}
        fill="none"
        stroke={pigment}
        strokeOpacity="0.25"
        strokeDasharray="4 6"
        strokeWidth="1"
      />
      <circle
        cx={m.cx}
        cy={m.cy}
        r={m.innerR}
        fill="none"
        stroke={pigment}
        strokeOpacity="0.4"
        strokeWidth="1"
      />
      {m.nodes.map((n, i) => {
        const next = m.nodes[(i + 1) % m.nodes.length];
        const opacity = ((m.h >> i) & 1) === 1 ? 0.55 : 0.22;
        return (
          <line
            key={`e-${i}`}
            x1={n.x}
            y1={n.y}
            x2={next.x}
            y2={next.y}
            stroke={pigment}
            strokeOpacity={opacity}
            strokeWidth="0.9"
          />
        );
      })}
      {m.nodes
        .filter((n) => n.x2 != null && n.y2 != null)
        .map((n, i) => (
          <line
            key={`s-${i}`}
            x1={n.x}
            y1={n.y}
            x2={n.x2!}
            y2={n.y2!}
            stroke={pigment}
            strokeOpacity="0.32"
            strokeWidth="0.7"
          />
        ))}
      {m.nodes.map((n, i) => (
        <circle
          key={`n-${i}`}
          cx={n.x}
          cy={n.y}
          r={n.bigDot ? 4.5 : 2.4}
          fill={n.bigDot ? pigment : "#f8f6f1"}
          stroke={pigment}
          strokeWidth="0.9"
        />
      ))}
      <circle cx={m.cx} cy={m.cy} r="3.2" fill={pigment} />
    </svg>
  );

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
        {/* Two-tone class swatch stripe */}
        <div style={{ display: "flex", width: "100%", height: 8 }}>
          <div
            style={{ display: "flex", flex: 1, background: pigA }}
          />
          <div
            style={{ display: "flex", flex: 1, background: pigB }}
          />
        </div>

        {/* Top folio strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 64px",
            borderBottom: "1px solid rgba(12,24,20,0.14)",
            fontFamily:
              "ui-monospace, 'JetBrains Mono', SFMono-Regular, monospace",
            fontSize: 14,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#4a5852",
          }}
        >
          <span style={{ display: "flex" }}>
            Specimen Atlas · Comparison
          </span>
          <span style={{ display: "flex" }}>
            Side-by-side parameter view
          </span>
        </div>

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            padding: "24px 64px 0 64px",
            fontFamily: "Georgia, serif",
            fontSize: 22,
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

        {/* Title row: A + B with motifs */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 64px",
            gap: 24,
          }}
        >
          {/* Left peptide */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              gap: 12,
            }}
          >
            {renderMotif(ma, pigA)}
            <div
              style={{
                display: "flex",
                fontFamily: "Georgia, serif",
                fontSize: a.name.length > 12 ? 56 : 72,
                fontWeight: 400,
                letterSpacing: "-2px",
                lineHeight: 0.95,
                color: "#0c1814",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              {a.name}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: 18,
                color: "#4a5852",
              }}
            >
              {a.peptide_class}
            </div>
          </div>

          {/* Plus sign in gold */}
          <div
            style={{
              display: "flex",
              fontFamily: "Georgia, serif",
              fontSize: 96,
              color: gold,
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            +
          </div>

          {/* Right peptide */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              gap: 12,
            }}
          >
            {renderMotif(mb, pigB)}
            <div
              style={{
                display: "flex",
                fontFamily: "Georgia, serif",
                fontSize: b.name.length > 12 ? 56 : 72,
                fontWeight: 400,
                letterSpacing: "-2px",
                lineHeight: 0.95,
                color: "#0c1814",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              {b.name}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: 18,
                color: "#4a5852",
              }}
            >
              {b.peptide_class}
            </div>
          </div>
        </div>

        {/* Footer: URL */}
        <div
          style={{
            display: "flex",
            borderTop: "2px solid #0c1814",
            padding: "20px 64px",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily:
              "ui-monospace, 'JetBrains Mono', SFMono-Regular, monospace",
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#4a5852",
          }}
        >
          <span style={{ display: "flex" }}>
            Compare · {a.slug} + {b.slug}
          </span>
          <span style={{ display: "flex" }}>
            {SITE_HOST}/compare/{combined}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Animated 0–100 evidence-strength bar. Animates in on intersection
 * (mirrors reference dashboard's IntersectionObserver pattern).
 * Width is rendered server-side; client kicks the transition once
 * it intersects the viewport for a satisfying entrance.
 */
export function EvidenceBar({
  label,
  percent,
  meta,
  color = "blue",
  dotClassName,
  className,
}: {
  label: string;
  percent: number;
  meta?: string;
  color?: "blue" | "green" | "purple" | "amber" | "teal" | "rose" | "cyan";
  dotClassName?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setAnimated(true);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const fillColor: Record<string, string> = {
    blue: "linear-gradient(90deg, var(--color-tesamorelin) 0%, color-mix(in_oklab,var(--color-tesamorelin) 70%,white) 100%)",
    green: "linear-gradient(90deg, var(--color-motsc) 0%, color-mix(in_oklab,var(--color-motsc) 70%,white) 100%)",
    purple: "linear-gradient(90deg, #a78bfa 0%, #c4b5fd 100%)",
    amber: "linear-gradient(90deg, var(--color-badge-yellow) 0%, #fde68a 100%)",
    teal: "linear-gradient(90deg, var(--color-badge-teal) 0%, #99f6e4 100%)",
    rose: "linear-gradient(90deg, var(--color-badge-red) 0%, #fecaca 100%)",
    cyan: "linear-gradient(90deg, #22d3ee 0%, #a5f3fc 100%)",
  };

  const safePercent = Math.max(0, Math.min(100, percent));

  return (
    <div ref={ref} className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
        <span
          className={cn("size-[10px] rounded-full inline-block", dotClassName)}
          style={{ background: fillColor[color]?.match(/var\([^)]+\)/)?.[0] || "currentColor" }}
        />
        {label}
      </div>
      <div className="relative h-7 rounded-[6px] bg-[var(--color-surface-offset)] overflow-hidden">
        <div
          className="ev-fill h-full rounded-[6px] flex items-center justify-end pr-2"
          style={{
            width: animated ? `${safePercent}%` : "0%",
            background: fillColor[color] ?? fillColor.blue,
          }}
        >
          <span className="font-mono text-[11px] font-semibold text-white drop-shadow-sm">
            {safePercent}%
          </span>
        </div>
      </div>
      {meta && (
        <div className="text-[12px] text-[var(--color-text-muted)]">{meta}</div>
      )}
    </div>
  );
}

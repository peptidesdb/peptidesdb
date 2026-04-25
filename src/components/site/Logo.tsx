import { cn } from "@/lib/cn";

/**
 * PeptideDB logo. 4-rect grid with dashed diagonal — matches the
 * reference dashboard's mark exactly (see reference index.html lines 18-25).
 * Two top rects are full-strength, two bottom rects are 40% opacity.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-label="PeptideDB"
      className={cn(className)}
    >
      <rect
        x="2"
        y="2"
        width="12"
        height="12"
        rx="2"
        fill="var(--color-tesamorelin)"
        opacity="0.9"
      />
      <rect
        x="18"
        y="2"
        width="12"
        height="12"
        rx="2"
        fill="var(--color-motsc)"
        opacity="0.9"
      />
      <rect
        x="2"
        y="18"
        width="12"
        height="12"
        rx="2"
        fill="var(--color-tesamorelin)"
        opacity="0.4"
      />
      <rect
        x="18"
        y="18"
        width="12"
        height="12"
        rx="2"
        fill="var(--color-motsc)"
        opacity="0.4"
      />
      <path
        d="M8 8 L24 24"
        stroke="var(--color-border-strong)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

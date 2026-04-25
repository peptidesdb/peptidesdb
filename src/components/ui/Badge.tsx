import { cn } from "@/lib/cn";

type BadgeColor = "green" | "yellow" | "red" | "teal" | "blue" | "purple" | "neutral";

const COLOR_CLASSES: Record<BadgeColor, string> = {
  green: "text-[var(--color-badge-green)] bg-[var(--color-badge-green-soft)] ring-[var(--color-badge-green-soft)]",
  yellow: "text-[var(--color-badge-yellow)] bg-[var(--color-badge-yellow-soft)] ring-[var(--color-badge-yellow-soft)]",
  red: "text-[var(--color-badge-red)] bg-[var(--color-badge-red-soft)] ring-[var(--color-badge-red-soft)]",
  teal: "text-[var(--color-badge-teal)] bg-[var(--color-badge-teal-soft)] ring-[var(--color-badge-teal-soft)]",
  blue: "text-[var(--color-tesamorelin)] bg-[var(--color-tesamorelin-soft)] ring-[var(--color-tesamorelin-soft)]",
  purple: "text-[#a78bfa] bg-[rgba(167,139,250,0.16)] ring-[rgba(167,139,250,0.16)]",
  neutral: "text-[var(--color-text-secondary)] bg-[var(--color-surface-offset)] ring-[var(--color-border)]",
};

/**
 * Severity / status badge. Used inline in tables and quick-cards.
 * Always renders with rounded-sm pill shape and a soft ring.
 */
export function Badge({
  color = "neutral",
  children,
  className,
}: {
  color?: BadgeColor;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-[3px] text-[11px] font-medium tracking-tight ring-1 ring-inset",
        COLOR_CLASSES[color],
        className
      )}
    >
      {children}
    </span>
  );
}

import { cn } from "@/lib/cn";

/**
 * "01 — Mechanism of Action" heading pattern from the reference.
 * The numeric marker is rendered in mono and de-emphasised.
 */
export function SectionHeading({
  number,
  title,
  children,
  className,
}: {
  number: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4 mb-6", className)}>
      <h2 className="flex items-baseline gap-3 text-[24px] sm:text-[28px] font-semibold tracking-tight text-[var(--color-text)]">
        <span className="font-mono text-[14px] text-[var(--color-text-muted)] tabular-nums">
          {number}
        </span>
        <span>{title}</span>
      </h2>
      {children}
    </div>
  );
}

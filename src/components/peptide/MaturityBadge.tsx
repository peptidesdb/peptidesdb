import { cn } from "@/lib/cn";
import { CheckCircle2, Circle, ShieldCheck } from "lucide-react";

/**
 * Maturity-tier badge: Verified | Reviewed | Draft. Communicates citation
 * density / editorial confidence at a glance.
 */
export function MaturityBadge({
  maturity,
  className,
}: {
  maturity: "draft" | "reviewed" | "verified";
  className?: string;
}) {
  const Icon =
    maturity === "verified" ? ShieldCheck : maturity === "reviewed" ? CheckCircle2 : Circle;
  const label =
    maturity === "verified"
      ? "Verified"
      : maturity === "reviewed"
        ? "Reviewed"
        : "Draft";
  const tone =
    maturity === "verified"
      ? "text-[var(--color-motsc)] bg-[var(--color-motsc-soft)] ring-[color:color-mix(in_oklab,var(--color-motsc)_30%,transparent)]"
      : maturity === "reviewed"
        ? "text-[var(--color-badge-teal)] bg-[var(--color-badge-teal-soft)] ring-[color:color-mix(in_oklab,var(--color-badge-teal)_30%,transparent)]"
        : "text-[var(--color-badge-yellow)] bg-[var(--color-badge-yellow-soft)] ring-[color:color-mix(in_oklab,var(--color-badge-yellow)_30%,transparent)]";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider ring-1 ring-inset",
        tone,
        className
      )}
    >
      <Icon size={12} strokeWidth={2.5} />
      {label}
    </span>
  );
}

import { cn } from "@/lib/cn";
import { citationLabel, citationUrl } from "@/lib/citations";
import { CITATIONS } from "@/generated/citations";

/**
 * Inline citation. Renders "(Falutz 2007)" linked out to PubMed/DOI/NCT.
 * Multiple refs render as a single chip with all labels separated by `·`.
 *
 * Citation data is imported from a build-generated TS module so the chip
 * can render in both server and client components without pulling node:fs
 * into the client bundle.
 */
export function CitationChip({
  refs,
  className,
}: {
  refs: string[];
  className?: string;
}) {
  if (!refs || refs.length === 0) return null;
  const cites = refs.map((id) => CITATIONS[id]).filter(Boolean);
  if (cites.length === 0) return null;

  // For a single ref, link the chip directly. For multiple, stack them.
  if (cites.length === 1) {
    const c = cites[0];
    return (
      <a
        href={citationUrl(c)}
        target="_blank"
        rel="noopener noreferrer"
        title={c.title}
        className={cn(
          "inline-flex items-center gap-1 ml-1.5 px-1.5 py-px text-[10px] font-mono",
          "rounded-sm text-[var(--color-text-muted)]",
          "ring-1 ring-inset ring-[var(--color-border)]",
          "hover:text-[var(--color-accent)] hover:ring-[var(--color-accent)] transition-colors",
          className
        )}
      >
        {citationLabel(c)}
      </a>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1 ml-1.5", className)}>
      {cites.map((c, i) => (
        <a
          key={c.id}
          href={citationUrl(c)}
          target="_blank"
          rel="noopener noreferrer"
          title={c.title}
          className={cn(
            "inline-flex items-center px-1.5 py-px text-[10px] font-mono",
            "rounded-sm text-[var(--color-text-muted)]",
            "ring-1 ring-inset ring-[var(--color-border)]",
            "hover:text-[var(--color-accent)] hover:ring-[var(--color-accent)] transition-colors"
          )}
        >
          {citationLabel(c)}
          {i < cites.length - 1 && null}
        </a>
      ))}
    </span>
  );
}

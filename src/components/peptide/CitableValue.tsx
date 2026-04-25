import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { CitationChip } from "./CitationChip";
import type { CitableValue } from "@/lib/schemas/peptide";

/**
 * Render a CitableValue (string OR { value, cite, badge, note }).
 * Inline citation chip after the value text. Optional badge color.
 */
export function CitableValueView({
  value,
  className,
  inline = false,
}: {
  value: CitableValue;
  className?: string;
  inline?: boolean;
}) {
  if (typeof value === "string") {
    return <span className={cn(className)}>{value}</span>;
  }
  const { value: text, cite, badge, note } = value;
  const Wrap = inline ? "span" : "div";
  return (
    <Wrap className={cn(inline && "inline-flex items-baseline flex-wrap gap-1", className)}>
      {badge ? (
        <Badge color={badge}>{text}</Badge>
      ) : (
        <span className="text-[var(--color-text)]">{text}</span>
      )}
      {cite && cite.length > 0 && <CitationChip refs={cite} />}
      {note && (
        <span className="ml-2 text-[12px] text-[var(--color-text-muted)] italic">
          {note}
        </span>
      )}
    </Wrap>
  );
}

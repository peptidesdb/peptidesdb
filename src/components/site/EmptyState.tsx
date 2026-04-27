import Link from "next/link";

interface EmptyStateProps {
  message: string;
  action?: {
    label: string;
    href: string;
  };
  /** Optional additional small descriptive paragraph below the message. */
  detail?: string;
}

/**
 * Editorial colophon-style empty state (D2 / DESIGN.md § 11).
 *
 * Renders a hairline rule, a centered italic Instrument Serif message,
 * an optional plain-prose detail paragraph, and an optional mono-caps
 * action link with hover-gold treatment. role="status" + aria-live
 * "polite" so screen readers announce the state on first paint.
 *
 * Anti-card by design — no border-radius, no shadow, no surface fill;
 * only a single hairline above the message anchors the composition.
 */
export function EmptyState({ message, action, detail }: EmptyStateProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      className="border-t border-at-rule py-16 px-6 text-center"
    >
      <p className="at-display-italic text-[28px] sm:text-[32px] text-at-ink leading-[1.2] max-w-xl mx-auto">
        {message}
      </p>
      {detail && (
        <p className="mt-4 text-[14px] text-at-ink-soft max-w-md mx-auto leading-relaxed">
          {detail}
        </p>
      )}
      {action && (
        <Link
          href={action.href}
          className="at-folio inline-block mt-8 text-at-ink hover:text-at-gold transition-colors"
        >
          {action.label} →
        </Link>
      )}
    </section>
  );
}

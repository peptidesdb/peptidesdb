import { afterEach, describe, expect, mock, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";

// next/link uses internal Next runtime hooks that aren't available in
// happy-dom. Mock to a plain anchor — same href surface, simpler render.
mock.module("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  } & Record<string, unknown>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const { EmptyState } = await import("@/components/site/EmptyState");

/* =========================================================
   EmptyState component tests (Phase 4 / D2).

   Coverage:
     - Message renders
     - Detail renders only when provided
     - Action link renders only when provided
     - aria-live wired for screen-reader announcement
     - axe-core: zero a11y violations with and without action
   ========================================================= */

afterEach(() => {
  cleanup();
});

describe("EmptyState", () => {
  test("renders the message", () => {
    render(<EmptyState message="The atlas waits." />);
    expect(screen.getByText("The atlas waits.")).toBeInTheDocument();
  });

  test("omits the action link when no action prop is provided", () => {
    render(<EmptyState message="Nothing to see." />);
    expect(screen.queryByRole("link")).toBeNull();
  });

  test("renders the action link with correct label and href", () => {
    render(
      <EmptyState
        message="The atlas waits."
        action={{ label: "Browse plates", href: "/catalog" }}
      />,
    );
    const link = screen.getByRole("link", { name: /Browse plates/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/catalog");
    // Editorial arrow is part of the visible label.
    expect(link.textContent).toContain("→");
  });

  test("omits the detail paragraph when no detail prop is provided", () => {
    const { container } = render(<EmptyState message="Just a message." />);
    // Only one <p> — the message itself.
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });

  test("renders the detail paragraph when provided", () => {
    render(
      <EmptyState
        message="The atlas waits."
        detail="Add peptides from the catalogue to design a stack."
      />,
    );
    expect(
      screen.getByText("Add peptides from the catalogue to design a stack."),
    ).toBeInTheDocument();
  });

  test("wires role=status + aria-live=polite for screen-reader announcement", () => {
    const { container } = render(
      <EmptyState message="The atlas waits." />,
    );
    const region = container.querySelector('[role="status"]');
    expect(region).not.toBeNull();
    expect(region).toHaveAttribute("aria-live", "polite");
  });

  test("axe-core: no a11y violations without an action", async () => {
    const { container } = render(
      <EmptyState
        message="The atlas waits."
        detail="Add peptides from the catalogue to design a stack."
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  test("axe-core: no a11y violations with an action", async () => {
    const { container } = render(
      <EmptyState
        message="The atlas waits."
        detail="Add peptides from the catalogue to design a stack."
        action={{ label: "Browse plates", href: "/catalog" }}
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});

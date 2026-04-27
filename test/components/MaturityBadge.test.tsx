import { describe, expect, test } from "bun:test";
import { render, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { MaturityBadge } from "@/components/peptide/MaturityBadge";

/*
 * MaturityBadge atlas-rewrite (Phase 5).
 *
 * The old badge used a rounded pill, lucide icon, ring outline, and colored
 * fill — all DESIGN.md § 4 violations. The new component is typography-only:
 * a leading mark (· / ·· / ··· / ★) and an at-folio label. These tests lock
 * the new contract in place so future refactors don't quietly regress.
 *
 * Bun's test runner does not auto-clean RTL renders between tests, so each
 * test scopes queries via `within(container)`.
 */

describe("MaturityBadge — atlas spec", () => {
  test("auto-drafted: single dot mark + AUTO-DRAFTED label", () => {
    const { container } = render(<MaturityBadge maturity="auto-drafted" />);
    const w = within(container);
    expect(w.getByText("AUTO-DRAFTED")).toBeInTheDocument();
    expect(w.getByText("·")).toBeInTheDocument();
  });

  test("human-reviewed: two-dot mark + HUMAN-REVIEWED label", () => {
    const { container } = render(<MaturityBadge maturity="human-reviewed" />);
    const w = within(container);
    expect(w.getByText("HUMAN-REVIEWED")).toBeInTheDocument();
    expect(w.getByText("··")).toBeInTheDocument();
  });

  test("community-edited: three-dot mark + COMMUNITY-EDITED label", () => {
    const { container } = render(<MaturityBadge maturity="community-edited" />);
    const w = within(container);
    expect(w.getByText("COMMUNITY-EDITED")).toBeInTheDocument();
    expect(w.getByText("···")).toBeInTheDocument();
  });

  test("flagship: star mark + Flagship label (italic, not all-caps)", () => {
    const { container } = render(<MaturityBadge maturity="flagship" />);
    const w = within(container);
    expect(w.getByText("Flagship")).toBeInTheDocument();
    expect(w.getByText("★")).toBeInTheDocument();
  });

  test("aria-label describes maturity for assistive tech (covers the mark + label)", () => {
    const { container } = render(<MaturityBadge maturity="human-reviewed" />);
    const labelled = within(container).getByLabelText(/editorial maturity: human-reviewed/i);
    expect(labelled).toBeInTheDocument();
  });

  test("flagship applies serif + italic emphasis", () => {
    const { container } = render(<MaturityBadge maturity="flagship" />);
    const root = within(container).getByLabelText(/editorial maturity: flagship/i);
    expect(root.className).toContain("font-serif");
    expect(root.className).toContain("italic");
  });

  test("non-flagship does NOT apply serif + italic emphasis", () => {
    const { container } = render(<MaturityBadge maturity="auto-drafted" />);
    const root = within(container).getByLabelText(/editorial maturity: auto-drafted/i);
    expect(root.className).not.toContain("font-serif");
    expect(root.className).not.toContain("italic");
  });

  test("uses at-folio class (mono caps folio) for tiers 1-3", () => {
    const { container } = render(<MaturityBadge maturity="community-edited" />);
    const root = within(container).getByLabelText(/editorial maturity: community-edited/i);
    expect(root.className).toContain("at-folio");
  });

  test("renders no pill / fill / ring (DESIGN.md § 4 compliance)", () => {
    const { container } = render(<MaturityBadge maturity="human-reviewed" />);
    const root = within(container).getByLabelText(/editorial maturity/i);
    expect(root.className).not.toContain("rounded-full");
    expect(root.className).not.toContain("ring-1");
    expect(root.className).not.toContain("bg-");
  });

  test("renders no icon (no SVG inside the badge)", () => {
    const { container } = render(<MaturityBadge maturity="flagship" />);
    expect(container.querySelector("svg")).toBeNull();
  });

  test("forwards className to the root span", () => {
    const { container } = render(
      <MaturityBadge maturity="auto-drafted" className="ml-4" />,
    );
    const root = within(container).getByLabelText(/editorial maturity/i);
    expect(root.className).toContain("ml-4");
  });

  test("has no axe-detectable a11y violations across all 4 tiers", async () => {
    const { container } = render(
      <div>
        <MaturityBadge maturity="auto-drafted" />
        <MaturityBadge maturity="human-reviewed" />
        <MaturityBadge maturity="community-edited" />
        <MaturityBadge maturity="flagship" />
      </div>,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});

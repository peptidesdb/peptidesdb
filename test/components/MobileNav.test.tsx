import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";

// Mock usePathname so we can simulate route changes (which is how
// MobileNav auto-closes the panel after navigation in production).
let mockPathname = "/";
mock.module("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

// Imported AFTER the mock so the component picks it up.
const { MobileNav } = await import("@/components/site/MobileNav");

/* =========================================================
   MobileNav component tests.

   Phase 0.2 added this client component to fix a P1 shipped
   bug (mobile users couldn't navigate Atlas). These tests
   prevent regression on:
     - Toggle open / close
     - Esc closes the panel
     - Link click auto-closes
     - Resize ≥640px auto-closes
     - aria-* attributes are correct
     - axe-core a11y
   ========================================================= */

const links = [
  { href: "/catalog", label: "Catalogue" },
  { href: "/compare", label: "Compare" },
] as const;

const externalLinks = [
  { href: "https://github.com/peptidesdb/peptidesdb", label: "GitHub ↗" },
] as const;

beforeEach(() => {
  mockPathname = "/";
});

afterEach(() => {
  cleanup();
});

describe("MobileNav", () => {
  test("renders the Menu toggle with caret-down when closed", () => {
    render(<MobileNav links={links} externalLinks={externalLinks} />);
    const toggle = screen.getByRole("button", { name: /Menu/ });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle.textContent).toContain("▾");
  });

  test("clicking toggle reveals the nav panel + flips aria-expanded", () => {
    render(<MobileNav links={links} externalLinks={externalLinks} />);
    const toggle = screen.getByRole("button", { name: /Menu/ });

    expect(screen.queryByRole("navigation")).toBeNull();

    fireEvent.click(toggle);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle.textContent).toContain("▴");
    expect(screen.getByText("Catalogue")).toBeInTheDocument();
    expect(screen.getByText("Compare")).toBeInTheDocument();
    expect(screen.getByText("GitHub ↗")).toBeInTheDocument();
  });

  test("clicking toggle a second time closes the panel", () => {
    render(<MobileNav links={links} externalLinks={externalLinks} />);
    const toggle = screen.getByRole("button", { name: /Menu/ });

    fireEvent.click(toggle);
    expect(screen.getByRole("navigation")).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.queryByRole("navigation")).toBeNull();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("Esc closes the panel", () => {
    render(<MobileNav links={links} externalLinks={externalLinks} />);
    const toggle = screen.getByRole("button", { name: /Menu/ });

    fireEvent.click(toggle);
    expect(screen.getByRole("navigation")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("navigation")).toBeNull();
  });

  test("pathname change auto-closes the panel (post-navigation cleanup)", () => {
    mockPathname = "/";
    const { rerender } = render(
      <MobileNav links={links} externalLinks={externalLinks} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Menu/ }));
    expect(screen.getByRole("navigation")).toBeInTheDocument();

    // Simulate Next router pushing a new pathname (e.g. user clicked
    // Catalogue and lands on /catalog). The MobileNav useEffect on
    // pathname should auto-close the panel.
    mockPathname = "/catalog";
    rerender(<MobileNav links={links} externalLinks={externalLinks} />);

    expect(screen.queryByRole("navigation")).toBeNull();
  });

  test("resize ≥640px auto-closes the panel", () => {
    render(<MobileNav links={links} externalLinks={externalLinks} />);
    fireEvent.click(screen.getByRole("button", { name: /Menu/ }));

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 800,
    });
    fireEvent(window, new Event("resize"));

    expect(screen.queryByRole("navigation")).toBeNull();
  });

  test("aria-controls / aria-expanded wired correctly", () => {
    render(<MobileNav links={links} externalLinks={externalLinks} />);
    const toggle = screen.getByRole("button", { name: /Menu/ });
    expect(toggle).toHaveAttribute("aria-controls", "mobile-nav-panel");

    fireEvent.click(toggle);
    const panel = screen.getByRole("navigation");
    expect(panel).toHaveAttribute("id", "mobile-nav-panel");
  });

  test("external links open in a new tab with rel=noopener noreferrer", () => {
    render(<MobileNav links={links} externalLinks={externalLinks} />);
    fireEvent.click(screen.getByRole("button", { name: /Menu/ }));

    const githubLink = screen.getByRole("link", { name: /GitHub/ });
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("axe-core: closed state has no a11y violations", async () => {
    const { container } = render(
      <MobileNav links={links} externalLinks={externalLinks} />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  test("axe-core: open state has no a11y violations", async () => {
    const { container } = render(
      <MobileNav links={links} externalLinks={externalLinks} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Menu/ }));

    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});

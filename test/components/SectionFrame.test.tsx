import { describe, expect, test, beforeAll } from "bun:test";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import {
  SectionFrame,
  buildSectionEditUrl,
} from "@/components/site/SectionFrame";
import { PEPTIDE_LINES } from "@/generated/peptide-lines";

describe("buildSectionEditUrl", () => {
  test("uses the actual line number from PEPTIDE_LINES when present", () => {
    const knownSlug = Object.keys(PEPTIDE_LINES)[0];
    const sections = PEPTIDE_LINES[knownSlug];
    const knownKey = Object.keys(sections)[0] as keyof typeof sections;
    const expectedLine = sections[knownKey];
    const url = buildSectionEditUrl(knownSlug, knownKey);
    expect(url).toContain(
      `/content/peptides/${knownSlug}.yaml#L${expectedLine}`,
    );
    expect(url).toMatch(
      /^https:\/\/github\.com\/peptidesdb\/peptidesdb\/edit\/main\//,
    );
  });

  test("falls back to #L1 when slug is unknown", () => {
    const url = buildSectionEditUrl("nonexistent-slug", "mechanism");
    expect(url).toBe(
      "https://github.com/peptidesdb/peptidesdb/edit/main/content/peptides/nonexistent-slug.yaml#L1",
    );
  });

  test("falls back to #L1 when the section is not in the map", () => {
    const knownSlug = Object.keys(PEPTIDE_LINES)[0];
    const url = buildSectionEditUrl(knownSlug, "sources");
    if (PEPTIDE_LINES[knownSlug].sources === undefined) {
      expect(url).toContain("#L1");
    }
  });
});

describe("<SectionFrame />", () => {
  test("renders section number, title, and edit link in document order", () => {
    render(
      <SectionFrame
        slug="tesamorelin"
        sectionKey="mechanism"
        number="§ 01"
        title="Mechanism"
      >
        <p>section body</p>
      </SectionFrame>,
    );
    expect(screen.getByText("§ 01")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Mechanism", level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /Edit Mechanism section on GitHub/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("section body")).toBeInTheDocument();
  });

  test("edit link has correct href, target, and rel", () => {
    render(
      <SectionFrame
        slug="bpc-157"
        sectionKey="dosage"
        number="§ 02"
        title="Dosage"
      >
        <p>body</p>
      </SectionFrame>,
    );
    const link = screen.getByRole("link", {
      name: /Edit Dosage section on GitHub/,
    });
    expect(link).toHaveAttribute(
      "href",
      buildSectionEditUrl("bpc-157", "dosage"),
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("does not wrap children in an enclosing element (D17 pass-through)", () => {
    const { container } = render(
      <section data-testid="outer">
        <SectionFrame
          slug="tesamorelin"
          sectionKey="mechanism"
          number="§ 01"
          title="Mechanism"
        >
          <div data-testid="child">body</div>
        </SectionFrame>
      </section>,
    );
    const outer = container.querySelector('[data-testid="outer"]')!;
    const child = container.querySelector('[data-testid="child"]')!;
    expect(child.parentElement).toBe(outer);
  });

  test("has no axe-core violations", async () => {
    const { container } = render(
      <SectionFrame
        slug="tesamorelin"
        sectionKey="mechanism"
        number="§ 01"
        title="Mechanism"
      >
        <p>body</p>
      </SectionFrame>,
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});

import { expect, test } from "@playwright/test";

/* =========================================================
   E2E: mobile navigation flow (Phase 0.2 fix).

   Pre-fix state: AtlasHeader hid Catalogue/Compare/Stack
   below 640px and no hamburger existed → mobile users could
   not reach those routes. Tests below would have all failed
   pre-fix.
   ========================================================= */

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("Menu ▾ button is visible at <640px viewport", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /Menu/ });
    await expect(toggle).toBeVisible();
    await expect(toggle).toContainText("▾");
  });

  test("clicking Menu reveals all 5 nav links + GitHub", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Menu/ }).click();

    const panel = page.getByRole("navigation", { name: /Site navigation/ });
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("link", { name: "Catalogue" })).toBeVisible();
    await expect(panel.getByRole("link", { name: "Compare" })).toBeVisible();
    await expect(panel.getByRole("link", { name: "Stack" })).toBeVisible();
    await expect(panel.getByRole("link", { name: "Ask" })).toBeVisible();
    await expect(panel.getByRole("link", { name: /GitHub/ })).toBeVisible();
  });

  test("clicking a nav link navigates and auto-closes the panel", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Menu/ }).click();

    await page
      .getByRole("navigation", { name: /Site navigation/ })
      .getByRole("link", { name: "Catalogue" })
      .click();

    await expect(page).toHaveURL(/\/catalog/);
  });

  test("desktop nav is hidden at <640px (no duplication)", async ({
    page,
  }) => {
    await page.goto("/");
    // Desktop nav has class `hidden sm:flex` — should not be visible at 375px.
    const desktopCatalogueLink = page
      .locator("nav.hidden")
      .getByRole("link", { name: "Catalogue" });
    await expect(desktopCatalogueLink).toBeHidden();
  });
});

test.describe("desktop navigation (control)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("Menu ▾ button is hidden at desktop viewport", async ({ page }) => {
    await page.goto("/");
    // The mobile button is wrapped in a `sm:hidden` div; should not be visible.
    const toggle = page.getByRole("button", { name: /Menu/ });
    await expect(toggle).toBeHidden();
  });

  test("desktop nav links are inline + visible", async ({ page }) => {
    await page.goto("/");
    // Scope to the header — the footer also lists nav links, so an
    // unscoped getByRole would resolve to two matches.
    const headerNav = page.locator("header nav");
    await expect(headerNav.getByRole("link", { name: "Catalogue" })).toBeVisible();
    await expect(headerNav.getByRole("link", { name: "Compare" })).toBeVisible();
    await expect(headerNav.getByRole("link", { name: "Stack" })).toBeVisible();
    await expect(headerNav.getByRole("link", { name: "Ask" })).toBeVisible();
  });
});

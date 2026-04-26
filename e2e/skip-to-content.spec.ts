import { expect, test } from "@playwright/test";

/* =========================================================
   E2E: keyboard skip-to-content link.

   Phase 0.2 added this as the first focusable element in
   AtlasHeader so keyboard-only users can bypass the nav.
   Visible only on focus (sr-only by default).
   ========================================================= */

test.describe("skip-to-content link", () => {
  test("first Tab focuses the skip link", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", { name: "Skip to content" });
    await expect(skipLink).toBeFocused();
  });

  test("activating the skip link navigates to #main", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/#main$/);
    // The <main id="main"> element should now be the scroll target.
    const main = page.locator("#main");
    await expect(main).toBeVisible();
  });

  test("skip link is sr-only when not focused", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.getByRole("link", { name: "Skip to content" });
    // sr-only utility makes it visually hidden but in the DOM.
    const className = await skipLink.getAttribute("class");
    expect(className).toContain("sr-only");
  });
});

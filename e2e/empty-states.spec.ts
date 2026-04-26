import { expect, test } from "@playwright/test";

/* =========================================================
   E2E: editorial colophon empty states (Phase 4 / D2).

   Each test visits the URL that triggers the empty state and
   asserts the bespoke italic message + (when applicable) the
   action link is visible and routes correctly.

   Surfaces covered:
     - /compare           empty picker (no peptides selected)
     - /compare/<bogus>   invalid slug -> not-found
     - /stack             empty stack (no peptides added)
     - /ask               pre-question placeholder
     - /p/<bogus>         peptide not in atlas -> not-found
   ========================================================= */

test.describe("empty states", () => {
  test("/compare renders the picker empty state", async ({ page }) => {
    await page.goto("/compare");

    const region = page.getByRole("status").filter({
      hasText: "Choose two peptides to compare.",
    });
    await expect(region).toBeVisible();

    const action = region.getByRole("link", {
      name: /Browse the catalogue/,
    });
    await expect(action).toBeVisible();

    await action.click();
    await expect(page).toHaveURL(/\/catalog$/);
  });

  test("/stack renders the empty-stack state", async ({ page }) => {
    await page.goto("/stack");

    const region = page.getByRole("status").filter({
      hasText: "The atlas waits.",
    });
    await expect(region).toBeVisible();

    await expect(
      region.getByText(
        "Add peptides from the catalogue to design a stack.",
      ),
    ).toBeVisible();

    const action = region.getByRole("link", { name: /Browse plates/ });
    await expect(action).toBeVisible();

    await action.click();
    await expect(page).toHaveURL(/\/catalog$/);
  });

  test("/ask renders the pre-question placeholder", async ({ page }) => {
    await page.goto("/ask");

    const region = page.getByRole("status").filter({
      hasText: "Ask anything about a peptide.",
    });
    await expect(region).toBeVisible();
    await expect(
      region.getByText(
        "PeptidesDB grounds answers in the open citation registry.",
      ),
    ).toBeVisible();
  });

  test("/p/<bogus> renders the plate-not-found state", async ({ page }) => {
    const response = await page.goto("/p/foo-doesnt-exist");
    expect(response?.status()).toBe(404);

    const region = page.getByRole("status").filter({
      hasText: "This plate isn't in the atlas.",
    });
    await expect(region).toBeVisible();

    const action = region.getByRole("link", { name: /Return to catalogue/ });
    await expect(action).toBeVisible();
    await action.click();
    await expect(page).toHaveURL(/\/catalog$/);
  });

  test("/compare/<bogus> renders the comparison-not-found state", async ({
    page,
  }) => {
    // Self-compare is rejected by parseSlugs() in the comparison page,
    // so it triggers notFound() and lands on the per-route not-found.tsx.
    const response = await page.goto("/compare/bogus-vs-bogus");
    expect(response?.status()).toBe(404);

    const region = page.getByRole("status").filter({
      hasText: "This comparison isn't in the atlas.",
    });
    await expect(region).toBeVisible();

    const action = region.getByRole("link", { name: /Return to catalogue/ });
    await expect(action).toBeVisible();
    await action.click();
    await expect(page).toHaveURL(/\/catalog$/);
  });
});

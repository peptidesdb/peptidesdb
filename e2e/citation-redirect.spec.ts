import { expect, test } from "@playwright/test";

/* =========================================================
   E2E: /refs/[id] route redirects to the source paper.

   This is the production-mode counterpart to the unit test
   in test/api/refs.test.ts. Catches deployment-only failures
   (build broke generateStaticParams, route handler not
   serialized correctly, etc.).
   ========================================================= */

test.describe("citation redirects", () => {
  // Use request API (no redirect follow) so we test the redirect emitted
  // by our route handler — not the final page render at the destination,
  // which can serve content types (PDF) that trip Chromium's download
  // handler and fail the test for the wrong reason.

  test("/refs/falutz-2007 → 302 → PubMed", async ({ request }) => {
    const response = await request.get("/refs/falutz-2007", {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(302);
    expect(response.headers()["location"]).toBe(
      "https://pubmed.ncbi.nlm.nih.gov/18057338/",
    );
  });

  test("/refs/fda-egrifta-label-2010 → 302 → FDA accessdata", async ({
    request,
  }) => {
    const response = await request.get("/refs/fda-egrifta-label-2010", {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(302);
    expect(response.headers()["location"]).toMatch(/accessdata\.fda\.gov/);
  });

  test("/refs/unknown-id returns 404", async ({ request }) => {
    const response = await request.get("/refs/definitely-not-a-real-id", {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(404);
  });
});

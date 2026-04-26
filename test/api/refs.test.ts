import { describe, expect, test } from "bun:test";
import { GET } from "@/app/refs/[id]/route";
import { CITATIONS } from "@/generated/citations";
import type { NextRequest } from "next/server";

/* =========================================================
   /refs/[id] route handler tests.

   Phase 0.1 added this handler to close the P0 trust failure
   where citation chips on /ask linked to a 404 route. Tests
   verify the redirect chain works for each citation type and
   that unknown IDs 404 cleanly (no silent passthrough).
   ========================================================= */

const fakeReq = {} as NextRequest;

async function callGET(id: string) {
  return GET(fakeReq, { params: Promise.resolve({ id }) });
}

describe("/refs/[id] route handler", () => {
  test("known citation with PMID redirects to PubMed", async () => {
    const res = await callGET("falutz-2007");
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(
      "https://pubmed.ncbi.nlm.nih.gov/18057338/",
    );
  });

  test("known citation with explicit url redirects there", async () => {
    const res = await callGET("fda-egrifta-label-2010");
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(
      "https://www.accessdata.fda.gov/drugsatfda_docs/label/2010/022505lbl.pdf",
    );
  });

  test("unknown citation returns 404", async () => {
    const res = await callGET("definitely-not-a-real-citation-id");
    expect(res.status).toBe(404);
    const body = await res.text();
    expect(body).toContain("not in registry");
  });

  test("every citation in the registry resolves cleanly", async () => {
    // Belt-and-suspenders: walk the entire CITATIONS registry and
    // assert each one redirects (no 404). Catches the case where a
    // future citation lacks all of pmid/doi/nct/url AND the loop-
    // guard fallback to GitHub view of refs.yaml didn't fire.
    const ids = Object.keys(CITATIONS);
    expect(ids.length).toBeGreaterThan(0);

    for (const id of ids) {
      const res = await callGET(id);
      expect(res.status).toBe(302);
      const location = res.headers.get("location");
      expect(location).toBeTruthy();
      expect(location?.startsWith("/refs/")).toBe(false); // no infinite loop
    }
  });
});

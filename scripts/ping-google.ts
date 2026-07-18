#!/usr/bin/env bun
/**
 * Notify the Google Indexing API of PeptidesDB URLs (URL_UPDATED).
 *
 * PREREQUISITE (one-time, Alex): verify peptidesdb.org in Google Search
 * Console, create a service account, add its client_email as an OWNER of the
 * GSC property, enable the Indexing API, and point GOOGLE_INDEXING_CREDS at the
 * service-account JSON. Without creds this script no-ops (Google discovery then
 * relies on GSC verification + the sitemap, which is the primary path anyway).
 *
 * Note: the Indexing API officially targets JobPosting/BroadcastEvent; general-
 * URL notification is best-effort (used across this org for URL pings). It is a
 * hint, not a guarantee — GSC verification + sitemap remain load-bearing.
 *
 * Usage:  GOOGLE_INDEXING_CREDS=/path/sa.json bun run scripts/ping-google.ts
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createSign } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOST = "peptidesdb.org";
const PEPTIDES_DIR = join(__dirname, "..", "content", "peptides");
// Keep in sync with HUB_CATEGORIES in src/lib/categories.ts (that module is
// server-only, so it can't be imported into this standalone bun script).
const HUB_SLUGS = [
  "glp-1", "gh-axis", "weight-management", "lipolytic", "wound-healing",
  "neuroprotective", "anti-aging", "bioregulator", "cognitive",
];
const CORE = ["/", "/catalog", "/compare", "/calculator", "/verify"];

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function credsPath(): string | null {
  const p =
    process.env.GOOGLE_INDEXING_CREDS ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS;
  return p && existsSync(p) ? p : null;
}

async function accessToken(creds: {
  client_email: string;
  private_key: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({
      iss: creds.client_email,
      scope: "https://www.googleapis.com/auth/indexing",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const jwt = `${header}.${claims}.${b64url(signer.sign(creds.private_key))}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    throw new Error(`token ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  return ((await res.json()) as { access_token: string }).access_token;
}

async function main(): Promise<void> {
  const path = credsPath();
  if (!path) {
    console.log(
      "[ping-google] no service-account creds (set GOOGLE_INDEXING_CREDS). Skipping — Google discovery relies on GSC verification + sitemap. Not an error.",
    );
    return;
  }
  const creds = JSON.parse(readFileSync(path, "utf-8"));
  const slugs = readdirSync(PEPTIDES_DIR)
    .filter((f) => f.endsWith(".yaml") && !f.startsWith("_"))
    .map((f) => f.replace(/\.yaml$/, ""))
    .sort();
  const urls = [
    ...CORE.map((r) => `https://${HOST}${r}`),
    ...HUB_SLUGS.map((s) => `https://${HOST}/catalog/${s}`),
    ...slugs.map((s) => `https://${HOST}/p/${s}`),
  ];

  console.log(`[ping-google] notifying Indexing API of ${urls.length} URLs`);
  const token = await accessToken(creds);
  let ok = 0;
  let fail = 0;
  for (const url of urls) {
    const res = await fetch(
      "https://indexing.googleapis.com/v3/urlNotifications:publish",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, type: "URL_UPDATED" }),
      },
    );
    if (res.ok) {
      ok++;
    } else {
      fail++;
      if (fail <= 3) {
        console.error(
          `[ping-google] ${res.status} ${url}: ${(await res.text()).slice(0, 160)}`,
        );
      }
    }
    await new Promise((r) => setTimeout(r, 120));
  }
  console.log(`[ping-google] done — ${ok} ok, ${fail} failed`);
}

main().catch((e) => {
  // Best-effort: never fail the deploy chain on an indexing ping.
  console.error("[ping-google] error:", e);
  process.exit(0);
});

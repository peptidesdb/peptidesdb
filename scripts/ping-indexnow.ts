#!/usr/bin/env bun
/**
 * Push all plate URLs to IndexNow (Bing/Yandex/Yep/Seznam/Naver).
 *
 * Re-run this after adding new plates so search engines pick them up
 * within hours instead of waiting for the next organic crawl. Google
 * doesn't accept IndexNow yet — for Google, see scripts/ping-google.ts
 * (manual GSC submission helper).
 *
 * Usage
 * -----
 *   bun run scripts/ping-indexnow.ts
 *
 * Configuration
 * -------------
 * The key file public/<key>.txt was provisioned 2026-04-27. To rotate:
 *   1. Generate a new key: openssl rand -hex 16
 *   2. Add public/<new-key>.txt containing the new key
 *   3. Update INDEXNOW_KEY below
 *   4. Delete the old key file (optional — IndexNow doesn't reject
 *      old keys mid-flight, just stops new submissions)
 */

import { readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PEPTIDES_DIR = join(__dirname, "..", "content", "peptides");
const HOST = "peptidesdb.org";
const INDEXNOW_KEY = "31fae8dda1f965bbacb1b312eb84db80";

function listPlateSlugs(): string[] {
  return readdirSync(PEPTIDES_DIR)
    .filter((f) => f.endsWith(".yaml") && !f.startsWith("_"))
    .map((f) => f.replace(/\.yaml$/, ""))
    .sort();
}

async function main(): Promise<void> {
  const slugs = listPlateSlugs();
  const urlList = [
    `https://${HOST}/`,
    ...slugs.map((s) => `https://${HOST}/p/${s}`),
    `https://${HOST}/sitemap.xml`,
  ];

  console.log(`[indexnow] pinging ${urlList.length} URLs (${slugs.length} plates + home + sitemap)`);

  const res = await fetch("https://www.bing.com/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });

  console.log(`[indexnow] HTTP ${res.status}`);
  if (res.status >= 200 && res.status < 300) {
    console.log(`[indexnow] OK — Bing forwards to Yandex / Yep / Seznam / Naver`);
  } else {
    const body = await res.text();
    console.error(`[indexnow] FAIL: ${body.slice(0, 500)}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("[indexnow] error:", e);
  process.exit(1);
});

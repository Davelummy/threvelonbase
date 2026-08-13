import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("next config declares proportionate document security headers", async () => {
  const source = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");
  assert.match(source, /poweredByHeader:\s*false/);
  assert.match(source, /X-Content-Type-Options/);
  assert.match(source, /strict-origin-when-cross-origin/);
  assert.match(source, /Permissions-Policy/);
  assert.match(source, /Content-Security-Policy", value: "frame-ancestors 'none'"/);
  assert.doesNotMatch(source, /value: "[^"]*script-src/);
  assert.doesNotMatch(source, /key: "Strict-Transport-Security"/);
  assert.doesNotMatch(source, /max-age=31536000/);
});

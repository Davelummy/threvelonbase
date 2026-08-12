import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test, { before } from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const homepageHtmlPath = path.join(root, ".next", "server", "app", "index.html");
const privacyHtmlPath = path.join(root, ".next", "server", "app", "privacy.html");

let homepageHtml;
let privacyHtml;

before(async () => {
  homepageHtml = await readFile(homepageHtmlPath, "utf8");
  privacyHtml = await readFile(privacyHtmlPath, "utf8");
});

test("keeps FAQ on the homepage instead of a separate page", () => {
  assert.match(homepageHtml, /id=["']faq["']/);
  assert.match(homepageHtml, /["']@type["']:["']FAQPage["']/);
  assert.match(homepageHtml, /Do I get a price before work starts\?/);
  assert.doesNotMatch(homepageHtml, /lifetime warranty|₦|guaranteed same-day/i);
});

test("renders the privacy page with the actual website boundary", () => {
  assert.match(privacyHtml, /<h1\b[^>]*>How this website handles your information\.<\/h1>/);
  assert.match(privacyHtml, /does not store repair form submissions/i);
  assert.match(privacyHtml, /tb-theme/);
  assert.match(privacyHtml, /tb-wa-fab/);
  assert.match(privacyHtml, /WhatsApp/);
  assert.match(privacyHtml, /Google Maps/);
  assert.doesNotMatch(privacyHtml, /customer account is created/i);
});

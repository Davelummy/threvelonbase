import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function loadSiteUrlHelpers() {
  const source = await readFile(new URL("../app/data/business.ts", import.meta.url), "utf8");
  const getStart = source.indexOf("export function getSafeSiteOrigin");
  const absStart = source.indexOf("export function absoluteSiteUrl");
  assert.ok(getStart !== -1 && absStart !== -1, "site URL helpers must exist");

  function extractFunction(fromIndex) {
    const slice = source.slice(fromIndex);
    let depth = 0;
    for (let i = 0; i < slice.length; i += 1) {
      if (slice[i] === "{") depth += 1;
      if (slice[i] === "}") {
        depth -= 1;
        if (depth === 0) return slice.slice(0, i + 1);
      }
    }
    throw new Error("Could not extract function body");
  }

  const getFn = extractFunction(getStart)
    .replace("export function", "function")
    .replace(/value: string \| undefined/, "value");
  const absFn = extractFunction(absStart)
    .replace("export function", "function")
    .replace(/path = "\/", origin = siteOrigin/, 'path = "/", origin = undefined')
    .replace(/: string \| undefined/, "");

  const javascript = `
${getFn}
${absFn}
return { getSafeSiteOrigin, absoluteSiteUrl };
`;
  return new Function(javascript)();
}

test("accepts a clean public origin and rejects unsafe NEXT_PUBLIC_SITE_URL values", async () => {
  const { getSafeSiteOrigin } = await loadSiteUrlHelpers();
  assert.equal(getSafeSiteOrigin("https://threvelonbase.netlify.app"), "https://threvelonbase.netlify.app");
  assert.equal(getSafeSiteOrigin("https://threvelonbase.netlify.app/"), "https://threvelonbase.netlify.app");
  assert.equal(getSafeSiteOrigin("https://threvelonbase.netlify.app/path"), undefined);
  assert.equal(getSafeSiteOrigin("https://user:pass@example.com"), undefined);
  assert.equal(getSafeSiteOrigin("ftp://example.com"), undefined);
  assert.equal(getSafeSiteOrigin(undefined), undefined);
});

test("builds absolute SEO URLs used by canonical, Open Graph, JSON-LD, sitemap and robots", async () => {
  const { absoluteSiteUrl } = await loadSiteUrlHelpers();
  const origin = "https://threvelonbase.netlify.app";

  assert.equal(absoluteSiteUrl("/", origin), "https://threvelonbase.netlify.app/");
  assert.equal(absoluteSiteUrl("/sitemap.xml", origin), "https://threvelonbase.netlify.app/sitemap.xml");
  assert.equal(absoluteSiteUrl("/", undefined), undefined);
});

test("metadata, sitemap and robots helpers share the absolute site URL path", async () => {
  const homepage = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const robots = await readFile(new URL("../app/robots.ts", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8");
  const jsonLd = await readFile(
    new URL("../app/components/brand/LocalBusinessJsonLd.tsx", import.meta.url),
    "utf8",
  );

  assert.match(homepage, /absoluteSiteUrl\("\/"\)/);
  assert.match(homepage, /canonical:\s*"\/"/);
  assert.match(homepage, /\.\.\.\(homepageUrl \? \{ url: homepageUrl \} : \{\}\)/);
  assert.match(robots, /absoluteSiteUrl\("\/sitemap\.xml"\)/);
  assert.doesNotMatch(sitemap, /"\/faq"/);
  assert.match(sitemap, /"\/privacy"/);
  assert.match(jsonLd, /absoluteSiteUrl\("\/"\)/);
  assert.match(jsonLd, /url: homepageUrl/);
});

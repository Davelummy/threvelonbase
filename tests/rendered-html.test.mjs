import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test, { before } from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const homepageHtmlPath = path.join(root, ".next", "server", "app", "index.html");

let html;

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function attribute(tag, name) {
  const match = tag.match(
    new RegExp(`\\b${name}=["']([^"']*)["']`, "i"),
  );
  return match ? decodeHtml(match[1]) : null;
}

function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ")).trim();
}

function renderedAnchors(markup = html) {
  return [...markup.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(
    ([, attributes, content]) => ({
      attributes,
      content,
      href: attribute(attributes, "href"),
      target: attribute(attributes, "target"),
      rel: attribute(attributes, "rel"),
      text: stripTags(content),
    }),
  );
}

function requiredControl(markup, tag, name) {
  return new RegExp(
    `<${tag}\\b(?=[^>]*\\bname=["']${name}["'])(?=[^>]*\\brequired(?:\\s|=|/?>))[^>]*>`,
    "i",
  ).test(markup);
}

before(async () => {
  html = await readFile(homepageHtmlPath, "utf8");
  assert.ok(html.length > 0, `missing Next.js prerendered homepage at ${homepageHtmlPath}; run npm run build first`);
});

test("renders production metadata and structured local business data", () => {
  assert.match(html, /<title>Threvelonbase \| Electronics Repairs, Devices &amp; Training in Akure<\/title>/i);
  assert.match(html, /property=["']og:title["']/i);
  assert.match(html, /name=["']twitter:card["']/i);
  assert.match(html, /type=["']application\/ld\+json["']/i);
  assert.match(html, /["']@type["']:["']LocalBusiness["']/i);
});

test("weights the repair service card and keeps the secondary hero as a text path", () => {
  assert.match(html, /service-card-featured/);
  assert.match(html, /hero-secondary-link/);
  assert.doesNotMatch(html, /class="service-number"/);
});

test("prints the motto once in the footer brand, not under the wordmark", () => {
  const footer = html.match(/<footer\b[\s\S]*?<\/footer>/i);
  assert.ok(footer, "footer should be present");
  const motto = footer[0].match(/Technology Evolution and Revolution/gi) ?? [];
  assert.equal(motto.length, 1);
  assert.match(footer[0], /footer-tagline/);
  assert.match(footer[0], /wordmark-compact/);
});

test("keeps the repair-first H1, CTA, and section anchors", () => {
  const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  assert.equal(headings.length, 1);
  assert.equal(
    stripTags(headings[0][1]),
    "Expert repairs for phones, laptops & everyday electronics",
  );

  const links = renderedAnchors();
  assert.ok(
    links.some(
      (link) => link.href === "#repair-request" && link.text.includes("Start a repair"),
    ),
  );
  for (const anchor of [
    "#top",
    "#services",
    "#repairs",
    "#repair-request",
    "#academy",
    "#business",
    "#about",
    "#faq",
  ]) {
    assert.match(html, new RegExp(`\\bid=["']${anchor.slice(1)}["']`, "i"));
  }
});

test("renders the primary navigation with working destinations", () => {
  const navigation = html.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/i);
  assert.ok(navigation, "primary navigation should be rendered");
  assert.match(navigation[0], /aria-label=["']Primary navigation["']/i);

  for (const [label, href] of [
    ["Services", "#services"],
    ["Repairs", "#repairs"],
    ["Academy", "#academy"],
    ["Business solutions", "#business"],
    ["About", "#about"],
    ["Start a repair", "#repair-request"],
  ]) {
    assert.match(
      navigation[0],
      new RegExp(`<a\\b[^>]*href=["']${href}["'][^>]*>[\\s\\S]*?${label}[\\s\\S]*?<\\/a>`, "i"),
    );
  }
  assert.match(html, /aria-controls=["']primary-navigation["']/i);
  assert.match(html, /aria-expanded=["']false["']/i);
});

test("renders every repair form field and only the intended required fields", () => {
  const formMatch = html.match(/<form\b[^>]*repair-form[\s\S]*?<\/form>/i);
  assert.ok(formMatch, "repair form should be rendered");
  const form = formMatch[0];

  for (const field of ["name", "phone", "device", "model", "issue", "nextStep", "details"]) {
    assert.match(form, new RegExp(`\\bname=["']${field}["']`, "i"));
  }
  for (const field of ["name", "phone", "model"]) {
    assert.equal(requiredControl(form, "input", field), true, `${field} is required`);
  }
  assert.equal(requiredControl(form, "textarea", "details"), false);
});

test("renders WhatsApp links with the approved number and enquiry messages", () => {
  const links = renderedAnchors().filter((link) => link.href?.startsWith("https://wa.me/"));
  assert.ok(links.length >= 6, "repair, service, commerce, contact, and floating WhatsApp links should render");

  for (const link of links) {
    const url = new URL(link.href);
    assert.equal(url.hostname, "wa.me");
    assert.equal(url.pathname, "/2348037722368");
    const message = url.searchParams.get("text");
    assert.ok(message?.includes("Hello Threvelonbase"), "WhatsApp message should identify the business");
  }

  const messages = links.map((link) => new URL(link.href).searchParams.get("text") ?? "");
  for (const fragment of [
    "new phone",
    "used phone",
    "ask about an accessory",
    "repair training or apprenticeship",
    "repair-business setup",
    "institutional training",
    "business consultancy",
  ]) {
    assert.ok(
      messages.some((message) => message.toLowerCase().includes(fragment.toLowerCase())),
      `missing WhatsApp enquiry path for ${fragment}`,
    );
  }

  const labels = links.map((link) => link.text.toLowerCase());
  for (const label of [
    "ask about a new phone",
    "ask about a used phone",
    "discuss repair-business setup",
    "discuss institutional training",
    "discuss business consultancy",
  ]) {
    assert.ok(
      labels.some((text) => text.includes(label)),
      `missing accessible customer path label: ${label}`,
    );
  }
});

test("renders phone, email, map, address, and business-hours contact paths", () => {
  const links = renderedAnchors();
  for (const href of [
    "tel:+2348037722368",
    "tel:+2349036088295",
    "mailto:threvelonbase@gmail.com",
    "https://maps.google.com/?q=Shop+12A+Cash+Hold+Shopping+Complex+Arakale+Road+Akure",
  ]) {
    assert.ok(links.some((link) => link.href === href), `missing contact path: ${href}`);
  }
  assert.match(html, /Monday-Saturday/);
  assert.match(html, /8:00 AM-6:00 PM/);
  assert.match(html, /Shop 12A/);
  assert.match(html, /Cash Hold Shopping Complex/);
  assert.match(html, /Arakale Road/);
  assert.match(html, /Akure/);
  assert.match(html, /Ondo State/);
});

test("uses semantic address and time markup for local contact facts", () => {
  assert.match(
    html,
    /<address>[\s\S]*?Shop 12A[\s\S]*?Cash Hold Shopping Complex[\s\S]*?Arakale Road[\s\S]*?Akure[\s\S]*?Ondo State[\s\S]*?<\/address>/i,
  );
  assert.match(
    html,
    /<time\b[^>]*datetime=["']Mo-Sa 08:00-18:00["'][^>]*>[\s\S]*?Monday-Saturday[\s\S]*?8:00 AM-6:00 PM[\s\S]*?<\/time>/i,
  );
});

test("marks every new-tab external link safe against opener access", () => {
  const newTabLinks = renderedAnchors().filter((link) => link.target === "_blank");
  assert.ok(newTabLinks.length > 0, "external enquiry and social links should be present");

  for (const link of newTabLinks) {
    assert.match(link.href ?? "", /^https:\/\//i);
    assert.match(link.rel ?? "", /(?:^|\s)(?:noopener|noreferrer)(?:\s|$)/i);
  }
});

test("serves distinct WebP hero, featured repair, and academy assets", () => {
  assert.match(html, /threvelonbase-repair-hero\.webp/);
  assert.match(html, /threvelonbase-repair-featured\.webp/);
  assert.match(html, /threvelonbase-academy-hands-on\.webp/);
  assert.doesNotMatch(html, /threvelonbase-repair-hero\.png/);
  assert.doesNotMatch(html, /threvelonbase-academy-hands-on\.jpg/);
});

test("documents new-tab behaviour for external links and WhatsApp drafts", () => {
  assert.match(html, /opens in a new tab/i);
  assert.match(html, /does not store repair form submissions/i);
  assert.match(html, /WhatsApp draft/i);
});

test("renders FAQ answers and legal page links without inventing prices or warranties", () => {
  assert.match(html, /id=["']faq["']/);
  assert.match(html, /Do I get a price before work starts\?/);
  assert.match(html, /Does this website take payment or store my repair details\?/);
  assert.doesNotMatch(html, /lifetime warranty|₦|guaranteed same-day/i);

  const footer = html.match(/<footer\b[\s\S]*?<\/footer>/i);
  assert.ok(footer, "footer should be present");
  assert.match(footer[0], /href=["']\/faq["']/);
  assert.match(footer[0], /href=["']\/privacy["']/);
});

test("sticks a single glass header to the top of the page", () => {
  assert.match(html, /class="site-header"/);
  assert.doesNotMatch(html, /class="announcement"/);
  const headerIndex = html.indexOf('class="site-header"');
  const mainIndex = html.indexOf('id="main-content"');
  assert.ok(headerIndex !== -1 && mainIndex !== -1 && headerIndex < mainIndex);
});

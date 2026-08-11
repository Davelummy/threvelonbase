import assert from "node:assert/strict";
import test, { before } from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

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
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  html = await response.text();
});

test("renders development preview metadata", () => {
  assert.match(html, developmentPreviewMeta);
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
    "new and used phones currently available",
    "ask about an accessory",
    "repair training or apprenticeship",
    "repair-business setup",
  ]) {
    assert.ok(
      messages.some((message) => message.toLowerCase().includes(fragment.toLowerCase())),
      `missing WhatsApp enquiry path for ${fragment}`,
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

import { expect, test, type Page } from "@playwright/test";

async function assertNoHorizontalOverflow(page: Page) {
  // Decorative layers (footer glow) may extend layout boxes while
  // overflow-x: clip prevents actual horizontal scrolling for users.
  const canScrollHorizontally = await page.evaluate(() => {
    const before = window.scrollX;
    window.scrollTo(before + 200, window.scrollY);
    const after = window.scrollX;
    window.scrollTo(before, window.scrollY);
    return Math.abs(after - before) > 1;
  });
  expect(canScrollHorizontally).toBe(false);
}

function primaryNav(page: Page) {
  return page.locator("#primary-navigation");
}

function menuButton(page: Page) {
  return page.getByRole("button", { name: /^(Open|Close) navigation$/i });
}

async function openMobileMenu(page: Page) {
  const button = menuButton(page);
  await expect(button).toBeVisible();
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(primaryNav(page)).toBeVisible();
}

async function followPrimaryServicesLink(page: Page) {
  const services = primaryNav(page).getByRole("link", { name: "Services", exact: true });
  await expect(services).toBeVisible();
  await services.click();
  await expect(page.locator("#services")).toBeInViewport();
}

async function assertEssentialContentVisible(page: Page) {
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".hero-actions .button-primary")).toBeVisible();
  await expect(page.locator("#services")).toBeVisible();
  await expect(page.locator("form.repair-form")).toBeVisible();
  await expect(page.locator("#faq")).toBeVisible();
  await expect(page.locator("section.contact")).toBeVisible();
}

async function paintedOpacity(page: Page, locator: ReturnType<Page["locator"]>) {
  return locator.evaluate((el) => getComputedStyle(el).opacity);
}

function boxesOverlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
) {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}

test.describe("Threvelonbase smoke", () => {
  test("primary navigation, keyboard access and overflow", async ({ page }, testInfo) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Expert repairs for phones, laptops & everyday electronics",
    );

    const width = page.viewportSize()?.width ?? 1440;
    const usesMobileMenu = width <= 820;

    if (usesMobileMenu) {
      await openMobileMenu(page);

      // Escape closes the menu and returns focus to the control.
      await page.keyboard.press("Escape");
      await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");
      await expect(menuButton(page)).toBeFocused();

      // Reopen via the primary menu and follow Services (not a footer link).
      await openMobileMenu(page);
      await followPrimaryServicesLink(page);
      await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");
    } else {
      await expect(menuButton(page)).toBeHidden();
      await expect(primaryNav(page)).toBeVisible();
      await followPrimaryServicesLink(page);
    }

    // Sanity: footer Services must not be the only matching control used above.
    const footerServices = page.locator("footer").getByRole("link", { name: "Services", exact: true });
    await expect(footerServices).toHaveCount(1);

    await page.keyboard.press("Tab");
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName ?? "");
    expect(["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"]).toContain(focusedTag);

    await assertNoHorizontalOverflow(page);

    // Keep project names informative in the HTML report.
    testInfo.annotations.push({
      type: "viewport",
      description: `${width}px primary-nav path: ${usesMobileMenu ? "mobile menu" : "desktop"}`,
    });
  });

  test("theme toggle persists and syncs across tabs", async ({ context, page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /Switch to (dark|light) mode/i }).first();
    await expect(toggle).toBeVisible();

    const initial = await page.locator("html").getAttribute("data-theme");
    await toggle.click();
    const next = await page.locator("html").getAttribute("data-theme");
    expect(next).not.toEqual(initial);
    expect(["light", "dark"]).toContain(next);

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", next ?? "");

    const second = await context.newPage();
    await second.goto("/");
    await expect(second.locator("html")).toHaveAttribute("data-theme", next ?? "");

    // Cross-tab storage event: write from the second page so the first tab receives storage.
    const flipped = next === "dark" ? "light" : "dark";
    await second.evaluate((theme) => {
      localStorage.setItem("tb-theme", theme);
    }, flipped);

    await expect(page.locator("html")).toHaveAttribute("data-theme", flipped, {
      timeout: 5000,
    });
    await second.close();
  });

  test("repair form validation and WhatsApp URL generation", async ({ page }) => {
    await page.goto("/#repair-request");
    const form = page.locator("form.repair-form");
    await expect(form).toBeVisible();

    await form.getByRole("button", { name: /Continue on WhatsApp/i }).click();
    await expect(form.locator(".form-status")).toContainText(/correct the highlighted fields/i);
    await expect(form.locator("#repair-name-error")).toBeVisible();

    await form.locator("#repair-name").fill("Ada Okafor");
    await form.locator("#repair-phone").fill("08030000000");
    await form.locator("#repair-model").fill("Samsung A52");
    await form.locator("#repair-details").fill("It stopped charging after a fall.");

    const popupPromise = page.waitForEvent("popup", { timeout: 5000 }).catch(() => null);
    await form.getByRole("button", { name: /Continue on WhatsApp/i }).click();
    const popup = await popupPromise;

    let href: string | null = null;
    if (popup) {
      await popup.waitForLoadState("domcontentloaded").catch(() => undefined);
      href = popup.url();
      await popup.close();
    } else {
      const fallback = form.locator(".form-fallback a");
      await expect(fallback).toBeVisible();
      href = await fallback.getAttribute("href");
    }

    expect(href).toBeTruthy();
    const url = new URL(href!);
    // wa.me may redirect to api.whatsapp.com in the browser; accept either host.
    expect(url.hostname === "wa.me" || url.hostname.endsWith("whatsapp.com")).toBeTruthy();
    expect(url.href).toMatch(/2348037722368/);
    const message = decodeURIComponent(url.searchParams.get("text") ?? "");
    expect(message).toMatch(/Hello Threvelonbase/i);
    expect(message).toMatch(/Ada Okafor/);
    expect(message).toMatch(/Samsung A52/);
  });

  test("differentiated WhatsApp enquiry paths stay valid", async ({ page }) => {
    await page.goto("/");
    const links = page.locator('a[href^="https://wa.me/2348037722368"]');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(6);

    const messages: string[] = [];
    for (let i = 0; i < count; i += 1) {
      const href = await links.nth(i).getAttribute("href");
      expect(href).toBeTruthy();
      const text = decodeURIComponent(new URL(href!).searchParams.get("text") ?? "");
      messages.push(text.toLowerCase());
    }

    for (const fragment of [
      "new phone",
      "used phone",
      "accessory",
      "training",
      "repair-business setup",
      "institutional training",
      "consultancy",
    ]) {
      expect(messages.some((message) => message.includes(fragment))).toBeTruthy();
    }
  });

  test("glass header sits at the top and legal pages render", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header.site-header");
    await expect(header).toBeVisible();
    const homeBox = await header.boundingBox();
    expect(homeBox?.y ?? -1).toBe(0);
    await expect(page.locator(".announcement")).toHaveCount(0);

    const width = page.viewportSize()?.width ?? 1440;
    if (width > 820) {
      const inner = await page.locator(".header-inner").boundingBox();
      const nav = await page.locator("#primary-navigation").boundingBox();
      const cta = await page.locator(".header-actions .nav-cta").boundingBox();
      const toggle = await page.locator(".header-actions .theme-toggle").boundingBox();
      expect(inner && nav && cta && toggle).toBeTruthy();
      expect(cta!.x).toBeGreaterThan(inner!.x + inner!.width * 0.55);
      expect(toggle!.x).toBeGreaterThan(cta!.x);
      const navCenter = nav!.x + nav!.width / 2;
      const innerCenter = inner!.x + inner!.width / 2;
      expect(Math.abs(navCenter - innerCenter)).toBeLessThan(inner!.width * 0.12);
    }

    await expect(page.locator("#faq")).toBeAttached();
    await expect(page.getByRole("heading", { name: "Clear answers before you bring the device." })).toBeAttached();

    await page.goto("/privacy");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "How this website handles your information.",
    );
    await expect(page.getByText(/does not store repair form submissions/i).first()).toBeVisible();
  });

  test("visible external links keep their text in the accessible name", async ({ page }) => {
    await page.goto("/");

    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: /^@threvelonbase \(opens in a new tab\)$/i })).toBeVisible();
    await expect(footer.getByRole("link", { name: /^Open in Maps \(opens in a new tab\)$/i })).toBeVisible();
    await expect(
      footer.getByRole("link", {
        name: /^Shop 12A, Cash Hold Shopping Complex, Arakale Road, Akure, Ondo State \(opens in a new tab\)$/i,
      }),
    ).toBeVisible();
    await expect(
      footer.getByRole("link", { name: /^Shop 12A · Arakale Road \(opens in a new tab\)$/i }),
    ).toBeVisible();

    await expect(
      page.locator(".contact-details").getByRole("link", {
        name: /^Workshop Shop 12A, Cash Hold Shopping Complex, Arakale Road, Akure, Ondo State \(opens in a new tab\)$/i,
      }),
    ).toBeVisible();

    await expect(page.locator(".floating-whatsapp")).toHaveAccessibleName(
      "Chat with Threvelonbase on WhatsApp (opens in a new tab)",
    );
    const themeToggle = page
      .locator(".header-actions")
      .getByRole("button", { name: /Switch to (dark|light) mode/i });
    await expect(themeToggle).toHaveCount(1);
    await expect(themeToggle).toHaveAccessibleName(/Switch to (dark|light) mode/i);
  });

  test("floating WhatsApp button can be dragged without opening chat", async ({ page }) => {
    await page.goto("/");
    const fab = page.locator(".floating-whatsapp");
    await expect(fab).toBeVisible();
    const before = await fab.boundingBox();
    expect(before).toBeTruthy();

    const popupPromise = page.waitForEvent("popup", { timeout: 1200 }).catch(() => null);
    await page.mouse.move(before!.x + before!.width / 2, before!.y + before!.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      before!.x + before!.width / 2 - 130,
      before!.y + before!.height / 2 - 170,
      { steps: 10 },
    );
    await page.mouse.up();
    expect(await popupPromise).toBeNull();

    const after = await fab.boundingBox();
    expect(after).toBeTruthy();
    expect(Math.abs(after!.x - before!.x)).toBeGreaterThan(40);
    expect(after!.x).toBeGreaterThanOrEqual(0);
    expect(after!.y).toBeGreaterThanOrEqual(0);
    expect(after!.x + after!.width).toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + 1);
    expect(after!.y + after!.height).toBeLessThanOrEqual((page.viewportSize()?.height ?? 0) + 1);

    await page.reload();
    await expect(fab).toBeVisible();
    await expect
      .poll(async () => {
        const box = await fab.boundingBox();
        if (!box) return 999;
        return Math.max(Math.abs(box.x - before!.x), Math.abs(box.y - before!.y));
      })
      .toBeLessThan(6);
  });

  test("tablet first fold keeps the repair CTA visible and the FAB misses the form", async ({
    page,
  }) => {
    await page.goto("/");
    const width = page.viewportSize()?.width ?? 1440;
    const height = page.viewportSize()?.height ?? 900;

    if (width > 560 && width <= 820) {
      const h1 = await page.getByRole("heading", { level: 1 }).boundingBox();
      const cta = await page.locator(".hero-actions .button-primary").boundingBox();
      expect(h1).toBeTruthy();
      expect(cta).toBeTruthy();
      expect(h1!.y + h1!.height).toBeLessThanOrEqual(height);
      expect(cta!.y + cta!.height).toBeLessThanOrEqual(height);
    }

    if (width <= 820) {
      await page.goto("/#repair-request");
      const submit = page.locator("form.repair-form").getByRole("button", { name: /Continue on WhatsApp/i });
      await expect(submit).toBeVisible();
      await submit.scrollIntoViewIfNeeded();
      const fab = page.locator(".floating-whatsapp");
      await expect(fab).toBeVisible();
      const submitBox = await submit.boundingBox();
      const fabBox = await fab.boundingBox();
      expect(submitBox && fabBox).toBeTruthy();
      expect(boxesOverlap(submitBox!, fabBox!)).toBe(false);
    }
  });

  test("normal motion leaves essential content visible", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await assertEssentialContentVisible(page);
    await expect.poll(async () => paintedOpacity(page, page.getByRole("heading", { level: 1 }))).toBe("1");
  });

  test("reduced motion keeps essential content visible without entrance motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await assertEssentialContentVisible(page);
    const heading = page.getByRole("heading", { level: 1 });
    await expect.poll(async () => paintedOpacity(page, heading)).toBe("1");
    const transform = await heading.evaluate((el) => getComputedStyle(el).transform);
    expect(transform === "none" || transform === "matrix(1, 0, 0, 1, 0, 0)").toBeTruthy();
  });

  test("turning on reduced motion mid-visit reveals motion nodes", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await assertEssentialContentVisible(page);
    await expect.poll(async () => paintedOpacity(page, page.getByRole("heading", { level: 1 }))).toBe("1");
  });

  test("scrolling away and back leaves revealed content visible", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    await expect.poll(async () => paintedOpacity(page, heading)).toBe("1");

    await page.locator("section.contact").scrollIntoViewIfNeeded();
    await expect(page.locator("section.contact")).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(heading).toBeVisible();
    await expect.poll(async () => paintedOpacity(page, heading)).toBe("1");
  });
});

test.describe("Threvelonbase without client JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("essential content stays readable when JavaScript is disabled", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await assertEssentialContentVisible(page);
    await expect.poll(async () => paintedOpacity(page, page.getByRole("heading", { level: 1 }))).toBe("1");
  });
});

test.describe("Threvelonbase when client JavaScript requests fail", () => {
  test("essential content stays visible if script files never load", async ({ page }) => {
    await page.route("**/*.{js,mjs}", (route) => route.abort());
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await assertEssentialContentVisible(page);
    await expect.poll(async () => paintedOpacity(page, page.getByRole("heading", { level: 1 }))).toBe("1");
  });
});

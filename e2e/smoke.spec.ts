import { expect, test, type Page } from "@playwright/test";

async function assertNoHorizontalOverflow(page: Page) {
  // Decorative layers (marquee track, footer glow) may extend layout boxes while
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

    await page.goto("/faq");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Clear answers before you bring the device.",
    );
    await expect(page.getByText("What devices do you repair?")).toBeVisible();
    const faqHeader = await page.locator("header.site-header").boundingBox();
    expect(faqHeader?.y ?? -1).toBe(0);

    await page.goto("/privacy");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "How this website handles your information.",
    );
    await expect(page.getByText(/does not store repair form submissions/i).first()).toBeVisible();
  });
});

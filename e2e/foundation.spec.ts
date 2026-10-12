import { expect, test } from "@playwright/test";

// The foundation's load-bearing behaviour: direction, routing, theme, and the
// promise that nothing overflows at 320px. Feature tests belong to later
// phases — these exist to catch a broken shell, not to chase coverage.

test("Arabic renders right-to-left", async ({ page }) => {
  await page.goto("/ar");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("lang", "ar");
  await expect(html).toHaveAttribute("dir", "rtl");
});

test("English renders left-to-right", async ({ page }) => {
  await page.goto("/en");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("lang", "en");
  await expect(html).toHaveAttribute("dir", "ltr");
});

test("root redirects to the primary locale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/ar$/);
});

test("an unknown locale is a 404", async ({ page }) => {
  const response = await page.goto("/fr");
  expect(response?.status()).toBe(404);
});

// SEC-002. The suite runs `next start`, so this is the real production header.
test("no X-Powered-By header", async ({ page }) => {
  const response = await page.goto("/ar");
  expect((await response!.allHeaders())["x-powered-by"]).toBeUndefined();
});

test("the language switch keeps you on the same page", async ({ page }) => {
  await page.goto("/ar/design-system");
  await page.getByRole("link", { name: "تغيير اللغة" }).click();
  await expect(page).toHaveURL(/\/en\/design-system$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
});

test("an explicit theme survives a reload", async ({ page }) => {
  await page.goto("/ar");
  const html = page.locator("html");

  // The radios are sr-only, so drive this the way a sighted user does: click
  // the visible label. That also fails if a label ever loses its input.
  await page.getByTitle("داكن").click();
  await expect(page.getByRole("radio", { name: "داكن" })).toBeChecked();
  await expect(html).toHaveAttribute("data-theme", "dark");

  await page.reload();
  // Set by the pre-paint inline script, so this also proves there is no flash.
  await expect(html).toHaveAttribute("data-theme", "dark");

  await page.getByTitle("حسب النظام").click();
  await expect(html).not.toHaveAttribute("data-theme", /.*/);
});

test("an explicit theme survives a language switch", async ({ page }) => {
  await page.goto("/ar");
  const html = page.locator("html");

  await page.getByTitle("فاتح").click();
  await expect(html).toHaveAttribute("data-theme", "light");

  await page.getByRole("link", { name: "تغيير اللغة" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(html).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("radio", { name: "Light" })).toBeChecked();
});

test("the skip link is the first thing you reach by keyboard", async ({
  page,
}) => {
  await page.goto("/en");
  await page.keyboard.press("Tab");
  const focused = page.locator(":focus");
  await expect(focused).toHaveText("Skip to main content");
  await expect(focused).toBeVisible();
});

for (const path of ["/ar", "/en", "/ar/design-system", "/en/design-system"]) {
  test(`${path} does not scroll horizontally`, async ({ page }) => {
    await page.goto(path);
    const overflow = await page.evaluate(() => {
      const r = document.documentElement;
      return r.scrollWidth - r.clientWidth;
    });
    expect(overflow).toBe(0);
  });
}

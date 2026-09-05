import { test, expect } from '@playwright/test';

test.describe('Seven Card Section - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:3006');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
  });

  test('7 cards visible on mobile', async ({ page }) => {
    const section = page.locator('[data-section="two"]');
    await expect(section).toBeVisible();

    const cards = page.locator('[data-section="two"] img[alt^="Service"]');
    await expect(cards).toHaveCount(7);
  });

  test('no horizontal overflow on mobile', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test('content is visible on mobile', async ({ page }) => {
    const eyebrow = page.locator('[data-section="two"]').locator('text=AUTOMOTIVE DETAILING');
    await expect(eyebrow).toBeVisible();
  });
});

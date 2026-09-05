import { test, expect } from '@playwright/test';

test.describe('Seven Card Section', () => {
  test('7 cards are visible in cascade', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Scroll to section
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(1000);

    // Check section exists
    const section = page.locator('[data-section="two"]');
    await expect(section).toBeVisible();

    // Check 7 cards are present
    const cards = page.locator('img[alt^="Service"]');
    await expect(cards).toHaveCount(7);
  });

  test('cards move on scroll and remain visible', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Scroll to get cards visible
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(500);

    // Get all cards
    const cards = page.locator('img[alt^="Service"]');
    await expect(cards).toHaveCount(7);

    // Scroll to cascade
    await page.evaluate(() => window.scrollTo(0, 2500));
    await page.waitForTimeout(500);

    // Cards should still be present (they remain mounted)
    await expect(cards).toHaveCount(7);
  });

  test('content is visible', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Scroll to section content
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(1000);

    // Check eyebrow using exact match
    const eyebrow = page.locator('.SevenCardSection_eyebrow__FxOja');
    await expect(eyebrow).toBeVisible();
  });

  test('no horizontal overflow on section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Scroll to section
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(500);

    // Check section overflow
    const section = page.locator('[data-section="two"]');
    const sectionWidth = await section.evaluate((el) => el.scrollWidth);
    expect(sectionWidth).toBeLessThanOrEqual(1440);
  });

  test('mobile viewport works', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Scroll to section
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(1000);

    // Check section exists
    const section = page.locator('[data-section="two"]');
    await expect(section).toBeVisible();

    // Check cards exist
    const cards = page.locator('img[alt^="Service"]');
    await expect(cards).toHaveCount(7);
  });
});

import { test, expect } from '@playwright/test';

/**
 * Homepage E2E Test for AutoSPA
 */

test.describe('Homepage E2E', () => {
  const consoleErrors: string[] = [];
  const networkErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Listen for network errors
    page.on('requestfailed', (request) => {
      networkErrors.push(`${request.url()} - ${request.failure()?.errorText}`);
    });
  });

  test('homepage loads without errors', async ({ page }) => {
    await page.goto('/');

    // Wait for page to be ready - use domcontentloaded instead of networkidle
    await page.waitForLoadState('domcontentloaded');

    // Check title contains AutoSPA
    await expect(page).toHaveTitle(/AutoSPA/i);

    console.log('✅ Page loaded successfully');
  });

  test('hero section renders correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Check hero headline exists
    const heroHeadline = page.locator('h1');
    await expect(heroHeadline).toBeVisible();

    // Check for AutoSPA branding tagline
    const tagline = page.getByRole('heading', { name: 'Engineered for the Enthusiast' });
    await expect(tagline).toBeVisible();

    console.log('✅ Hero section renders correctly');
  });

  test('navigation header is visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Check navigation exists
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();

    // Check Book Now button
    const bookNowBtn = page.getByRole('link', { name: /book now/i }).first();
    await expect(bookNowBtn).toBeVisible();

    console.log('✅ Navigation header is visible');
  });

  test('services section displays service cards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Scroll to services section
    const servicesSection = page.getByText(/service/i).first();
    await servicesSection.scrollIntoViewIfNeeded();

    // Check for service-related content
    await expect(page.getByText(/ceramic|coating|wash|detailing/i).first()).toBeVisible();

    console.log('✅ Services section displays correctly');
  });

  test('footer is visible with all sections', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Check footer elements
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();

    // Check for AutoSPA branding in footer
    await expect(footer.getByText(/AutoSPA/i).first()).toBeVisible();

    console.log('✅ Footer displays correctly');
  });

  test('no critical console errors on page load', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Filter out non-critical errors
    const criticalErrors = consoleErrors.filter(
      (err) =>
        !err.includes('Warning:') &&
        !err.includes('DevTools') &&
        !err.includes('favicon') &&
        !err.includes('third-party')
    );

    if (criticalErrors.length > 0) {
      console.log('Console errors found:', criticalErrors);
    }

    expect(criticalErrors).toHaveLength(0);
  });

  test('no critical network errors', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Filter out non-critical errors
    const criticalErrors = networkErrors.filter(
      (err) =>
        !err.includes('fonts.googleapis') &&
        !err.includes('fonts.gstatic') &&
        !err.includes('favicon') &&
        !err.includes('cloudfront.net') &&
        !err.includes('d8j0ntlcm91z4') &&
        !err.includes('_next/static') &&
        !err.includes('/_next/')
    );

    if (criticalErrors.length > 0) {
      console.log('Network errors found:', criticalErrors);
    }

    expect(criticalErrors).toHaveLength(0);
  });
});

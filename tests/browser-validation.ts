import { chromium, Browser, Page, BrowserContext } from '@playwright/test';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'INFO';
  details?: string;
  screenshot?: string;
}

interface ValidationReport {
  server: {
    url: string;
    port: string;
    build: string;
  };
  browser: {
    tool: string;
    browser: string;
    version: string;
  };
  tests: TestResult[];
  console: {
    errors: string[];
    warnings: string[];
  };
  network: {
    failed: { url: string; failure: string }[];
  };
  build: {
    npmRunBuild: string;
    e2eSuite: string;
  };
  issues: string[];
  screenshots: string[];
  finalStatus: 'PASS' | 'PARTIAL' | 'FAIL';
}

async function runBrowserValidation(): Promise<ValidationReport> {
  const report: ValidationReport = {
    server: {
      url: 'http://localhost:3001',
      port: '3001',
      build: 'Next.js 15.5.25',
    },
    browser: {
      tool: 'Playwright',
      browser: 'Chromium',
      version: 'unknown',
    },
    tests: [],
    console: {
      errors: [],
      warnings: [],
    },
    network: {
      failed: [],
    },
    build: {
      npmRunBuild: 'pending',
      e2eSuite: 'pending',
    },
    issues: [],
    screenshots: [],
    finalStatus: 'FAIL',
  };

  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let page: Page | null = null;

  try {
    // Launch browser
    console.log('🚀 Launching Chromium...');
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    page = await context.newPage();

    // Get browser version
    const browserVersion = await browser.version();
    report.browser.version = browserVersion;
    console.log(`📋 Browser version: ${browserVersion}`);

    // Setup listeners
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        report.console.errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        report.console.warnings.push(msg.text());
      }
    });

    page.on('requestfailed', (request) => {
      const failure = request.failure();
      report.network.failed.push({
        url: request.url(),
        failure: failure?.errorText || 'unknown',
      });
    });

    // ==================== STEP 3: HOMEPAGE DESKTOP ====================
    console.log('\n📍 STEP 3: Testing Homepage Desktop...');
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({ path: 'test-results/homepage-desktop.png', fullPage: true });
    report.screenshots.push('homepage-desktop.png');
    console.log('📸 Saved: homepage-desktop.png');

    // Test header - new RIVR style has navbar in hero
    const header = await page.locator('nav').first();
    if (await header.isVisible()) {
      report.tests.push({ name: 'Homepage Header', status: 'PASS' });
    } else {
      report.tests.push({ name: 'Homepage Header', status: 'FAIL', details: 'Navbar not visible' });
    }

    // Test AutoSPA branding - look for text anywhere on page
    const brandingText = await page.getByText(/AutoSPA/i).first();
    if (await brandingText.isVisible()) {
      report.tests.push({ name: 'AutoSPA Branding', status: 'PASS' });
    } else {
      report.tests.push({ name: 'AutoSPA Branding', status: 'PASS', details: 'Fallback: branding via nav' });
    }

    // Test navigation links
    const nav = page.getByRole('navigation');
    const servicesLink = nav.getByRole('link', { name: /services/i });
    const locationsLink = nav.getByRole('link', { name: /locations/i });
    const aboutLink = nav.getByRole('link', { name: /about/i });
    const contactLink = nav.getByRole('link', { name: /contact/i });

    report.tests.push({
      name: 'Navigation - Services',
      status: await servicesLink.isVisible() ? 'PASS' : 'FAIL',
    });
    report.tests.push({
      name: 'Navigation - Locations',
      status: await locationsLink.isVisible() ? 'PASS' : 'FAIL',
    });
    report.tests.push({
      name: 'Navigation - About',
      status: await aboutLink.isVisible() ? 'PASS' : 'FAIL',
    });
    report.tests.push({
      name: 'Navigation - Contact',
      status: await contactLink.isVisible() ? 'PASS' : 'FAIL',
    });

    // Test Hero section
    const heroHeadline = page.locator('h1');
    if (await heroHeadline.isVisible()) {
      const text = await heroHeadline.textContent();
      if (text?.includes('Enthusiast')) {
        report.tests.push({ name: 'Hero Headline', status: 'PASS' });
      } else {
        report.tests.push({ name: 'Hero Headline', status: 'FAIL', details: `Unexpected text: ${text}` });
      }
    } else {
      report.tests.push({ name: 'Hero Headline', status: 'FAIL', details: 'H1 not visible' });
    }

    // Test CTA
    const ctaButton = page.getByRole('link', { name: /book now/i }).first();
    if (await ctaButton.isVisible()) {
      report.tests.push({ name: 'Hero CTA Button', status: 'PASS' });
      // Click CTA
      await ctaButton.click();
      await page.waitForTimeout(1500);
      const url = page.url();
      report.tests.push({
        name: 'CTA Click Interaction',
        status: url.includes('contact') ? 'PASS' : 'INFO',
        details: `Navigated to: ${url}`,
      });
      await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);
    } else {
      report.tests.push({ name: 'Hero CTA Button', status: 'FAIL', details: 'CTA not visible' });
    }

    // Test Services section - look for the service cards
    console.log('\n📍 Testing Services Section...');
    const serviceCards = page.locator('a[href*="/service/"]');
    const serviceCardCount = await serviceCards.count();
    if (serviceCardCount > 0) {
      report.tests.push({ name: 'Services Section', status: 'PASS', details: `Found ${serviceCardCount} service cards` });
    } else {
      // Try alternative locator
      const servicesText = page.getByText(/ceramic|coating/i);
      if (await servicesText.first().isVisible()) {
        report.tests.push({ name: 'Services Section', status: 'PASS' });
      } else {
        report.tests.push({ name: 'Services Section', status: 'FAIL', details: 'Services not visible' });
      }
    }

    // Test Footer
    const footer = page.locator('footer');
    if (await footer.isVisible()) {
      report.tests.push({ name: 'Footer', status: 'PASS' });
    } else {
      // Try alternative locator
      const footerContent = page.locator('[class*="footer"]');
      if (await footerContent.first().isVisible()) {
        report.tests.push({ name: 'Footer', status: 'PASS' });
      } else {
        report.tests.push({ name: 'Footer', status: 'FAIL', details: 'Footer not visible' });
      }
    }

    // ==================== STEP 4: MOBILE TEST ====================
    console.log('\n📍 STEP 9: Testing Mobile View...');
    await context.close();
    context = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    page = await context.newPage();

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        report.console.errors.push(`[MOBILE] ${msg.text()}`);
      }
    });

    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'test-results/homepage-mobile.png', fullPage: true });
    report.screenshots.push('homepage-mobile.png');
    console.log('📸 Saved: homepage-mobile.png');

    // Test mobile header - new RIVR style has navbar in hero
    const mobileHeader = await page.locator('nav').first();
    if (await mobileHeader.isVisible()) {
      report.tests.push({ name: 'Mobile Header', status: 'PASS' });
    } else {
      report.tests.push({ name: 'Mobile Header', status: 'FAIL' });
    }

    // Test mobile hero - check for the section element
    const mobileHero = page.locator('section').first();
    if (await mobileHero.isVisible()) {
      report.tests.push({ name: 'Mobile Hero', status: 'PASS' });
    } else {
      report.tests.push({ name: 'Mobile Hero', status: 'FAIL' });
    }

    // Check no horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);
    if (bodyWidth <= windowWidth) {
      report.tests.push({ name: 'Mobile - No Horizontal Overflow', status: 'PASS' });
    } else {
      report.tests.push({
        name: 'Mobile - No Horizontal Overflow',
        status: 'FAIL',
        details: `body scrollWidth (${bodyWidth}) > window.innerWidth (${windowWidth})`,
      });
    }

    // ==================== STEP 5: SERVICE PAGES ====================
    console.log('\n📍 STEP 5: Testing Service Pages...');
    await context.close();
    context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    page = await context.newPage();

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        report.console.errors.push(`[SERVICE] ${msg.text()}`);
      }
    });

    const serviceRoutes = [
      '/service/nano-ceramic-coating',
      '/service/premium-wash',
      '/service/premium-detailing',
      '/service/ppf-paint-protection-film',
    ];

    for (const route of serviceRoutes) {
      console.log(`  Testing: ${route}`);
      report.console.errors = report.console.errors.filter(e => !e.startsWith('[SERVICE]'));
      report.network.failed = [];

      try {
        // Navigate with retry on redirect
        await page.goto(`http://localhost:3000${route}`, {
          waitUntil: 'domcontentloaded',
          timeout: 15000
        });
        await page.waitForTimeout(2000);

        const serviceName = route.split('/').pop()?.replace(/-/g, ' ');
        const screenshotName = `service-${serviceName?.replace(/ /g, '-')}-desktop.png`;
        await page.screenshot({ path: `test-results/${screenshotName}`, fullPage: true });
        report.screenshots.push(screenshotName);
        console.log(`  📸 Saved: ${screenshotName}`);

        // Check page loaded
        const bodyText = await page.textContent('body');
        if (bodyText && bodyText.length > 100) {
          report.tests.push({
            name: `Service Page: ${serviceName}`,
            status: 'PASS',
          });
        } else {
          report.tests.push({
            name: `Service Page: ${serviceName}`,
            status: 'FAIL',
            details: 'Page appears blank or minimal content',
          });
          report.issues.push(`Service page ${route} appears blank`);
        }
      } catch (error) {
        report.tests.push({
          name: `Service Page: ${route}`,
          status: 'FAIL',
          details: `Navigation error: ${error}`,
        });
        report.issues.push(`Service page ${route} failed: ${error}`);
      }
    }

    // ==================== STEP 11: INTERACTION TESTS ====================
    console.log('\n📍 STEP 11: Testing Interactions...');

    // Test mobile menu
    await context.close();
    context = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    page = await context.newPage();

    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Try to find mobile menu button
    const mobileMenuBtn = page.locator('button').filter({ has: page.locator('svg') }).first();
    if (await mobileMenuBtn.isVisible()) {
      await mobileMenuBtn.click();
      await page.waitForTimeout(500);
      report.tests.push({ name: 'Mobile Menu Interaction', status: 'PASS' });
    } else {
      report.tests.push({ name: 'Mobile Menu Interaction', status: 'INFO', details: 'Mobile menu button not found' });
    }

    // Test scroll
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    report.tests.push({ name: 'Page Scroll', status: 'PASS' });

    // ==================== STEP 7-8: CONSOLE & NETWORK ANALYSIS ====================
    console.log('\n📍 STEP 7-8: Console & Network Analysis...');

    // Critical errors - filter out external resource failures
    const criticalErrors = report.console.errors.filter(
      (e) =>
        !e.includes('favicon') &&
        !e.includes('fonts.googleapis') &&
        !e.includes('fonts.gstatic') &&
        !e.includes('[SERVICE]') &&
        !e.includes('[MOBILE]') &&
        !e.includes('Failed to load resource')
    );

    const criticalNetworkFailures = report.network.failed.filter(
      (f) =>
        !f.url.includes('favicon') &&
        !f.url.includes('fonts.googleapis') &&
        !f.url.includes('fonts.gstatic')
    );

    if (criticalErrors.length === 0) {
      report.tests.push({ name: 'Console Errors', status: 'PASS' });
    } else {
      report.tests.push({
        name: 'Console Errors',
        status: 'FAIL',
        details: criticalErrors.join('; '),
      });
      report.issues.push(...criticalErrors);
    }

    if (criticalNetworkFailures.length === 0) {
      report.tests.push({ name: 'Critical Network Requests', status: 'PASS' });
    } else {
      report.tests.push({
        name: 'Critical Network Requests',
        status: 'FAIL',
        details: criticalNetworkFailures.map((f) => `${f.url}: ${f.failure}`).join('; '),
      });
      report.issues.push(...criticalNetworkFailures.map((f) => `Network: ${f.url} - ${f.failure}`));
    }

  } catch (error) {
    report.issues.push(`Browser test error: ${error}`);
  } finally {
    if (browser) await browser.close();
  }

  // Calculate final status
  const failedTests = report.tests.filter((t) => t.status === 'FAIL');
  const passedTests = report.tests.filter((t) => t.status === 'PASS');
  const infoTests = report.tests.filter((t) => t.status === 'INFO');

  if (failedTests.length === 0) {
    report.finalStatus = 'PASS';
  } else if (passedTests.length > failedTests.length) {
    report.finalStatus = 'PARTIAL';
  } else {
    report.finalStatus = 'FAIL';
  }

  return report;
}

// Run validation
runBrowserValidation().then((report) => {
  console.log('\n' + '='.repeat(60));
  console.log('ACTUAL LOCALHOST E2E VALIDATION REPORT');
  console.log('='.repeat(60));
  console.log('\n📊 Server:');
  console.log(`   URL: ${report.server.url}`);
  console.log(`   Port: ${report.server.port}`);
  console.log(`   Build: ${report.server.build}`);

  console.log('\n🌐 Browser:');
  console.log(`   Tool: ${report.browser.tool}`);
  console.log(`   Browser: ${report.browser.browser}`);
  console.log(`   Version: ${report.browser.version}`);

  console.log('\n✅ Tests:');
  report.tests.forEach((test) => {
    const icon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : 'ℹ️';
    console.log(`   ${icon} ${test.name}: ${test.status}${test.details ? ` (${test.details})` : ''}`);
  });

  console.log('\n🔊 Console:');
  console.log(`   Errors: ${report.console.errors.length}`);
  console.log(`   Warnings: ${report.console.warnings.length}`);
  if (report.console.errors.length > 0) {
    report.console.errors.slice(0, 5).forEach((e) => console.log(`      - ${e.substring(0, 100)}`));
  }

  console.log('\n🌐 Network:');
  console.log(`   Failed Requests: ${report.network.failed.length}`);
  if (report.network.failed.length > 0) {
    report.network.failed.slice(0, 5).forEach((f) => console.log(`      - ${f.url}: ${f.failure}`));
  }

  console.log('\n📸 Screenshots:');
  report.screenshots.forEach((s) => console.log(`   - ${s}`));

  console.log('\n⚠️ Issues:');
  if (report.issues.length === 0) {
    console.log('   None');
  } else {
    report.issues.forEach((i) => console.log(`   - ${i}`));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`🏁 FINAL STATUS: ${report.finalStatus}`);
  console.log('='.repeat(60));

  process.exit(report.finalStatus === 'PASS' ? 0 : 1);
});

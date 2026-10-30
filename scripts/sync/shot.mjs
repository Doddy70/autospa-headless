import { chromium } from '@playwright/test';

const targets = process.argv.slice(2);
const browser = await chromium.launch();

for (const target of targets) {
  const [path, name] = target.split('::');
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  const response = await page.goto(`http://localhost:3200${path}`, {
    waitUntil: 'networkidle',
    timeout: 60000,
  });

  // The app wraps every page in a Framer Motion transition that starts at
  // `opacity: 0`. Screenshotting before it settles captures a black frame,
  // so wait for the wrapper to become visible.
  await page
    .waitForFunction(
      () => {
        const wrapper = document.querySelector('main > div');
        return !wrapper || Number(getComputedStyle(wrapper).opacity) > 0.99;
      },
      { timeout: 15000 },
    )
    .catch(() => console.log('  (warning: the page transition did not settle)'));

  await page.screenshot({
    path: `.cache/screenshots/${name}.png`,
    fullPage: false,
    // Playwright hides the caret by injecting `caret-color: transparent`
    // into the page. That mutation happens after the server-rendered HTML
    // was produced, so React reports a hydration mismatch on every input
    // even though the application is fine. Keeping the caret as it is
    // avoids the false positive.
    caret: 'initial',
  });

  const height = await page.evaluate(() => document.body.scrollHeight);
  console.log(`${response?.status()} ${path} -> .cache/screenshots/${name}.png (page height ${height}px)`);
  if (errors.length) {
    console.log(`  ${errors.length} console/page errors:`);
    for (const error of errors.slice(0, 8)) console.log('   - ' + error.slice(0, 220));
  }
  await page.close();
}

await browser.close();

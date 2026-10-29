import { chromium } from '@playwright/test';

const path = process.argv[2] ?? '/faq';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const failed = [];
page.on('requestfailed', (request) => failed.push(request.url()));
const consoleErrors = [];
page.on('pageerror', (error) => consoleErrors.push(String(error)));
page.on('console', (message) => {
  if (message.type() === 'error') {
    const location = message.location();
    consoleErrors.push(`${message.text()} @ ${location.url ?? 'inline'}:${location.lineNumber ?? 0}`);
  }
});

await page.goto(`http://localhost:3100${path}`, { waitUntil: 'networkidle', timeout: 60000 });

const report = await page.evaluate(() => {
  const style = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const computed = getComputedStyle(element);
    return {
      selector,
      fontSize: computed.fontSize,
      color: computed.color,
      display: computed.display,
      width: Math.round(element.getBoundingClientRect().width),
    };
  };

  return {
    stylesheets: document.styleSheets.length,
    elementorContainers: document.querySelectorAll('.e-con').length,
    widgets: document.querySelectorAll('[data-widget_type]').length,
    headings: document.querySelectorAll('h1,h2,h3').length,
    images: document.images.length,
    brokenImages: [...document.images]
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src)
      .slice(0, 10),
    samples: [
      style('.elementor-heading-title'),
      style('h1'),
      style('.e-con'),
      style('body'),
    ],
    jQuery: typeof window.jQuery,
    elementorFrontend: typeof window.elementorFrontend,
  };
});

console.log(JSON.stringify(report, null, 2));
console.log('\nfailed requests:', failed.length);
for (const url of failed.slice(0, 10)) console.log('  - ' + url);
console.log('\nconsole/page errors:', consoleErrors.length);
for (const error of consoleErrors.slice(0, 10)) console.log('  - ' + error.slice(0, 300));

await browser.close();

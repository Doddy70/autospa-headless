import { chromium } from '@playwright/test';

const BASE = 'http://localhost:3100';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
p.setDefaultTimeout(180000);
p.setDefaultNavigationTimeout(180000);

const count = () => p.locator('[role="dialog"]').count();

// 1. The homepage opens the popout.
await p.goto(BASE, { waitUntil: 'domcontentloaded' });
await p.waitForSelector('[role="dialog"]', { timeout: 90000 });
console.log('homepage -> popout:', await count());
console.log('card is white:', await p.evaluate(() => {
	const card = document.querySelector('[role="dialog"] > div');
	return getComputedStyle(card).backgroundColor;
}));
console.log('card max width:', await p.evaluate(() => {
	const card = document.querySelector('[role="dialog"] > div');
	return getComputedStyle(card).maxWidth;
}));

// 2. It does not open on an inner page.
await ctx.addInitScript(() => sessionStorage.clear());
await p.goto(`${BASE}/blog`, { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(9000);
console.log('/blog -> popout:', await count());

// 3. It closes when the visitor navigates away from the homepage.
await ctx.addInitScript(() => sessionStorage.clear());
await p.goto(BASE, { waitUntil: 'domcontentloaded' });
await p.waitForSelector('[role="dialog"]', { timeout: 90000 });
await p.click('a[href="/blog"]').catch(() => {});
await p.waitForTimeout(4000);
console.log('after navigating to /blog -> popout:', await count());
console.log('body unlocked:', await p.evaluate(() => getComputedStyle(document.body).overflow));

// 4. The bell on an inner page does not open it.
await p.click('[data-testid="popup-toggle"]').catch(() => {});
await p.waitForTimeout(1200);
console.log('bell on /blog -> popout:', await count());

// 5. Back on the homepage the bell opens it.
await p.goto(BASE, { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(9000);
console.log('homepage again -> popout:', await count());

await b.close();

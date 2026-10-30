import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'http://localhost:3300';
const b = await chromium.launch();

async function shot(viewport, file) {
	const ctx = await b.newContext({ viewport, deviceScaleFactor: 2 });
	const p = await ctx.newPage();
	p.setDefaultTimeout(120000);
	p.setDefaultNavigationTimeout(120000);
	await p.goto(BASE, { waitUntil: 'domcontentloaded' });
	await p.waitForTimeout(6000);

	// The footer and the copyright bar are two siblings.
	const wrap = p.locator('footer').locator('..');
	await wrap.scrollIntoViewIfNeeded();
	await p.waitForTimeout(1500);
	await wrap.screenshot({ path: file });

	const info = await p.evaluate(() => {
		const big = document.querySelector('.footer-big-text');
		const f = document.querySelector('footer');
		return {
			bigText: big
				? {
						text: big.textContent,
						fontSize: getComputedStyle(big).fontSize,
						w: Math.round(big.getBoundingClientRect().width),
						h: Math.round(big.getBoundingClientRect().height),
						overflow: big.scrollWidth > window.innerWidth,
					}
				: null,
			footerWidth: f ? Math.round(f.getBoundingClientRect().width) : null,
			docOverflow: document.documentElement.scrollWidth > window.innerWidth,
		};
	});

	console.log(JSON.stringify(info, null, 2));
	await ctx.close();
}

await shot({ width: 1440, height: 1000 }, '.remember/logs/footer-desktop.png');
await shot({ width: 390, height: 844 }, '.remember/logs/footer-mobile.png');

await b.close();

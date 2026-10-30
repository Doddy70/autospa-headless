import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'https://autospajakarta.com';
const b = await chromium.launch();

for (const vp of [
	{ width: 1440, height: 900 },
	{ width: 390, height: 844 },
]) {
	const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1 });
	const p = await ctx.newPage();
	p.setDefaultTimeout(120000);
	const errors = [];
	p.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
	p.on('console', (m) => {
		if (m.type() === 'error') errors.push(m.text().slice(0, 160));
	});
	const failed = [];
	p.on('requestfailed', (r) => failed.push(`${r.url().slice(-70)} ${r.failure()?.errorText}`));

	await p.goto(`${BASE}/about`, { waitUntil: 'domcontentloaded' });
	await p.waitForTimeout(6000);

	const info = await p.evaluate(() => {
		const header = document.querySelector('[data-testid="site-header"]');
		const nav = header?.querySelector('nav');
		const links = nav
			? [...nav.querySelectorAll('a')].map((a) => ({
				t: a.textContent?.trim().slice(0, 22),
				r: (() => {
					const b = a.getBoundingClientRect();
					return `${Math.round(b.x)},${Math.round(b.y)} ${Math.round(b.width)}x${Math.round(b.height)}`;
				})(),
			}))
			: [];
		return {
			h1: [...document.querySelectorAll('h1')].map((h) => h.textContent?.trim().slice(0, 60)),
			h2: [...document.querySelectorAll('h2')].map((h) => h.textContent?.trim().slice(0, 50)).slice(0, 8),
			headerRect: header
				? (() => {
						const r = header.getBoundingClientRect();
						return `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`;
					})()
				: 'none',
			navLinks: links,
			overflowX:
				document.documentElement.scrollWidth - document.documentElement.clientWidth,
			pageHeight: document.body.scrollHeight,
			brokenImages: [...document.images]
				.filter((i) => i.complete && i.naturalWidth === 0)
				.map((i) => (i.currentSrc || i.src).slice(-70)),
			econCount: document.querySelectorAll('.e-con').length,
		};
	});
	console.log(`--- ${vp.width}px ---`);
	console.log(JSON.stringify(info, null, 1));
	console.log('errors:', errors.length, errors.slice(0, 4));
	console.log('failed:', failed.length, failed.slice(0, 4));

	await p.screenshot({ path: `.cache/about-${vp.width}-top.png` });
	await p.screenshot({ path: `.cache/about-${vp.width}-full.png`, fullPage: true });
	await ctx.close();
}

await b.close();

import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'http://localhost:3200';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
p.setDefaultTimeout(120000);
await p.goto(BASE, { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(3000);

const measure = await p.evaluate(() => {
	const el = document.querySelector('.footer-big-text');
	if (!el) return null;
	const cs = getComputedStyle(el);

	// The width of the whole wordmark on one line.
	const previous = el.style.whiteSpace;
	el.style.whiteSpace = 'nowrap';
	const range = document.createRange();
	range.selectNodeContents(el);
	const oneLine = range.getBoundingClientRect().width;
	el.style.whiteSpace = previous;

	const fontSize = parseFloat(cs.fontSize);
	const factor = oneLine / fontSize;

	// The size that fits the box of the footer on the viewports.
	const sizes = [1920, 1600, 1440, 1280, 1024, 768, 480, 390, 320].map((width) => {
		const padding = 48; // px-6 on both sides of the copyright bar
		const container = Math.min(width, 1536) - padding;
		return { width, fits: Math.round(container / factor) };
	});

	return {
		fontSize: cs.fontSize,
		oneLineWidth: Math.round(oneLine),
		factor: Number(factor.toFixed(3)),
		sizes,
	};
});

console.log(JSON.stringify(measure, null, 2));
await b.close();

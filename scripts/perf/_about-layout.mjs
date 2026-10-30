import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'https://autospajakarta.com';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
p.setDefaultTimeout(120000);
await p.goto(`${BASE}/about`, { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(6000);

const data = await p.evaluate(() => {
	const header = document.querySelector('[data-testid="site-header"]');
	const headerBox = header?.getBoundingClientRect();

	// The boxes of the top level Elementor containers.
	const cons = [...document.querySelectorAll('.e-con')].map((el) => {
		const r = el.getBoundingClientRect();
		const cs = getComputedStyle(el);
		return {
			id: el.getAttribute('data-id'),
			y: Math.round(r.y + window.scrollY),
			h: Math.round(r.height),
			w: Math.round(r.width),
			x: Math.round(r.x),
			bg: cs.backgroundColor,
			pos: cs.position,
			children: el.children.length,
		};
	});

	// What overlaps the header band (top 72px)?
	const overlapping = [];
	for (const el of document.querySelectorAll('.e-con, .elementor-widget-container, h1, h2, h3, img')) {
		const r = el.getBoundingClientRect();
		if (r.height === 0 || r.width === 0) continue;
		if (r.top < 72 && r.bottom > 0) {
			overlapping.push({
				tag: el.tagName,
				cls: String(el.className).slice(0, 60),
				top: Math.round(r.top),
				left: Math.round(r.left),
				w: Math.round(r.width),
				h: Math.round(r.height),
				text: (el.textContent || '').trim().slice(0, 40),
			});
		}
	}

	// The typography of the page.
	const style = (sel) => {
		const el = document.querySelector(sel);
		if (!el) return null;
		const cs = getComputedStyle(el);
		return {
			sel,
			font: `${cs.fontFamily.slice(0, 40)} ${cs.fontSize}/${cs.lineHeight}`,
			weight: cs.fontWeight,
			color: cs.color,
			transform: cs.textTransform,
			letterSpacing: cs.letterSpacing,
		};
	};

	return {
		headerBox: headerBox
			? `${Math.round(headerBox.x)},${Math.round(headerBox.y)} ${Math.round(headerBox.width)}x${Math.round(headerBox.height)}`
			: 'none',
		headerPosition: header ? getComputedStyle(header).position : 'none',
		headerBg: header ? getComputedStyle(header).backgroundColor : 'none',
		cons: cons.slice(0, 24),
		overlapping: overlapping.slice(0, 14),
		typography: [
			style('.elementor-729 h2'),
			style('.elementor-729 h3'),
			style('.elementor-729 p'),
			style('.elementor-729 a'),
		],
		bodyBg: getComputedStyle(document.body).backgroundColor,
		wpPageBg: (() => {
			const el = document.querySelector('.wp-page');
			return el ? getComputedStyle(el).backgroundColor : 'none';
		})(),
	};
});

console.log(JSON.stringify(data, null, 1));
await b.close();

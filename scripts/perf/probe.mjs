/**
 * Performance probe - measures the Core Web Vitals of the running server.
 *
 * Usage: node scripts/perf/probe.mjs [baseUrl] [path ...]
 *
 * Cold cache per path (a fresh context each time), throttled like a slow
 * 4G connection so the numbers are comparable between runs.
 */

import { chromium } from '@playwright/test';

const base = process.argv[2] ?? 'http://localhost:3200';
const paths = process.argv.slice(3).length ? process.argv.slice(3) : ['/'];

const browser = await chromium.launch();

for (const path of paths) {
	const context = await browser.newContext({
		viewport: { width: 1440, height: 900 },
	});

	// Emulate a mid-range phone on a slow connection.
	const page = await context.newPage();
	const client = await context.newCDPSession(page);
	await client.send('Network.emulateNetworkConditions', {
		offline: false,
		latency: 150,
		downloadThroughput: (1.6 * 1024 * 1024) / 8,
		uploadThroughput: (750 * 1024) / 8,
	});
	await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

	const requests = [];
	page.on('response', async (response) => {
		const request = response.request();
		let size = 0;
		try {
			size = (await response.body()).length;
		} catch {
			/* body not available for redirects */
		}
		requests.push({
			url: response.url(),
			type: request.resourceType(),
			status: response.status(),
			size,
		});
	});

	const pageErrors = [];
	page.on('pageerror', (error) => pageErrors.push(String(error)));

	await page.addInitScript(() => {
		window.__vitals = { lcp: 0, cls: 0, longTasks: 0, longTaskTime: 0 };

		new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				window.__vitals.lcp = entry.startTime;
			}
		}).observe({ type: 'largest-contentful-paint', buffered: true });

		new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				if (!entry.hadRecentInput) window.__vitals.cls += entry.value;
			}
		}).observe({ type: 'layout-shift', buffered: true });

		new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				window.__vitals.longTasks += 1;
				window.__vitals.longTaskTime += entry.duration;
			}
		}).observe({ type: 'longtask', buffered: true });
	});

	const started = Date.now();
	await page.goto(`${base}${path}`, { waitUntil: 'load', timeout: 120000 });
	const wallClock = Date.now() - started;

	// Give LCP a moment to settle.
	await page.waitForTimeout(2500);

	const vitals = await page.evaluate(() => {
		const nav = performance.getEntriesByType('navigation')[0];
		const paint = performance.getEntriesByType('paint');
		const fcp = paint.find((p) => p.name === 'first-contentful-paint');

		return {
			fcp: Math.round(fcp ? fcp.startTime : 0),
			lcp: Math.round(window.__vitals.lcp),
			cls: Number(window.__vitals.cls.toFixed(3)),
			longTasks: window.__vitals.longTasks,
			longTaskTime: Math.round(window.__vitals.longTaskTime),
			ttfb: Math.round(nav.responseStart),
			dcl: Math.round(nav.domContentLoadedEventEnd),
			load: Math.round(nav.loadEventEnd),
			domNodes: document.querySelectorAll('*').length,
			images: document.images.length,
			transferKB: Math.round(
				performance
					.getEntriesByType('resource')
					.reduce((sum, r) => sum + (r.transferSize || 0), 0) / 1024
			),
		};
	});

	const byType = {};
	for (const request of requests) {
		byType[request.type] = byType[request.type] ?? { count: 0, kb: 0 };
		byType[request.type].count += 1;
		byType[request.type].kb += Math.round(request.size / 1024);
	}

	const biggest = requests
		.slice()
		.sort((a, b) => b.size - a.size)
		.slice(0, 8)
		.map((r) => `${Math.round(r.size / 1024)}kb ${r.type} ${r.url.split('/').pop()?.slice(0, 60)}`);

	console.log(`\n=== ${path} (${base})`);
	console.log(
		`FCP ${vitals.fcp}ms | LCP ${vitals.lcp}ms | CLS ${vitals.cls} | TTFB ${vitals.ttfb}ms | DCL ${vitals.dcl}ms | load ${vitals.load}ms | wall ${wallClock}ms`
	);
	console.log(
		`long tasks ${vitals.longTasks} (${vitals.longTaskTime}ms) | DOM nodes ${vitals.domNodes} | images ${vitals.images} | transfer ${vitals.transferKB}kb`
	);
	console.log(
		'by type: ' +
			Object.entries(byType)
				.map(([type, v]) => `${type} ${v.count}/${v.kb}kb`)
				.join(', ')
	);
	console.log('biggest:\n  ' + biggest.join('\n  '));
	if (pageErrors.length) console.log('PAGE ERRORS: ' + pageErrors.slice(0, 3).join(' | '));

	await context.close();
}

await browser.close();

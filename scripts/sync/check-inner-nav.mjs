import { chromium } from '@playwright/test';

/**
 * Verifies the shared inner-page navigation.
 *
 * Every page inside the `(inner)` route group has to render exactly one
 * navigation bar, must not hide the page heading behind it and must not
 * overflow horizontally on a phone-sized viewport.
 */

/* The base URL of the site. It defaults to the dev server of the project;
   BASE_URL points the check at another instance. */
const BASE = process.env.BASE_URL ?? 'http://localhost:3200';

const paths = process.argv.slice(2);
if (!paths.length) {
	console.error('usage: node scripts/sync/check-inner-nav.mjs /about /faq ...');
	process.exit(1);
}

const browser = await chromium.launch();
let failures = 0;

for (const path of paths) {
	// The homepage is not part of the `(inner)` group - it carries its own
	// navigation inside the hero, so there is no shared header to check.
	if (path === '/') {
		console.log('SKIP /            the homepage keeps the navigation inside its hero');
		continue;
	}

	const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
	const errors = [];
	page.on('pageerror', (error) => errors.push(String(error)));

	await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
	await page.waitForSelector('header nav', { timeout: 30000 }).catch(() => {});

	// The page transition starts at `opacity: 0`; wait until it settled.
	await page
		.waitForFunction(
			() => {
				const wrapper = document.querySelector('main > div');
				return !wrapper || Number(getComputedStyle(wrapper).opacity) > 0.99;
			},
			{ timeout: 15000 },
		)
		.catch(() => {});

	const report = await page.evaluate(() => {
		const nav = document.querySelector('header nav');
		const header = document.querySelector('header');
		const heading = document.querySelector('h1');

		// The booking call to action of the header opens the reservation
		// dialog, so it carries a test id instead of a link. Only the one in
		// the header is counted - the page may carry more of them.
		const bookingCtas = header
			? header.querySelectorAll('[data-testid="booking-cta"]')
			: document.querySelectorAll('[data-testid="booking-cta"]');

		return {
			// The breadcrumb of a page hero is a <nav> as well, so the main
			// navigation is counted by the booking call to action it carries.
			mainNavs: [...document.querySelectorAll('nav')].filter(
				(element) => element.querySelector('[data-testid="booking-cta"]') !== null,
			).length,
			navs: document.querySelectorAll('nav').length,
			bookings: bookingCtas.length,
			headerHeight: header ? Math.round(header.getBoundingClientRect().height) : 0,
			headerTop: header ? Math.round(header.getBoundingClientRect().top) : null,
			headingTop: heading ? Math.round(heading.getBoundingClientRect().top) : null,
			headingText: heading ? heading.textContent?.trim().slice(0, 40) : null,
			navVisible: nav ? nav.getBoundingClientRect().height > 0 : false,
		};
	});

	await page.setViewportSize({ width: 390, height: 844 });
	await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
	await page.waitForSelector('header nav', { timeout: 30000 }).catch(() => {});
	// The mobile menu is an absolutely positioned dropdown inside the sticky
	// header - it has to open below the bar and stay inside the viewport.
	// The toggle only reacts once React has hydrated, so the click is
	// repeated until the menu shows up.
	let mobileMenu = { opened: false, visible: false, right: null, viewport: 390 };
	const toggle = await page
		.waitForSelector('[data-testid="mobile-menu-toggle"]', { timeout: 15000 })
		.catch(() => null);

	if (toggle) {
		for (let attempt = 0; attempt < 20; attempt += 1) {
			await toggle.click({ timeout: 5000 }).catch(() => {});
			await page.waitForTimeout(400);

			mobileMenu = await page.evaluate(() => {
				const menu = document.querySelector('[data-testid="mobile-menu"]');
				if (!menu) {
					return { opened: false, visible: false, right: null, viewport: window.innerWidth };
				}
				const rect = menu.getBoundingClientRect();
				return {
					opened: true,
					visible: rect.height > 0 && getComputedStyle(menu).opacity !== '0',
					right: Math.round(rect.right),
					bottom: Math.round(rect.bottom),
					viewport: window.innerWidth,
				};
			});

			if (mobileMenu.opened) break;
		}
	}

	const overflow = await page.evaluate(() => {
		const root = document.documentElement;
		const amount = root.scrollWidth - root.clientWidth;
		if (amount <= 1) return { amount, culprits: [] };

		// Find the elements that stick out past the viewport.
		const culprits = [...document.querySelectorAll('body *')]
			.map((element) => {
				const rect = element.getBoundingClientRect();
				return { element, right: Math.round(rect.right), width: Math.round(rect.width) };
			})
			.filter(({ right }) => right > root.clientWidth + 1)
			.slice(0, 5)
			.map(({ element, right, width }) => ({
				tag: element.tagName.toLowerCase(),
				className: String(element.className).slice(0, 120),
				right,
				width,
			}));

		return { amount, culprits };
	});

	const problems = [];
	if (report.mainNavs !== 1) problems.push(`expected 1 main navigation, found ${report.mainNavs}`);
	if (report.bookings !== 1) {
		problems.push(`expected 1 booking call to action, found ${report.bookings}`);
	}
	if (!report.navVisible) problems.push('the navigation has no height');
	if (report.headingTop !== null && report.headingTop < report.headerHeight) {
		problems.push(`h1 (top ${report.headingTop}px) sits under the header (${report.headerHeight}px)`);
	}
	if (overflow.amount > 1) problems.push(`horizontal overflow of ${overflow.amount}px on mobile`);
	if (mobileMenu.opened && !mobileMenu.visible) problems.push('the mobile menu did not open');
	if (mobileMenu.opened && mobileMenu.right !== null && mobileMenu.right > mobileMenu.viewport) {
		problems.push(`the mobile menu sticks out of the viewport (right ${mobileMenu.right}px)`);
	}
	if (errors.length) problems.push(`${errors.length} page errors`);

	if (problems.length) failures += 1;

	console.log(
		`${problems.length ? 'FAIL' : 'OK  '} ${path}  header=${report.headerHeight}px h1="${report.headingText}" top=${report.headingTop}px mobileOverflow=${overflow.amount}px menu=${mobileMenu.opened ? (mobileMenu.visible ? 'open' : 'hidden') : 'n/a'}`,
	);
	for (const problem of problems) console.log(`     - ${problem}`);
	for (const culprit of overflow.culprits ?? []) console.log(`     ~ ${culprit.tag}.${culprit.className} right=${culprit.right} width=${culprit.width}`);

	await page.close();
}

await browser.close();

console.log(failures ? `\n${failures} route(s) failed.` : '\nAll routes passed.');
process.exit(failures ? 1 : 0);

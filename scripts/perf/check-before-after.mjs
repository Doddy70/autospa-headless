import { chromium } from '@playwright/test';

/**
 * The before/after gallery check.
 *
 * It drives the comparison slider of `/before-after` in a real browser: the
 * drag of the divider with the mouse and with a finger, the click that
 * moves the divider, the keyboard, the cards of the slider, the arrows and
 * the dots of the carousel, the autoplay and the section on the homepage.
 *
 *   node scripts/perf/check-before-after.mjs [baseUrl]
 */

const BASE = process.argv[2] ?? 'http://localhost:3200';

let failures = 0;

function check(condition, message) {
	console.log(`${condition ? 'OK  ' : 'FAIL'} ${message}`);
	if (!condition) failures += 1;
}

/** The state of the divider of the card that is on screen. */
const sliderState = (page) =>
	page.evaluate(() => {
		// The card that is on screen - the other ones are inert.
		const scope =
			document.querySelector('[data-ba-slide]:not([inert])') ?? document.querySelector('[data-ba-frame]');
		const frame = scope?.querySelector('[data-ba-frame]') ?? scope;
		const after = scope?.querySelector('[data-ba-after]');
		const handle = scope?.querySelector('[data-ba-handle]');
		const clip = after ? getComputedStyle(after).clipPath : '';
		const match = /inset\(0px ([\d.]+)%/.exec(clip);
		return {
			clip,
			// The percentage of the frame that shows the photo from after the
			// work - the same number the divider stands at.
			after: match ? Number(match[1]) : null,
			before: match ? 100 - Number(match[1]) : null,
			role: handle?.getAttribute('role') ?? null,
			tabindex: handle?.getAttribute('tabindex') ?? null,
			value: handle?.getAttribute('aria-valuenow') ?? null,
			text: handle?.getAttribute('aria-valuetext') ?? null,
			frameWidth: frame ? Math.round(frame.getBoundingClientRect().width) : 0,
		};
	});

/** The cards that are on screen and the page the gallery is on. */
const carouselState = (page) =>
	page.evaluate(() => {
		const slides = [...document.querySelectorAll('[data-ba-slide]')];
		const shown = slides.filter((slide) => !slide.hasAttribute('inert'));
		const dots = [...document.querySelectorAll('[data-ba-dot]')];
		return {
			shown: shown.length,
			shownTitles: shown.map((slide) => slide.querySelector('[data-ba-title]')?.textContent ?? ''),
			slides: slides.length,
			dots: dots.length,
			activeDot: dots.findIndex((dot) => dot.getAttribute('aria-current') === 'true'),
			transform: document.querySelector('ul.flex')?.style.transform ?? null,
		};
	});

const run = async () => {
	const browser = await chromium.launch();
	const errors = [];

	const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
	const page = await context.newPage();

	page.setDefaultTimeout(180000);
	page.setDefaultNavigationTimeout(180000);
	page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
	page.on('console', (message) => {
		if (message.type() === 'error') errors.push(message.text());
	});

	/* --- The page --- */
	const response = await page.goto(`${BASE}/before-after`, { waitUntil: 'domcontentloaded' });
	check(response?.status() === 200, 'the gallery page answers with 200');

	/* The gallery is a client component - the markup is on the server, but
	   the handlers only exist once React has hydrated the page. */
	await page.waitForLoadState('networkidle');
	await page.waitForTimeout(1000);

	check(
		(await page.locator('h1').first().textContent())?.includes('Before') ?? false,
		'the page carries the headline',
	);

	/* The gallery moves on its own - the pointer over it stops that, so the
	   checks below are not racing the autoplay. */
	await page.locator('[aria-roledescription="carousel"]').hover();
	await page.waitForTimeout(300);

	const carousel = await carouselState(page);
	check(carousel.slides === 10, `the gallery holds 10 pairs (found ${carousel.slides})`);
	check(carousel.shown === 3, `three cards stand next to each other (found ${carousel.shown})`);
	check(carousel.dots === 4, `the gallery has 4 pages (found ${carousel.dots})`);
	check(carousel.activeDot === 0, 'the first page is on screen');

	/* Every photo of the page has to be on the screen - a photo that waits
	   in the lazy loader of a card that stands outside the screen never
	   shows up. */
	const photos = await page.evaluate(() => {
		const slides = [...document.querySelectorAll('[data-ba-slide]:not([inert])')];
		const images = slides.flatMap((slide) => [...slide.querySelectorAll('img')]);
		return {
			total: images.length,
			loaded: images.filter((image) => image.complete && image.naturalWidth > 0).length,
		};
	});
	check(
		photos.total > 0 && photos.loaded === photos.total,
		`every photo of the page is on the screen (${photos.loaded}/${photos.total})`,
	);

	/* --- The divider --- */
	const initial = await sliderState(page);
	check(initial.role === 'slider', 'the divider is a slider for the screen readers');
	check(initial.tabindex === '0', 'the divider can be reached with the keyboard');
	check(initial.value === '50', `the divider starts in the middle (${initial.value})`);
	check(initial.before === 50 && initial.after === 50, 'the frame shows both photos equally');

	/* --- The drag with the mouse --- */
	// The frame has to be on screen - a mouse that is moved to a place
	// outside the viewport does not touch anything.
	const frameLocator = page.locator('[data-ba-slide]:not([inert]) [data-ba-frame]').first();
	await frameLocator.scrollIntoViewIfNeeded();
	const frame = await frameLocator.boundingBox();
	if (!frame) {
		check(false, 'the frame of the comparison is on screen');
	} else {
		const centreY = frame.y + frame.height / 2;
		await page.mouse.move(frame.x + frame.width / 2, centreY);
		await page.mouse.down();
		await page.mouse.move(frame.x + frame.width * 0.75, centreY, { steps: 12 });
		await page.mouse.up();
		await page.waitForTimeout(300);

		const dragged = await sliderState(page);
		check(
			dragged.after !== null && dragged.after < 40,
			`the drag moves the divider to the right (${dragged.after}% after)`,
		);
		check(
			Number(dragged.value) > 60,
			`the divider reports its new position (${dragged.value})`,
		);
		check(
			(dragged.text ?? '').includes('before'),
			'the divider explains its position to the screen readers',
		);
	}

	/* --- The click that moves the divider --- */
	if (frame) {
		await page.mouse.click(frame.x + frame.width * 0.25, frame.y + frame.height / 2);
		await page.waitForTimeout(300);

		const clicked = await sliderState(page);
		check(
			clicked.after !== null && clicked.after > 60,
			`the click moves the divider (${clicked.after}% after)`,
		);
	}

	/* --- The keyboard --- */
	await page.locator('[data-ba-slide]:not([inert]) [data-ba-handle]').first().focus();
	const beforeKeys = await sliderState(page);
	await page.keyboard.press('ArrowRight');
	await page.keyboard.press('ArrowRight');
	await page.waitForTimeout(200);

	const keyed = await sliderState(page);
	check(
		keyed.value !== null &&
			beforeKeys.value !== null &&
			Number(keyed.value) === Number(beforeKeys.value) + 10,
		`the arrow keys move the divider by two steps (${beforeKeys.value} -> ${keyed.value})`,
	);

	await page.keyboard.press('Home');
	await page.waitForTimeout(200);
	const home = await sliderState(page);
	check(home.after === 100, `the Home key moves the divider to the end (${home.after}% after)`);

	await page.keyboard.press('End');
	await page.waitForTimeout(200);
	const end = await sliderState(page);
	check(end.after === 0, `the End key moves the divider to the start (${end.after}% after)`);

	/* --- The cards of the slider --- */
	await page.locator('[aria-label="Next photo"]').click();
	await page.waitForTimeout(800);

	const next = await carouselState(page);
	check(next.activeDot === 1, `the arrow moves to the next page (page ${next.activeDot + 1})`);
	check(next.shown === 3, `the next page holds three cards (found ${next.shown})`);
	check(
		next.shownTitles[0] !== carousel.shownTitles[0],
		`the next page shows other work (${next.shownTitles.join(', ')})`,
	);

	const reset = await sliderState(page);
	check(reset.value === '50', `the divider starts over on the new page (${reset.value})`);

	await page.locator('[data-ba-dot]').nth(3).click();
	await page.waitForTimeout(800);
	const jumped = await carouselState(page);
	check(jumped.activeDot === 3, `a dot jumps to its page (page ${jumped.activeDot + 1})`);
	check(jumped.shown === 1, `the last page holds the rest of the gallery (found ${jumped.shown})`);

	/* --- The autoplay --- */
	await page.mouse.move(5, 5);
	await page.waitForTimeout(7000);
	const played = await carouselState(page);
	check(played.activeDot !== 3, `the gallery moves on its own (page ${played.activeDot + 1})`);

	/* --- The homepage --- */
	await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
	await page.waitForLoadState('networkidle');
	await page.waitForTimeout(1000);

	check(
		(await page.locator('[data-ba-frame]').count()) > 0,
		'the homepage carries the before and after section',
	);
	check(
		(await page.locator('a[href="/before-after"]').count()) > 0,
		'the homepage links to the full gallery',
	);

	/* --- The finger --- */
	const mobile = await browser.newContext({
		viewport: { width: 390, height: 844 },
		hasTouch: true,
		isMobile: true,
	});
	const touchPage = await mobile.newPage();
	touchPage.setDefaultTimeout(180000);
	await touchPage.goto(`${BASE}/before-after`, { waitUntil: 'domcontentloaded' });
	await touchPage.waitForLoadState('networkidle');
	await touchPage.waitForTimeout(1000);

	const touchState = await carouselState(touchPage);
	check(touchState.shown === 1, `one card stands on a phone (found ${touchState.shown})`);

	const touchLocator = touchPage
		.locator('[data-ba-slide]:not([inert]) [data-ba-frame]')
		.first();
	await touchLocator.scrollIntoViewIfNeeded();
	const touchFrame = await touchLocator.boundingBox();
	if (!touchFrame) {
		check(false, 'the frame of the comparison is on screen on a phone');
	} else {
		const y = touchFrame.y + touchFrame.height / 2;
		await touchPage.touchscreen.tap(touchFrame.x + touchFrame.width / 2, y);
		await touchPage.waitForTimeout(200);

		const touched = await sliderState(touchPage);
		check(touched.after !== null, 'the phone moves the divider');
	}

	check(errors.length === 0, `the page is free of errors${errors.length ? `: ${errors[0]}` : ''}`);

	await browser.close();

	console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`}`);
	process.exit(failures === 0 ? 0 : 1);
};

run().catch((error) => {
	console.error(error);
	process.exit(1);
});

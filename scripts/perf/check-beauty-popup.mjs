import { chromium, devices } from '@playwright/test';

const BASE = 'http://localhost:3100';

const run = async () => {
	const browser = await chromium.launch();
	const errors = [];

	const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
	const page = await ctx.newPage();

	// The dev server compiles slowly; the timeouts have to be generous.
	page.setDefaultTimeout(180000);
	page.setDefaultNavigationTimeout(180000);
	page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
	page.on('console', (m) => {
		if (m.type() === 'error') errors.push(m.text());
	});

	await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 180000 });
	await page.waitForSelector('[role="dialog"]', { timeout: 20000 });

	/* --- The layout must not move when the scroll gets locked --- */
	const shift = await page.evaluate(() => {
		const main = document.querySelector('main');
		const before = main.getBoundingClientRect().left;
		return before;
	});
	console.log('main left before lock:', shift);

	/* --- Focus moves into the dialog --- */
	console.log(
		'focused element:',
		await page.evaluate(() => {
			const el = document.activeElement;
			return `${el.tagName}.${el.className.split(' ')[0]}[${el.getAttribute('name') ?? ''}]`;
		}),
	);

	/* --- The page behind the dialog is inert --- */
	console.log(
		'body children inert:',
		await page.evaluate(() =>
			Array.from(document.body.children).map(
				(c) =>
					`${c.tagName}${c.hasAttribute('inert') ? '[inert]' : ''}${
						c.getAttribute('role') === 'dialog' ? '[dialog]' : ''
					}`,
			),
		),
	);

	/* --- The tab stays inside the dialog --- */
	const trail = [];

	for (let i = 0; i < 8; i += 1) {
		await page.keyboard.press('Tab');
		trail.push(
			await page.evaluate(() => {
				const el = document.activeElement;
				return `${el.tagName}[${el.getAttribute('name') ?? el.getAttribute('aria-label') ?? ''}]`;
			}),
		);
	}
	console.log('tab trail:', trail.join(' -> '));

	// And backwards.
	await page.keyboard.down('Shift');
	await page.keyboard.press('Tab');
	await page.keyboard.up('Shift');
	console.log(
		'shift+tab:',
		await page.evaluate(() => {
			const el = document.activeElement;
			return `${el.tagName}[${el.getAttribute('name') ?? el.getAttribute('aria-label') ?? ''}]`;
		}),
	);

	/* --- The scroll is locked --- */
	console.log(
		'body overflow:',
		await page.evaluate(() => getComputedStyle(document.body).overflow),
		'| padding-right:',
		await page.evaluate(() => document.body.style.paddingRight),
	);

	// A real wheel gesture must not move the page behind the dialog.
	await page.mouse.move(700, 400);
	await page.mouse.wheel(0, 800);
	await page.waitForTimeout(600);
	console.log(
		'wheel scroll behind the dialog -> scrollY:',
		await page.evaluate(() => window.scrollY),
	);

	/* --- The popout is never closed on its own --- */
	await page.keyboard.press('Escape');
	await page.waitForTimeout(700);
	console.log('still open after escape:', await page.locator('[role="dialog"]').count());

	// A click on the backdrop does not close it either.
	await page.mouse.click(20, 20);
	await page.waitForTimeout(700);
	console.log('still open after backdrop click:', await page.locator('[role="dialog"]').count());

	// Only the X closes it.
	await page.click('button[aria-label="Tutup popup"]');
	await page.waitForTimeout(900);
	console.log('closed by the X:', (await page.locator('[role="dialog"]').count()) === 0);
	console.log(
		'inert cleaned up:',
		await page.evaluate(
			() => !Array.from(document.body.children).some((c) => c.hasAttribute('inert')),
		),
	);
	console.log(
		'focus restored to:',
		await page.evaluate(() => document.activeElement.tagName),
	);
	console.log(
		'body overflow after close:',
		await page.evaluate(() => getComputedStyle(document.body).overflow),
	);

	console.log('console errors:', errors.length ? errors.slice(0, 5) : 'none');

	/* --- The form hands the details to WhatsApp --- */
	// The X above dismissed the popout for the session.
	await page.evaluate(() => sessionStorage.clear());
	await page.reload({ waitUntil: 'domcontentloaded' });
	await page.waitForSelector('[role="dialog"]', { timeout: 20000 });

	await page.fill('[name="name"]', 'Budi Santoso');
	await page.fill('[name="phone"]', '08123456789');
	await page.fill('[name="vehicle"]', 'Honda Civic RS');
	await page.selectOption('[name="branch"]', { label: 'Autospa Pluit' });

	const [wa] = await Promise.all([
		page.waitForEvent('popup', { timeout: 15000 }),
		page.click('button[type="submit"]'),
	]);
	const waUrl = wa.url();
	await wa.close();
	console.log('wa url:', decodeURIComponent(waUrl));
	console.log(
		'success state:',
		await page.locator('text=Lanjutkan di WhatsApp').isVisible(),
	);

	// The popout belongs to the homepage: it opens again on every load.
	await page.reload({ waitUntil: 'domcontentloaded' });
	await page.waitForTimeout(12000);
	console.log('reopened after submit:', await page.locator('[role="dialog"]').count());

	/* --- Level 2: the switch of the visitor --- */
	// The bell switches the popout off completely; the choice survives a
	// reload.
	await page.evaluate(() => {
		localStorage.removeItem('autospa:popup-enabled');
		sessionStorage.clear();
	});
	await page.reload({ waitUntil: 'domcontentloaded' });
	await page.waitForSelector('[role="dialog"]', { timeout: 20000 });
	await page.click('button[aria-label="Tutup popup"]');
	await page.waitForTimeout(900);

	await page.click('[data-testid="popup-toggle"]');
	await page.waitForTimeout(400);
	console.log(
		'toggle after closing:',
		await page.getAttribute('[data-testid="popup-toggle"]', 'data-state'),
	);
	await page.click('[data-testid="popup-toggle"]');
	await page.waitForTimeout(400);
	console.log(
		'toggle after switching off:',
		await page.getAttribute('[data-testid="popup-toggle"]', 'data-state'),
	);

	await page.reload({ waitUntil: 'domcontentloaded' });
	await page.waitForTimeout(12000);
	console.log('popout after the visitor switched it off:', await page.locator('[role="dialog"]').count());
	console.log(
		'localStorage:',
		await page.evaluate(() => localStorage.getItem('autospa:popup-enabled')),
	);

	// The mobile menu carries the same switch.
	await page.setViewportSize({ width: 390, height: 844 });
	await page.click('[data-testid="mobile-menu-toggle"]');
	await page.waitForTimeout(700);
	console.log('mobile switch visible:', await page.locator('[data-testid="popup-switch"]').isVisible());
	await page.click('[data-testid="popup-switch"]');
	await page.waitForTimeout(400);
	console.log(
		'mobile switch after click:',
		await page.getAttribute('[data-testid="popup-switch"]', 'aria-pressed'),
	);

	/* --- Level 3: ?popup=off for a single visit --- */
	await page.evaluate(() => {
		localStorage.removeItem('autospa:popup-enabled');
		sessionStorage.clear();
	});
	await page.goto(`${BASE}/?popup=off`, { waitUntil: 'domcontentloaded' });
	await page.waitForTimeout(12000);
	console.log('popout with ?popup=off:', await page.locator('[role="dialog"]').count());
	console.log(
		'toggle state with ?popup=off:',
		await page.getAttribute('[data-testid="popup-toggle"]', 'data-state'),
	);

	await page.goto(`${BASE}/?popup=on`, { waitUntil: 'domcontentloaded' });
	await page.waitForTimeout(12000);
	console.log('popout with ?popup=on:', await page.locator('[role="dialog"]').count());

	await ctx.close();

	/* --- Mobile --- */
	const mobile = await browser.newContext({ ...devices['iPhone 13'] });
	const mp = await mobile.newPage();
	await mp.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 180000 });
	await mp.waitForSelector('[role="dialog"]', { timeout: 20000 });
	console.log('mobile card box:', JSON.stringify(await mp.locator('[role="dialog"] > div').boundingBox()));
	console.log(
		'mobile submit reachable:',
		await mp.locator('button[type="submit"]').isVisible(),
	);
	await mp.screenshot({ path: '.remember/logs/beauty-popup-mobile.png' });
	await mobile.close();

	await browser.close();
};

run().catch((error) => {
	console.error('FAILED:', error.message);
	process.exit(1);
});

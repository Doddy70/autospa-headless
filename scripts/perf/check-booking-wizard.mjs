import { chromium } from '@playwright/test';

/**
 * The booking wizard check.
 *
 * It drives the reservation modal of `/reservasi` in a real browser: the
 * steps, the conditional vehicle step, the validation, the time slots of a
 * branch, the summary at the end and the hand over to the WhatsApp number of
 * the chosen branch.
 *
 *   node scripts/perf/check-booking-wizard.mjs [baseUrl]
 */

const BASE = process.argv[2] ?? 'http://localhost:3200';

let failures = 0;

function check(condition, message) {
	console.log(`${condition ? 'OK  ' : 'FAIL'} ${message}`);
	if (!condition) failures += 1;
}

const run = async () => {
	const browser = await chromium.launch();
	const errors = [];

	const context = await browser.newContext({
		viewport: { width: 1440, height: 1000 },
		permissions: ['clipboard-read', 'clipboard-write'],
	});
	const page = await context.newPage();

	page.setDefaultTimeout(180000);
	page.setDefaultNavigationTimeout(180000);
	page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
	page.on('console', (message) => {
		if (message.type() === 'error') errors.push(message.text());
	});

	await page.goto(`${BASE}/reservasi`, { waitUntil: 'domcontentloaded' });

	/* The wizard is a client component - the markup is on the server, but
	   the handlers only exist once React has hydrated the page. */
	await page.waitForLoadState('networkidle');
	await page.waitForTimeout(1000);

	/* --- The modal, opened from the call to action of the header --- */
	await page.locator('header [data-testid="booking-cta"]').click();
	await page.waitForSelector('[role="dialog"]');

	check(
		(await page.locator('[role="dialog"]').count()) === 1,
		'the reservation modal opens from the header',
	);

	/* The service rows are read when the dialog opens, so the wizard itself
	   appears a moment later. */
	await page.waitForSelector('[role="dialog"] [role="radiogroup"]', { timeout: 30000 });

	/* --- Step 1: the service --- */
	check(
		(await page.locator('text=Langkah 1 dari 7').count()) === 1,
		'the wizard starts on step 1 of 7',
	);

	await page.getByRole('radio', { name: /Premium Coating/ }).click();
	await page.getByRole('button', { name: 'Lanjut' }).click();

	/* --- Step 2: the branch --- */
	check(
		(await page.locator('text=Langkah 2 dari 7').count()) === 1,
		'step 2 shows the branch step',
	);

	await page.getByRole('radio', { name: /Autospa Pluit/ }).click();
	await page.getByRole('button', { name: 'Lanjut' }).click();

	/* --- Step 3: the size of the vehicle --- */
	check(
		(await page.locator('text=Langkah 3 dari 7').count()) === 1,
		'step 3 shows the vehicle size step',
	);

	await page.getByRole('radio', { name: /^Medium/ }).click();
	await page.getByRole('button', { name: 'Lanjut' }).click();

	/* --- Step 4: the vehicle - only for the model specific services --- */
	check(
		(await page.locator('text=Langkah 4 dari 7').count()) === 1,
		'step 4 shows the vehicle step for a ceramic coating',
	);

	await page.selectOption('#booking-vehicle-brand', 'Toyota');
	await page.fill('#booking-vehicle-model', 'Fortuner 2.4 VRZ');
	await page.selectOption('#booking-vehicle-year', '2022');
	check(
		(await page.inputValue('#booking-vehicle-model')) === 'Fortuner 2.4 VRZ',
		'the vehicle fields keep what the customer typed',
	);
	await page.getByRole('button', { name: 'Lanjut' }).click();

	/* --- Step 5: the arrival --- */
	check(
		(await page.locator('#booking-date').count()) === 0,
		'the arrival step has no native date input',
	);

	/* The urgency comes first. */
	await page.getByRole('radio', { name: /Secepatnya/ }).click();
	await page.waitForTimeout(300);
	check(
		(await page.locator('[role="dialog"] button[aria-pressed]').count()) === 0,
		'the calendar stays hidden for an immediate arrival',
	);

	/* The slots of the Pluit branch open at 08.30 and close at 18.00, so the
	   slots run from 09.00 to 17.00. */
	const slots = await page.locator('[aria-label="Jam kedatangan"] [role="radio"]').allInnerTexts();
	check(slots.length > 0, `the branch publishes ${slots.length} time slots`);
	check(slots[0]?.trim() === '09:00', `the first slot is the first full hour (${slots[0]})`);
	check(slots.at(-1)?.trim() === '17:00', `the last slot is an hour before closing (${slots.at(-1)})`);

	await page.getByRole('radio', { name: '10:00', exact: true }).click();

	/* A week based answer brings the calendar. */
	await page.getByRole('radio', { name: /Minggu ini/ }).click();
	check(
		(await page.locator('button[aria-pressed]').count()) > 0,
		'the calendar appears for a week based arrival',
	);

	await page.getByRole('button', { name: 'Hari ini' }).click();
	await page.getByRole('button', { name: 'Lanjut' }).click();

	/* --- Step 6: the customer --- */
	check(
		(await page.locator('text=Langkah 6 dari 7').count()) === 1,
		'step 6 shows the customer step',
	);

	await page.fill('#booking-name', 'Budi Santoso');
	await page.fill('#booking-phone', '0812 3456 7890');
	await page.fill('#booking-notes', 'Mobil masih ada di garasi, hubungi dulu sebelum masuk.');
	check(
		(await page.inputValue('#booking-name')) === 'Budi Santoso' &&
			(await page.inputValue('#booking-phone')) === '0812 3456 7890',
		'the name and the phone number keep what the customer typed',
	);
	await page.getByRole('button', { name: 'Lanjut' }).click();

	/* --- Step 7: the review --- */
	check(
		(await page.locator('text=Langkah 7 dari 7').count()) === 1,
		'step 7 shows the review step',
	);

	const summary = await page.locator('[role="dialog"] dl').first().innerText();
	check(summary.includes('Premium Coating'), 'the summary carries the service');
	check(summary.includes('Autospa Pluit'), 'the summary carries the branch');
	check(summary.includes('Medium'), 'the summary carries the vehicle size');
	check(summary.includes('Toyota Fortuner 2.4 VRZ 2022'), 'the summary carries the vehicle');
	check(summary.includes('10:00'), 'the summary carries the schedule');
	check(summary.includes('Minggu ini'), 'the summary carries the urgency');
	check(summary.includes('Budi Santoso'), 'the summary carries the customer');
	check(
		(await page.locator('text=belum dikonfirmasi').count()) >= 1,
		'the review says the booking is not confirmed yet',
	);

	/* --- The hand over to the number of the chosen branch --- */
	const popupPromise = page.waitForEvent('popup', { timeout: 15000 }).catch(() => null);
	await page.getByRole('button', { name: /Kirim lewat WhatsApp/ }).click();
	const popup = await popupPromise;

	if (popup) {
		/* wa.me redirects to the WhatsApp app - the number is in the query. */
		const url = popup.url();
		check(
			url.includes('6287717773888'),
			`the summary goes to the Pluit branch number (${url.slice(0, 40)})`,
		);
		/* The WhatsApp app drops the text on the redirect, so the message
		   itself is read from the fallback link of the dialog. */
		const fallback = await page.locator('a:has-text("Buka WhatsApp")').getAttribute('href');
		const message = decodeURIComponent(fallback ?? '');

		check(message.includes('Premium Coating'), 'the message carries the service');
		check(message.includes('Autospa Pluit'), 'the message carries the branch');
		check(message.includes('Budi Santoso'), 'the message carries the customer');
		await popup.close();
	} else {
		/* The browser may block the new tab - the fallback link has to be
		   there in that case. */
		const fallback = await page.locator('a:has-text("Buka WhatsApp")').getAttribute('href');
		check(
			(fallback ?? '').startsWith('https://wa.me/6287717773888'),
			'the fallback link goes to the Pluit branch number',
		);
	}

	/* --- Another branch goes to another number --- */
	await page
		.locator('dt', { hasText: 'Cabang' })
		.locator('..')
		.getByRole('button', { name: 'Ubah' })
		.click();
	await page.getByRole('radio', { name: /Autospa Ciledug/ }).click();
	await page.getByRole('button', { name: 'Lanjut' }).click();
	await page.getByRole('button', { name: 'Lanjut' }).click();
	await page.getByRole('button', { name: 'Lanjut' }).click();
	await page.getByRole('button', { name: 'Lanjut' }).click();
	await page.getByRole('button', { name: 'Lanjut' }).click();

	const ciledugLink = await page.locator('a:has-text("Buka WhatsApp")').getAttribute('href');
	check(
		(ciledugLink ?? '').startsWith('https://wa.me/6281977773888'),
		`another branch goes to its own number (${(ciledugLink ?? '').slice(0, 40)})`,
	);

	/* --- The modal closes ---
	   The dialog is animated out, so it stays in the document until the exit
	   animation is over. Waiting for the removal is the honest check - a
	   fixed sleep is either too short on a production build or too long on a
	   dev build. */
	await page.keyboard.press('Escape');

	const closed = await page
		.waitForSelector('[role="dialog"][aria-label*="reservasi"]', {
			state: 'detached',
			timeout: 10000,
		})
		.then(() => true)
		.catch(() => false);

	check(closed, 'the Escape key closes the modal');

	/* --- A service without the model specific step skips it --- */
	await page.goto(`${BASE}/reservasi`, { waitUntil: 'domcontentloaded' });
	await page.waitForLoadState('networkidle');
	await page.waitForTimeout(1000);
	await page.locator('header [data-testid="booking-cta"]').click();
	await page.waitForSelector('[role="dialog"]');

	await page.getByRole('radio', { name: /Premium Wash/ }).click();
	await page.getByRole('button', { name: 'Lanjut' }).click();
	await page.getByRole('radio', { name: /Autospa Pluit/ }).click();
	await page.getByRole('button', { name: 'Lanjut' }).click();
	await page.getByRole('radio', { name: /^Small/ }).click();
	await page.getByRole('button', { name: 'Lanjut' }).click();

	check(
		(await page.locator('text=Langkah 5 dari 7').count()) === 1,
		'a wash skips the vehicle step - the schedule follows the size step',
	);
	check(
		(await page.locator('#booking-vehicle-brand').count()) === 0,
		'the vehicle fields are not shown for a wash',
	);

	/* --- The validation --- */
	await page.getByRole('button', { name: 'Lanjut' }).click();
	check(
		(await page.locator('[role="alert"]').count()) >= 1,
		'an empty step does not continue',
	);

	/* --- The hand over of a service without the model specific step ---
	   The skipped step is not a missing answer: the request of a wash has to
	   reach the number of its branch just like the request of a coating. */
	await page.getByRole('radio', { name: /Secepatnya/ }).click();
	await page.waitForTimeout(300);
	await page.getByRole('button', { name: 'Lanjut' }).click();
	await page.fill('#booking-name', 'Sari Wijaya');
	await page.fill('#booking-phone', '0812 3456 7890');
	await page.getByRole('button', { name: 'Lanjut' }).click();
	await page.waitForTimeout(700);

	check(
		(await page.locator('text=Langkah 7 dari 7').count()) === 1,
		'a wash reaches the review step',
	);

	const washPopup = page.waitForEvent('popup', { timeout: 15000 }).catch(() => null);
	await page.getByRole('button', { name: /Kirim lewat WhatsApp/ }).click();
	const washTab = await washPopup;
	await page.waitForTimeout(500);

	const washLink = await page
		.locator('a:has-text("Buka WhatsApp")')
		.getAttribute('href')
		.catch(() => null);

	check(
		(washLink ?? '').startsWith('https://wa.me/6287717773888'),
		`the request of a wash goes to the number of its branch (${(washLink ?? '').slice(0, 40)})`,
	);

	if (washTab) {
		check(
			(washTab.url() ?? '').includes('6287717773888'),
			'the WhatsApp tab of a wash carries the branch number',
		);
		await washTab.close();
	}

	check(
		!/ASPA--/.test(await page.locator('[role="dialog"]').innerText()),
		'the request number of a booking without a day is not empty',
	);

	/* --- The layout on a phone --- */
	await page.setViewportSize({ width: 390, height: 844 });
	await page.reload({ waitUntil: 'domcontentloaded' });
	await page.waitForLoadState('networkidle');
	await page.waitForTimeout(1000);
	/* On a phone the call to action lives in the burger menu. */
	await page.locator('[data-testid="mobile-menu-toggle"]').click();
	await page.waitForTimeout(600);
	await page.locator('[data-testid="mobile-menu"] [data-testid="booking-cta"]').click();
	await page.waitForSelector('[role="dialog"]');

	const overflow = await page.evaluate(() => {
		const root = document.documentElement;
		return root.scrollWidth - root.clientWidth;
	});
	check(overflow <= 1, `no horizontal overflow on a phone (${overflow}px)`);

	check(errors.length === 0, `no console or page errors (${errors.length})`);
	for (const error of errors.slice(0, 5)) console.log(`     - ${error}`);

	await browser.close();

	console.log(failures ? `\n${failures} check(s) failed.` : '\nAll checks passed.');
	process.exit(failures ? 1 : 0);
};

run();

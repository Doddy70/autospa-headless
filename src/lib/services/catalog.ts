/**
 * The service catalogue.
 *
 * This is the only module the pages are allowed to read services from. It
 * follows the repository pattern of the project (component -> repository ->
 * GraphQL) and adds one rule on top: the catalogue is never empty.
 *
 * Order of preference
 *   1. WordPress - the headless origin. It wins for every field it carries.
 *   2. `data/services.ts` - the static mirror of the published production
 *      pages. It fills the gaps and takes over completely while the GraphQL
 *      endpoint is unreachable.
 *
 * The mirror is not a second source of truth to keep in sync by hand: it is
 * the published content, copied once, and it only takes over when the CMS
 * cannot answer.
 */

import { SERVICES, getService } from '@/data/services';
import {
	getServiceBySlug as getWordPressService,
	getServices as getWordPressServices,
} from '@/lib/wordpress/repositories/services';
import type { ServiceSummary as WpServiceSummary } from '@/lib/wordpress/types/service';

import { buildDetail, cardFromStatic, cardFromWordPress } from './adapters';
import type { ServiceCard, ServiceDetail } from './types';

/**
 * Set once the GraphQL endpoint has failed.
 *
 * The endpoint is read-only and either answers or it does not; retrying it on
 * every request would slow the whole site down while it is down. The flag
 * lives in the server process, so it is reset on the next deploy.
 */
let wordPressUnavailable = false;

/**
 * How long the CMS has to answer before the mirror takes over.
 *
 * The reservation dialog reads the catalogue when it opens; a stalled origin
 * must not hold the customer on a loading screen.
 */
const WORDPRESS_TIMEOUT_MS = 8000;

/**
 * The published services, or null when WordPress cannot answer.
 */
async function listWordPressServices(): Promise<WpServiceSummary[] | null> {
	if (wordPressUnavailable) return null;

	try {
		const services = await getWordPressServices(WORDPRESS_TIMEOUT_MS);

		if (!services.length) {
			wordPressUnavailable = true;
			console.warn(
				'[services] WordPress returned no service - falling back to the static mirror.',
			);
			return null;
		}

		return services;
	} catch (error) {
		wordPressUnavailable = true;
		console.warn(
			'[services] WordPress is unreachable, using the static mirror:',
			error instanceof Error ? error.message : error,
		);
		return null;
	}
}

/**
 * Every service of the catalogue, as catalogue rows.
 *
 * The published order of the production site wins (the numbers "01".."06" are
 * printed on the page), and a service that only exists in WordPress is
 * appended at the end.
 */
export async function listServiceCards(): Promise<ServiceCard[]> {
	const wordPress = await listWordPressServices();
	const bySlug = new Map((wordPress ?? []).map((service) => [service.slug, service]));

	const cards: ServiceCard[] = [];

	SERVICES.forEach((mirror, index) => {
		const published = bySlug.get(mirror.slug);

		if (published) {
			const card = cardFromWordPress(published, index);
			/* The number is printed on the production page, not in the CMS. */
			card.number = mirror.number ?? null;
			cards.push(card);
		} else {
			cards.push(cardFromStatic(mirror, index));
		}

		bySlug.delete(mirror.slug);
	});

	let index = cards.length;
	for (const published of bySlug.values()) {
		cards.push(cardFromWordPress(published, index));
		index += 1;
	}

	return cards;
}

/**
 * One service with everything its page needs.
 *
 * @param slug The service slug.
 */
export async function getServiceDetail(slug: string): Promise<ServiceDetail | null> {
	const mirror = getService(slug);

	let published = null;

	if (!wordPressUnavailable) {
		try {
			published = await getWordPressService(slug);
		} catch (error) {
			wordPressUnavailable = true;
			console.warn(
				'[services] WordPress is unreachable, using the static mirror:',
				error instanceof Error ? error.message : error,
			);
		}
	}

	if (!published && !mirror) return null;

	/* The row side has to match the position in the catalogue. */
	const index = Math.max(
		0,
		SERVICES.findIndex((service) => service.slug === slug),
	);

	const cards = await listServiceCards();
	const related = cards.filter((card) => card.slug !== slug).slice(0, 3);

	/*
	 * The neighbours of the service, for the navigation row of the Agntix
	 * portfolio detail layout. The row wraps around: the first service has
	 * the last one before it, the last one has the first one after it.
	 */
	const position = cards.findIndex((card) => card.slug === slug);
	const neighbours =
		position === -1
			? { prev: null, next: null }
			: {
					prev: cards[(position - 1 + cards.length) % cards.length] ?? null,
					next: cards[(position + 1) % cards.length] ?? null,
				};

	return buildDetail(published, mirror, index, related, neighbours);
}

/**
 * The slugs of the catalogue - the pages to prerender.
 */
export async function listServiceSlugs(): Promise<string[]> {
	const cards = await listServiceCards();
	return cards.map((card) => card.slug);
}

/**
 * The branch directory.
 *
 * This is the only module the pages are allowed to read branches from. It
 * follows the repository pattern of the project (component -> repository ->
 * GraphQL) and adds one rule on top: the directory is never empty.
 *
 * Order of preference
 *   1. WordPress - the headless origin. It wins for every field it carries.
 *   2. `data/contact.ts` - the static mirror of the published production
 *      contact page. It fills the gaps and takes over completely while the
 *      GraphQL endpoint is unreachable.
 *
 * The published order of the production contact page wins, so the branches
 * stay in the order the site has always shown them.
 */

import { BRANCHES, branchMapUrl, branchWhatsapp, type ContactBranch } from '@/data/contact';
import { getLocations as getWordPressLocations } from '@/lib/wordpress/repositories/locations';
import type { LocationContact } from '@/lib/wordpress/types/location';

import type { LocationCard, LocationSource } from './types';

/**
 * Set once the GraphQL endpoint has failed.
 *
 * The endpoint is read-only and either answers or it does not; retrying it on
 * every request would slow the whole site down while it is down. The flag
 * lives in the server process, so it is reset on the next deploy.
 */
let wordPressUnavailable = false;

/**
 * The branches of the CMS, or null when WordPress cannot answer.
 */
async function listWordPressLocations(): Promise<LocationContact[] | null> {
	if (wordPressUnavailable) return null;

	try {
		const locations = await getWordPressLocations();

		if (!locations.length) {
			wordPressUnavailable = true;
			console.warn(
				'[locations] WordPress returned no branch - falling back to the static mirror.',
			);
			return null;
		}

		return locations;
	} catch (error) {
		wordPressUnavailable = true;
		console.warn(
			'[locations] WordPress is unreachable, using the static mirror:',
			error instanceof Error ? error.message : error,
		);
		return null;
	}
}

/**
 * The hours of a branch directory entry, as the CMS writes them.
 *
 * The directory publishes "Every day 08.30 - 18.00 WIB"; the CMS publishes
 * the same hours as one row per weekday. Both end up as one line.
 */
function hoursFromDirectory(branch: ContactBranch): string | null {
	const match = branch.hours.match(/(\d{2})\.(\d{2})\s*-\s*(\d{2})\.(\d{2})/);
	if (!match) return branch.hours;

	return `Setiap hari ${match[1]}.${match[2]} - ${match[3]}.${match[4]}`;
}

/** A branch built from the static directory. */
function cardFromDirectory(branch: ContactBranch): LocationCard {
	return {
		slug: branch.slug,
		name: branch.name,
		address: branch.address ?? '',
		phones: branch.phones,
		whatsapp: branchWhatsapp(branch),
		hours: hoursFromDirectory(branch),
		mapsUrl: branchMapUrl(branch),
		source: 'static',
	};
}

/** A branch built from the CMS. */
function cardFromWordPress(location: LocationContact): LocationCard {
	return {
		slug: location.slug,
		name: location.title,
		address: location.addressLine ?? '',
		phones: location.phone ? [location.phone] : [],
		whatsapp: location.whatsapp,
		hours: location.hours,
		mapsUrl: location.mapsUrl,
		source: 'wordpress',
	};
}

/**
 * Every branch of the directory, as directory cards.
 *
 * The published order of the production contact page wins, and a branch that
 * only exists in WordPress is appended at the end.
 */
export async function listLocationCards(): Promise<LocationCard[]> {
	const wordPress = await listWordPressLocations();
	const bySlug = new Map((wordPress ?? []).map((location) => [location.slug, location]));

	const cards: LocationCard[] = [];

	BRANCHES.forEach((branch) => {
		const published = bySlug.get(branch.slug);

		if (!published) {
			cards.push(cardFromDirectory(branch));
			return;
		}

		/*
		 * The CMS wins for every field it carries; the directory fills the
		 * gaps - the second phone number of a branch, for instance, is only
		 * published there.
		 */
		const fromDirectory = cardFromDirectory(branch);
		const fromCms = cardFromWordPress(published);

		cards.push({
			slug: fromCms.slug,
			name: fromCms.name || fromDirectory.name,
			address: fromCms.address || fromDirectory.address,
			phones: fromCms.phones.length > 0 ? fromCms.phones : fromDirectory.phones,
			whatsapp: fromCms.whatsapp ?? fromDirectory.whatsapp,
			hours: fromCms.hours ?? fromDirectory.hours,
			mapsUrl: fromCms.mapsUrl ?? fromDirectory.mapsUrl,
			source: 'wordpress',
		});

		bySlug.delete(branch.slug);
	});

	for (const published of bySlug.values()) {
		cards.push(cardFromWordPress(published));
	}

	return cards;
}

/**
 * One branch of the directory.
 *
 * @param slug The branch slug.
 */
export async function getLocationCard(slug: string): Promise<LocationCard | null> {
	const cards = await listLocationCards();
	return cards.find((card) => card.slug === slug) ?? null;
}

/**
 * The slugs of the directory.
 */
export async function listLocationSlugs(): Promise<string[]> {
	const cards = await listLocationCards();
	return cards.map((card) => card.slug);
}

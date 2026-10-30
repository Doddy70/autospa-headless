/**
 * Featured work for the homepage.
 *
 * The content itself is not duplicated here: every title, tagline and slug is
 * read from `src/data/services.ts` (which mirrors production). This file only
 * adds the two things the service catalogue does not carry:
 *
 *   - a card image that exists inside this repo's `public/` folder
 *     (the catalogue points at the production `/wp-content/uploads` mirror),
 *   - the category chips shown under the card title.
 *
 * Phase 2E: the "Featured Projects" block of the Agntix template became
 * "Featured Work" - the six AutoSPA services shown as case-study cards.
 */

import type { Service } from './services';
import { SERVICES } from './services';

export interface HomeWorkMeta {
	/** Service slug the entry belongs to. */
	slug: string;
	/** Card image, served from `public/assets`. */
	image: string;
	/** Alternative text describing what is shown on the card. */
	alt: string;
	/** Category chips rendered next to the card title. */
	categories: string[];
}

export interface HomeWorkItem {
	slug: string;
	title: string;
	tagline: string;
	image: string;
	alt: string;
	categories: string[];
	/** Canonical service page of the item. */
	href: string;
}

const WORK_META: readonly HomeWorkMeta[] = [
	{
		slug: 'premium-wash',
		image: '/assets/autospa-cards/Premium-Wash.jpg',
		alt: 'AutoSPA premium wash - foamy exterior wash of a car',
		categories: ['Wash', 'Maintenance'],
	},
	{
		slug: 'premium-detailing',
		image: '/assets/gallery/auto detailing.webp',
		alt: 'AutoSPA premium detailing - interior and exterior detailing of a car',
		categories: ['Detailing', 'Interior'],
	},
	{
		slug: 'premium-coating',
		image: '/assets/autospa-cards/Ekterior-2.jpg',
		alt: 'AutoSPA premium coating - ceramic coated car body',
		categories: ['Coating', 'Protection'],
	},
	{
		slug: 'premium-360-ppf',
		image: '/assets/autospa-cards/PPF.jpg',
		alt: 'AutoSPA 360 paint protection film wrapped around a car body',
		categories: ['PPF', 'Protection'],
	},
	{
		slug: 'engine-glass',
		image: '/assets/autospa-cards/Engine-BAy.jpg',
		alt: 'AutoSPA engine and glass service - degreased engine bay',
		categories: ['Engine', 'Glass'],
	},
	{
		slug: 'rust-protection',
		image: '/assets/autospa-cards/Anti-Rust-1.jpg',
		alt: 'AutoSPA rust protection - underbody coating treatment',
		categories: ['Underbody', 'Protection'],
	},
];

const FALLBACK_META: HomeWorkMeta = {
	slug: '',
	image: '/assets/autospa-cards/Premium-Wash.jpg',
	alt: 'AutoSPA Jakarta automotive detailing',
	categories: [],
};

function toHomeWorkItem(service: Service): HomeWorkItem {
	const meta = WORK_META.find((entry) => entry.slug === service.slug) ?? FALLBACK_META;

	return {
		slug: service.slug,
		title: service.title,
		tagline: service.tagline,
		image: meta.image,
		alt: meta.alt,
		categories: meta.categories,
		href: `/services/${service.slug}`,
	};
}

/** The six services, ready to be rendered as featured work cards. */
export const HOME_WORK: HomeWorkItem[] = SERVICES.map(toHomeWorkItem);

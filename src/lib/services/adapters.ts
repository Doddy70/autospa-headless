/**
 * Mappers between the two service sources and the presentation model.
 *
 * `data/services.ts` mirrors the published production pages, WordPress is the
 * headless origin. Both are mapped into `ServiceCard` / `ServiceDetail`, so
 * the components and the Agntix rows never learn where a row came from.
 *
 * The static mirror is also the fallback for the fields WordPress does not
 * publish yet (the FAQ answers, for instance, live in the mirror only), so a
 * service page is never half empty.
 */

import type { Service as StaticService } from '@/data/services';
import type {
	Service as WpService,
	ServiceSummary as WpServiceSummary,
} from '@/lib/wordpress/types/service';

import { existsInPublic, toAssetUrl } from './assets';
import type {
	ServiceCard,
	ServiceDetail,
	ServiceFaqCard,
	ServiceGalleryCard,
	ServicePackageCard,
} from './types';

/**
 * Short descriptors shown under the row title.
 *
 * The Agntix row carries a one line label ("Research, UX, UI Design"); the
 * published service pages do not have such a line, so it is written here
 * instead of being invented per component.
 */
const DESCRIPTORS: Record<string, string> = {
	'premium-wash': 'Wash · Maintenance',
	'premium-detailing': 'Detailing · Interior & Exterior',
	'premium-coating': 'Coating · Gloss Protection',
	'premium-360-ppf': 'PPF · Paint Protection',
	'engine-glass': 'Engine · Glass Care',
	'rust-protection': 'Underbody · Anti Corrosion',
};

/**
 * The photo that represents a service in the catalogue rows.
 *
 * The published pages point at the production upload mirror; the repo ships a
 * cropped card of every service in `public/assets/autospa-cards`, which reads
 * better in the wide rows of the Agntix layout.
 */
const CARD_IMAGES: Record<string, { src: string; alt: string }> = {
	'premium-wash': {
		src: '/assets/autospa-cards/Premium-Wash.jpg',
		alt: 'AutoSPA premium wash - foamy exterior wash of a car',
	},
	'premium-detailing': {
		src: '/assets/autospa-cards/Interior-Detailing.jpg',
		alt: 'AutoSPA interior detailing - cleaned and restored car cabin',
	},
	'premium-coating': {
		src: '/assets/autospa-cards/premium_coating.jpg',
		alt: 'AutoSPA ceramic coating - gloss finish on a protected car body',
	},
	'premium-360-ppf': {
		src: '/assets/autospa-cards/PPF.jpg',
		alt: 'AutoSPA premium paint protection film applied over a car body',
	},
	'engine-glass': {
		src: '/assets/autospa-cards/Engine-BAy.jpg',
		alt: 'AutoSPA engine bay and glass service - degreased engine compartment',
	},
	'rust-protection': {
		src: '/assets/autospa-cards/Anti-Rust-1.jpg',
		alt: 'AutoSPA anti rust treatment - underbody protection being applied',
	},
};

/* --------------------------------------------------------------- helpers -- */

/**
 * The photo of a row: the cropped card when the repo ships one, the published
 * image otherwise.
 *
 * The cropped cards are a nice-to-have - the set changes over time - so the
 * published image takes over when a crop is missing.
 */
function rowImage(slug: string, title: string, published: string | null | undefined) {
	const local = CARD_IMAGES[slug];

	if (local && existsInPublic(local.src)) return local;

	const publishedUrl = toAssetUrl(published);

	if (publishedUrl) {
		return {
			src: publishedUrl,
			alt: `AutoSPA ${title}`,
		};
	}

	return local ?? { src: '/assets/autospa-cards/Premium-Wash.jpg', alt: `AutoSPA ${title}` };
}

/** Splits a title after its first word, the way the Agntix row does. */
function hasLineBreak(title: string): boolean {
	return title.trim().split(/\s+/).length > 1;
}

/** The row side: the rows alternate, the first one shows its photo left. */
function layoutFor(index: number): 'left' | 'right' {
	return index % 2 === 0 ? 'right' : 'left';
}

/** The descriptor line of a row. */
function descriptorFor(slug: string, fallback: string | null | undefined): string {
	return DESCRIPTORS[slug] ?? fallback ?? '';
}

/* --------------------------------------------------------------- cards ---- */

/** A row built from the static mirror. */
export function cardFromStatic(service: StaticService, index: number): ServiceCard {
	const image = rowImage(service.slug, service.title, service.image);

	return {
		slug: service.slug,
		title: service.title,
		subtitle: descriptorFor(service.slug, null),
		image: image.src,
		alt: image.alt,
		href: `/services/${service.slug}`,
		number: service.number ?? null,
		layout: layoutFor(index),
		hasLineBreak: hasLineBreak(service.title),
		source: 'static',
	};
}

/** A row built from the WordPress summary. */
export function cardFromWordPress(summary: WpServiceSummary, index: number): ServiceCard {
	return cardFromWordPressFields(
		{
			slug: summary.slug,
			title: summary.title,
			categoryLabel: summary.categoryLabel,
			imageUrl: summary.image?.url ?? null,
			path: summary.path,
		},
		index,
	);
}

/** A row built from the loose fields of a WordPress service. */
export function cardFromWordPressFields(
	fields: {
		slug: string;
		title: string;
		categoryLabel: string | null;
		imageUrl: string | null;
		path: string | null;
	},
	index: number,
): ServiceCard {
	const image = rowImage(fields.slug, fields.title, fields.imageUrl);

	return {
		slug: fields.slug,
		title: fields.title,
		subtitle: descriptorFor(fields.slug, fields.categoryLabel),
		image: image.src,
		alt: image.alt || fields.title,
		href: fields.path || `/services/${fields.slug}`,
		number: null,
		layout: layoutFor(index),
		hasLineBreak: hasLineBreak(fields.title),
		source: 'wordpress',
	};
}

/* -------------------------------------------------------------- detail ---- */

/** The packages of a static service. */
function packagesFromStatic(service: StaticService): ServicePackageCard[] {
	return service.packages.map((entry) => ({
		name: entry.name,
		summary: entry.summary,
		includes: entry.includes,
		price: null,
		recommended: false,
	}));
}

/** The packages of a WordPress service, with the published price labels. */
function packagesFromWordPress(service: WpService): ServicePackageCard[] {
	if (service.packages.status !== 'ok' || !service.packages.value) return [];

	return service.packages.value.map((entry) => ({
		name: entry.name,
		summary: entry.description ?? entry.tierLabel ?? '',
		includes: entry.features,
		price: entry.startingFrom?.priceFormatted ?? null,
		recommended: entry.recommended,
	}));
}

/** The gallery of a static service. */
function galleryFromStatic(service: StaticService): ServiceGalleryCard[] {
	return service.gallery.map((url) => ({
		url: toAssetUrl(url),
		alt: `${service.title} - AutoSPA Jakarta`,
		caption: null,
	}));
}

/** The gallery of a WordPress service. */
function galleryFromWordPress(service: WpService): ServiceGalleryCard[] {
	if (service.gallery.status !== 'ok' || !service.gallery.value) return [];

	return service.gallery.value.map((entry) => ({
		url: toAssetUrl(entry.image.url),
		alt: entry.image.alt || service.title,
		caption: entry.caption,
	}));
}

/** The FAQ of a static service. */
function faqsFromStatic(service: StaticService): ServiceFaqCard[] {
	return service.faqs.map((faq) => ({ question: faq.question, answer: faq.answer }));
}

/**
 * Builds the detail model of a service.
 *
 * The WordPress fields win where they are present; the static mirror fills
 * the gaps (the FAQ answers, the highlights, the gallery fallback). That way
 * the page is complete today and becomes CMS driven without a rewrite once
 * the CMS carries every field.
 *
 * @param service        The WordPress service, when the CMS answered.
 * @param mirror         The static mirror of the same service, when there is one.
 * @param index          Position in the catalogue, drives the row side.
 * @param relatedCards   The other services, already mapped.
 */
export function buildDetail(
	service: WpService | null,
	mirror: StaticService | undefined,
	index: number,
	relatedCards: ServiceCard[],
	neighbours: { prev: ServiceCard | null; next: ServiceCard | null } = {
		prev: null,
		next: null,
	},
): ServiceDetail | null {
	if (!service && !mirror) return null;

	/* The hero photo of the WordPress service, when it carries one. */
	const heroImage =
		service && service.hero.image.status === 'ok' ? service.hero.image.value : null;

	const card = mirror
		? cardFromStatic(mirror, index)
		: cardFromWordPressFields(
				{
					slug: service!.slug,
					title: service!.title,
					categoryLabel: service!.categoryLabel,
					imageUrl: heroImage?.url ?? null,
					path: service!.path,
				},
				index,
			);

	const heroDescription =
		service?.hero.description.status === 'ok' ? service.hero.description.value : null;
	const longDescription =
		service?.description.status === 'ok' ? service.description.value : null;
	const shortDescription =
		service?.shortDescription.status === 'ok' ? service.shortDescription.value : null;

	const wpPackages = service ? packagesFromWordPress(service) : [];
	const wpGallery = service ? galleryFromWordPress(service) : [];
	const wpBenefits =
		service?.benefits.status === 'ok' && service.benefits.value
			? service.benefits.value.map((benefit) => ({
					title: benefit.title,
					description: benefit.description,
				}))
			: [];

	return {
		card: { ...card, source: service ? 'wordpress' : 'static' },
		tagline: shortDescription ?? mirror?.tagline ?? '',
		description: longDescription ?? mirror?.description ?? '',
		highlights: mirror?.highlights ?? [],
		packages: wpPackages.length > 0 ? wpPackages : mirror ? packagesFromStatic(mirror) : [],
		faqs: mirror ? faqsFromStatic(mirror) : [],
		gallery: wpGallery.length > 0 ? wpGallery : mirror ? galleryFromStatic(mirror) : [],
		benefits: wpBenefits,
		related: relatedCards,
		/*
		 * The clip of the header is a local file, so it only ever comes from
		 * the mirror. The poster is the photo of the service - the cropped
		 * card reads better than the wide hero photo.
		 */
		video: mirror?.video ? { src: mirror.video, poster: card.image } : null,
		prev: neighbours.prev,
		next: neighbours.next,
		seo: {
			title: service?.seo.title ?? null,
			description: service?.seo.description ?? shortDescription ?? mirror?.tagline ?? null,
			canonical: service?.seo.canonical ?? `/services/${card.slug}`,
		},
	};
}

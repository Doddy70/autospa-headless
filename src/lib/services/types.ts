/**
 * Service domain for the presentation layer.
 *
 * Two sources feed the service catalogue:
 *
 *   - WordPress (via `lib/wordpress/repositories/services`) - the headless
 *     origin. It is the source of truth once the CMS is connected.
 *   - `data/services.ts` - a static mirror of the published production
 *     pages. It is the fallback that keeps the site complete while the
 *     GraphQL endpoint is unreachable.
 *
 * Both sources are mapped into the shapes below, so a component never has to
 * know where a row came from. The Agntix "Projects" block (the portfolio
 * metro rows) only ever needs `ServiceCard`; the detail page needs
 * `ServiceDetail`.
 */

/** Where a catalogue entry was read from. */
export type ServiceSource = 'wordpress' | 'static';

/**
 * One row of the service catalogue - the model behind the Agntix portfolio
 * metro rows ("our work" turned into "our services").
 */
export interface ServiceCard {
	/** Service slug, also the last segment of the canonical URL. */
	slug: string;
	/** Row title. */
	title: string;
	/** Small uppercase line under the title - the promise or the category. */
	subtitle: string;
	/** Photo of the service. */
	image: string;
	/** Alternative text describing the photo. */
	alt: string;
	/** Canonical path of the service page. */
	href: string;
	/** The published number ("01", "02"), when there is one. */
	number: string | null;
	/**
	 * Which side the photo sits on. The rows alternate so the eye zig-zags
	 * down the page.
	 */
	layout: 'left' | 'right';
	/** Breaks the title after the first word, like the template's row. */
	hasLineBreak: boolean;
	/** Which origin the row was read from. */
	source: ServiceSource;
}

/** A package (tier) of a service. */
export interface ServicePackageCard {
	name: string;
	/** One line describing the variant. */
	summary: string;
	/** The "all includes" list. */
	includes: string[];
	/** Published price label, when the source carries one. */
	price: string | null;
	/** Whether the package is the recommended tier. */
	recommended: boolean;
}

/** A question of the service FAQ. */
export interface ServiceFaqCard {
	question: string;
	answer: string;
}

/** One image of the service gallery. */
export interface ServiceGalleryCard {
	url: string;
	alt: string;
	caption: string | null;
}

/** The clip that opens the service page. */
export interface ServiceVideo {
	/** The clip itself, served from `public/videos`. */
	src: string;
	/** The still that shows before the clip plays. */
	poster: string;
}

/** Everything a service page needs. */
export interface ServiceDetail {
	/** The listing row of this service. */
	card: ServiceCard;
	/** The one line promise. */
	tagline: string;
	/** The long description. */
	description: string;
	/** Facts that are not tied to a package. */
	highlights: string[];
	/** The packages of the service. */
	packages: ServicePackageCard[];
	/** The questions the service page answers. */
	faqs: ServiceFaqCard[];
	/** The gallery. */
	gallery: ServiceGalleryCard[];
	/** The benefit list, when the CMS carries one. */
	benefits: { title: string; description: string | null }[];
	/** The other services, for the "other services" block. */
	related: ServiceCard[];
	/** The clip of the header, when the service has one. */
	video: ServiceVideo | null;
	/** The service before this one in the catalogue. */
	prev: ServiceCard | null;
	/** The service after this one in the catalogue. */
	next: ServiceCard | null;
	/** SEO fields as published. */
	seo: {
		title: string | null;
		description: string | null;
		canonical: string | null;
	};
}

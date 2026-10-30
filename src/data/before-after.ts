/**
 * The before/after gallery of AutoSPA.
 *
 * Every entry is a pair of the same detail - the photo of the vehicle
 * before the work and the photo after it. The photos live in
 * `public/images/before-after/` and are served by the frontend itself;
 * they are not part of the WordPress media library yet.
 */

export interface BeforeAfterImage {
	/** The path of the photo, relative to `public`. */
	src: string;
	/** The alternative text of the photo. */
	alt: string;
	/** The width of the photo, in pixels. */
	width: number;
	/** The height of the photo, in pixels. */
	height: number;
}

export interface BeforeAfterItem {
	/** The key of the pair - it names the slide. */
	id: string;
	/** The name of the work. */
	title: string;
	/** One line about the work. */
	caption: string;
	/** The photo before the work. */
	before: BeforeAfterImage;
	/** The photo after the work. */
	after: BeforeAfterImage;
}

/** Every photo of the gallery is a square of this size. */
const SIZE = 1080;

/** The path of a photo of the gallery. */
function photo(name: string, alt: string): BeforeAfterImage {
	return {
		src: `/images/before-after/${name}.jpg`,
		alt,
		width: SIZE,
		height: SIZE,
	};
}

/**
 * The pairs of the gallery, in the order they are shown.
 */
export const BEFORE_AFTER: BeforeAfterItem[] = [
	{
		id: 'engine',
		title: 'Engine',
		caption: 'The engine is degreased, cleaned, and every detail is made to shine.',
		before: photo('engine-before', 'The engine of the car before the AutoSPA treatment'),
		after: photo('engine-after', 'The engine of the car after the AutoSPA treatment'),
	},
	{
		id: 'bay',
		title: 'Engine Bay',
		caption: 'The engine bay is cleaned throughout, from the top down to the underbody.',
		before: photo('bay-before', 'The engine bay before the AutoSPA treatment'),
		after: photo('bay-after', 'The engine bay after the AutoSPA treatment'),
	},
	{
		id: 'bumper',
		title: 'Bumper',
		caption: 'The bumper is polished and brought back to its clean colour.',
		before: photo('bumper-before', 'The bumper of the car before the AutoSPA treatment'),
		after: photo('bumper-after', 'The bumper of the car after the AutoSPA treatment'),
	},
	{
		id: 'detailing',
		title: 'Full Detailing',
		caption: 'The whole job - polish, coating, and a tidy interior.',
		before: photo('detailing-before', 'The car before the AutoSPA detailing'),
		after: photo('detailing-after', 'The car after the AutoSPA detailing'),
	},
	{
		id: 'detail',
		title: 'Interior Detail',
		caption: 'The seats, the dashboard, and the door panels are cleaned one by one.',
		before: photo('detail-before', 'The interior of the car before the AutoSPA treatment'),
		after: photo('detail-after', 'The interior of the car after the AutoSPA treatment'),
	},
	{
		id: 'dash',
		title: 'Dashboard',
		caption: 'The dashboard is wiped and conditioned without leaving a fingerprint.',
		before: photo('dash-before', 'The dashboard before the AutoSPA treatment'),
		after: photo('dash-after', 'The dashboard after the AutoSPA treatment'),
	},
	{
		id: 'knalpot',
		title: 'Exhaust',
		caption: 'The exhaust is cleaned of soot and brought back to the chrome.',
		before: photo('knalpot-before', 'The exhaust before the AutoSPA treatment'),
		after: photo('knalpot-after', 'The exhaust after the AutoSPA treatment'),
	},
	{
		id: 'headlamp',
		title: 'Headlamp',
		caption: 'The headlamp is polished until it is clear again and shines at full power.',
		before: photo('headlamp-before', 'The headlamp before the AutoSPA treatment'),
		after: photo('headlamp-after', 'The headlamp after the AutoSPA treatment'),
	},
	{
		id: 'kaca',
		title: 'Glass & Mirrors',
		caption: 'The glass and the mirrors are wiped scratch-free, the view is clear again.',
		before: photo('kaca-before', 'The glass of the car before the AutoSPA treatment'),
		after: photo('kaca-after', 'The glass of the car after the AutoSPA treatment'),
	},
	{
		id: 'shock',
		title: 'Wheels & Suspension',
		caption: 'The wheels and the suspension are cleaned, carbon-cleaned, and made new again.',
		before: photo('shock-before', 'The wheels before the AutoSPA treatment'),
		after: photo('shock-after', 'The wheels after the AutoSPA treatment'),
	},
];

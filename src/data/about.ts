/**
 * The content of the About page.
 *
 * The page follows the architecture of the Agntix template
 * (`src/pages/about/about-us/AboutUsLightMain.tsx`): a hero, a running
 * headline, a wide photo, the story, the partners, the counter, the team and
 * the closing call to action.
 *
 * The copy is the copy AutoSPA Jakarta publishes - it is read from the
 * structured snapshot of the production page (`src/content/structured/`),
 * so the wording stays identical to the site it replaces.
 *
 * The photos carry the properties of the WordPress media library: the id of
 * the attachment, the original size and the alternative text. The library is
 * the source of truth for those - `next/image` needs the dimensions to lay
 * the page out without a jump, and the alternative text is what a screen
 * reader announces.
 */

/** A photo of the WordPress media library. */
export interface AboutImage {
	/** The id of the attachment in the media library. */
	id: number;
	/** The original file. */
	src: string;
	/** The width of the original file, in pixels. */
	width: number;
	/** The height of the original file, in pixels. */
	height: number;
	/** The alternative text of the attachment. */
	alt: string;
}

/**
 * The members of the AutoSPA team.
 *
 * The order and the roles are the ones the `/about` page publishes; the
 * photos are the attachments of the media library.
 */
export const TEAM: (AboutImage & { name: string; role: string })[] = [
	{
		id: 1653,
		src: 'https://backend.autospajakarta.com/wp-content/uploads/2025/05/Pungki.png',
		width: 1080,
		height: 1081,
		alt: 'Pungki Yuniawan - Area Manager Pluit, PIK 2',
		name: 'Pungki Yuniawan',
		role: 'Area Manager Pluit, PIK 2',
	},
	{
		id: 5188,
		src: 'https://backend.autospajakarta.com/wp-content/uploads/2026/01/Adit.png',
		width: 1081,
		height: 1080,
		alt: 'Adit - Area Manager Kranji, Cikupa, Serpong',
		name: 'Adit',
		role: 'Area Manager Kranji, Cikupa, Serpong',
	},
	{
		id: 1649,
		src: 'https://backend.autospajakarta.com/wp-content/uploads/2025/05/Sulis.png',
		width: 1081,
		height: 1081,
		alt: 'Sulis Setyaningsih - Senior Administrator AutoSPA Pluit',
		name: 'Sulis Setyaningsih',
		role: 'Senior Administrator AutoSPA Pluit',
	},
	{
		id: 1654,
		src: 'https://backend.autospajakarta.com/wp-content/uploads/2025/05/Sule.png',
		width: 1081,
		height: 1081,
		alt: 'Kasim S. (Sule) - Supervisor AutoSPA Pluit',
		name: 'Kasim S. (Sule)',
		role: 'Supervisor AutoSPA Pluit',
	},
	{
		id: 5187,
		src: 'https://backend.autospajakarta.com/wp-content/uploads/2026/01/ABun.png',
		width: 1081,
		height: 1080,
		alt: 'Hadis Setiawan - Supervisor AutoSPA Depok 2',
		name: 'Hadis Setiawan',
		role: 'Supervisor AutoSPA Depok 2',
	},
	{
		id: 1651,
		src: 'https://backend.autospajakarta.com/wp-content/uploads/2025/05/Ikin.png',
		width: 1080,
		height: 1081,
		alt: 'Sholichin (Ikin) - Senior Technician AutoSPA Depok 2',
		name: 'Sholichin (Ikin)',
		role: 'Senior Technician AutoSPA Depok 2',
	},
	{
		id: 5186,
		src: 'https://backend.autospajakarta.com/wp-content/uploads/2026/01/Amel.png',
		width: 1081,
		height: 1080,
		alt: 'Amelia - Administrator and Content Creator AutoSPA Depok 2',
		name: 'Amelia',
		role: 'Administrator & Content Creator AutoSPA Depok 2',
	},
	{
		id: 5192,
		src: 'https://backend.autospajakarta.com/wp-content/uploads/2026/01/s1.png',
		width: 1081,
		height: 1080,
		alt: 'Dede Yuliana - Senior Technician AutoSPA Serpong',
		name: 'Dede Yuliana',
		role: 'Senior Technician AutoSPA Serpong',
	},
	{
		id: 1648,
		src: 'https://backend.autospajakarta.com/wp-content/uploads/2025/05/1-Dhani.png',
		width: 1080,
		height: 1080,
		alt: 'Dhani - Supervisor AutoSPA Bekasi',
		name: 'Dhani',
		role: 'Supervisor AutoSPA Bekasi',
	},
];

/**
 * The wide photo of the banner.
 *
 * The attachment is the one the production page publishes, with the
 * dimensions it carries in the media library.
 */
export const BANNER: AboutImage = {
	id: 2430,
	src: 'https://backend.autospajakarta.com/wp-content/uploads/2025/06/Diamond-Package.jpg',
	width: 1920,
	height: 1350,
	alt: 'Autospa Diamond Package',
};

/**
 * The partners whose products AutoSPA works with.
 *
 * The wording is the wording of the production page; the entries are split
 * into a name and a description, which is how the Agntix service rows are
 * built.
 */
export const PARTNERS: { name: string; origin: string; description: string }[] = [
	{
		name: 'TAC System',
		origin: 'South Korea',
		description:
			'Industry-leading Nano Ceramic Quartz Coating technology that provides ultimate protection, a permanent wet-look finish, and superior hydrophobic properties.',
	},
	{
		name: 'Crystal Process',
		origin: 'Japan',
		description:
			"A masterpiece of Japanese precision engineering, specifically formulated to restore and lock in your vehicle's original paint gloss at its absolute peak.",
	},
	{
		name: 'Buff and Shine Mfg.',
		origin: 'USA',
		description:
			"The world's premium polishing pad system, ensuring that the paint correction process is executed flawlessly, safely, and without compromising the factory clear coat.",
	},
	{
		name: 'Avery Dennison',
		origin: 'USA',
		description:
			'Top-tier Paint Protection Film (PPF) and exterior materials offering unparalleled, extreme durability against scratches and road debris.',
	},
];

/** The number of the clients AutoSPA has served. */
export const CLIENTS_SERVED = 7;

/** The label under the counter. */
export const CLIENTS_LABEL = 'Satisfaction Clients';

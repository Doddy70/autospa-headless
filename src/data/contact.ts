/**
 * Branch directory and site contact details.
 *
 * Phase 2D.9 note: on production the contact page is static Elementor content
 * - ten branch blocks, each with an address, one or two phone numbers, an
 * "Open Hours" line and a Google Maps embed. Those branches are NOT `location`
 * CPT records, and the CMS copy of the CPT is not migrated yet, so this file
 * is the single source of truth for the frontend until the location records
 * are published. Every field mirrors https://autospajakarta.com/contact/.
 *
 * When the branches move into the CMS, replace BRANCHES with the locations
 * repository (`src/lib/wordpress/repositories/locations.ts`) and keep this
 * module for the site-wide contact details only.
 */

export interface BranchMap {
	/** Value for the Google Maps `q` parameter. */
	query: string;
	zoom: number;
}

export interface ContactBranch {
	slug: string;
	name: string;
	/** Null where production publishes no street address for the branch. */
	address: string | null;
	phones: string[];
	/** Opening hours, without the "Open Hours:" prefix. */
	hours: string;
	map: BranchMap | null;
}

/** Site-wide contact details, mirrored from the production header. */
export const CONTACT = {
	email: 'info@autospajakarta.com',
	phone: '+62 819-3777-3888',
	/** International format, digits only, for wa.me links. */
	whatsapp: '6281937773888',
	hours: 'Every day : 08.00 - 18.00',
} as const;

export const SOCIALS = [
	{ label: 'Facebook', href: 'https://facebook.com/autospajakarta' },
	{ label: 'X (Twitter)', href: 'https://x.com/autospajakarta' },
	{ label: 'LinkedIn', href: 'https://linkedin.com/company/autospajakarta' },
	{ label: 'Instagram', href: 'https://instagram.com/autospajakarta' },
] as const;

export const BRANCHES: ContactBranch[] = [
	{
		slug: 'pluit',
		name: 'Autospa Pluit',
		address: 'Jl. Pluit Karang Ayu Barat No 16 Jakarta Utara, 14440',
		phones: ['0877 1777 3888', '0838 7011 4344 (Ferdy)'],
		hours: 'Every day 08.30 - 18.00 WIB',
		map: { query: 'AutoSpa - Passion for Detail', zoom: 16 },
	},
	{
		slug: 'depok-2',
		name: 'Autospa Depok 2',
		address: 'Jl. Kemakmuran Raya No.12, Mekar Jaya, Kec. Sukmajaya, Kota Depok, Jawa Barat 16411',
		phones: ['0819-5888-7778'],
		hours: 'Every day 08.00 - 18.00 WIB',
		map: { query: 'AutoSpa Depok 2', zoom: 16 },
	},
	{
		slug: 'express-depok',
		name: 'Autospa Express Depok',
		address: 'Jl. Margonda No.268, Kemiri Muka, Kecamatan Beji, Kota Depok, Jawa Barat 16423',
		phones: ['0878 1777 3888', '0838 7011 4344'],
		hours: 'Every day 08.00 - 18.00 WIB',
		map: { query: 'AutoSpa Express Depok - Passion For Detail', zoom: 18 },
	},
	{
		slug: 'pik-2',
		name: 'Autospa PIK 2',
		address:
			'Distrik Otomotif, Jl Jendral Sudirman Blok H No.10, Salembaran, Kec. Teluknaga, Kabupaten Tangerang, Banten 15211',
		phones: ['0813 8883 7778'],
		hours: 'Every day 08.30 - 18.00 WIB',
		map: { query: 'Autospa PIK2 - Passion For Detail', zoom: 16 },
	},
	{
		slug: 'ciledug',
		name: 'Autospa Ciledug',
		address: 'Jl. Raden Saleh, Karang Tengah, Kec. Karang Tengah, Kota Tangerang, Banten 15157',
		phones: ['0819 7777 3888'],
		hours: 'Every day 08.00 - 17.00 WIB',
		map: { query: 'Autospa Tangerang Passion for Detail', zoom: 18 },
	},
	{
		slug: 'bekasi',
		name: 'AutoSpa Bekasi',
		address:
			'Jl. Taman Galaxy Raya No.295, RT.003/RW.010, Jaka Setia, Kec. Bekasi Sel., Kota Bks, Jawa Barat 17147',
		phones: ['0822 8888 1810'],
		hours: 'Every day 08.00 - 18.00 WIB',
		map: { query: 'AutoSpa Bekasi - Passion For Detail', zoom: 16 },
	},
	{
		slug: 'kranji-bekasi',
		name: 'Autospa Kranji Bekasi',
		address:
			'Chery Arta Bekasi, Jl. Jend. Sudirman No.1, Kranji, Kec. Bekasi Bar., Kota Bks, Jawa Barat 17135',
		phones: ['+62 819-3777-3888'],
		hours: 'Every day 08.00 - 18.00 WIB',
		map: { query: 'Autospa Kranji', zoom: 18 },
	},
	{
		slug: 'bogor',
		name: 'Autospa Bogor',
		address: 'Jl. Raya Semplak, Semplak, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16114',
		phones: ['+62 813-1010-823'],
		hours: 'Every day 08.00 - 18.00 WIB',
		map: { query: 'Autospa Bogor', zoom: 18 },
	},
	{
		slug: 'serpong',
		name: 'Autospa Serpong',
		address:
			'Chery Arta Serpong / iCar SM Grup, Jl. Raya Serpong Kilometer 7 No.KM.10, Pd. Jagung, Serpong Utara, Tangerang Selatan',
		phones: ['+62 819-3777-3888'],
		hours: 'Every day 08.00 - 18.00 WIB',
		map: { query: 'Chery Arta Serpong', zoom: 16 },
	},
	{
		slug: 'cikupa',
		name: 'Autospa Cikupa',
		address:
			'Jl. Raya Serang No.km.15, Cikupa, Kec. Cikupa, Kabupaten Tangerang, Banten 15710',
		phones: ['+62 819-3777-3888'],
		hours: 'Every day 08.00 - 18.00 WIB',
		map: { query: 'Jl. Raya Serang No.km.15 Cikupa Kabupaten Tangerang', zoom: 16 },
	},
];

/**
 * Embeddable Google Maps URL for a branch, or null when the branch has no
 * published map. Mirrors the `maps.google.com/maps?q=...&output=embed` embed
 * used on production.
 */
export function branchMapUrl(branch: ContactBranch): string | null {
	if (!branch.map) return null;
	// encodeURIComponent, not URLSearchParams: the embed needs %20, not "+",
	// for the spaces in the branch name.
	const query = encodeURIComponent(branch.map.query);
	return `https://maps.google.com/maps?q=${query}&t=m&z=${branch.map.zoom}&output=embed&iwloc=near`;
}

/** wa.me deep link with a prefilled message. */
export function whatsappLink(message?: string, number: string = CONTACT.whatsapp): string {
	const base = `https://wa.me/${number}`;
	return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * The WhatsApp number of a branch, in the international format.
 *
 * Every branch publishes its own phone number - that number is the WhatsApp
 * line of the workshop. A booking that names a branch is therefore handed
 * over to that branch, not to the central number of the site.
 *
 * The first phone of the branch is used; the ones behind it are the personal
 * numbers of the service advisors.
 */
export function branchWhatsapp(branch: ContactBranch): string {
	const digits = (branch.phones[0] ?? '').replace(/\D/g, '');

	if (!digits) return CONTACT.whatsapp;
	if (digits.startsWith('62')) return digits;
	if (digits.startsWith('0')) return `62${digits.slice(1)}`;

	return `62${digits}`;
}

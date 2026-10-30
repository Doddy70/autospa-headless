/**
 * Service packages - the tier pages published on the production site.
 *
 * These are the twelve package pages AutoSPA publishes (the Light -> Platinum
 * coating ladder, the two PPF packages, and the four single-service pages).
 * They are a different axis from `services.ts`, which describes the six
 * services; a service can be delivered through more than one package.
 *
 * Every field here was extracted from the production WordPress site:
 *   - the title, category and numbered inclusion list come from the package
 *     page itself,
 *   - the price tiers come from the price table on the newer pages,
 *   - the photo is the featured image of that package page.
 *
 * Where production does not publish a price (the six coating-tier pages show
 * their price in a table that the extractor does not read), `priceFrom` stays
 * null and the card links to the pricing page instead of quoting a number.
 */

export interface PackageVariant {
	/** The vehicle size the price applies to, e.g. "SMALL" or "S - M". */
	label: string;
	/** The price as published, e.g. "IDR 15.000k". */
	price: string;
}

export interface ServicePackageTier {
	slug: string;
	name: string;
	/** "Premium Packages" or "360° PAINT PROTECTION" as published. */
	category: string;
	description: string;
	/** Featured image of the package page on the production site. */
	image: string;
	/** The numbered inclusions, in the order production lists them. */
	includes: string[];
	/** The workmanship / durability note printed under the inclusions. */
	note: string;
	/** The size tiers and their published prices. */
	variants: PackageVariant[];
	/** The lowest published price, or null when production shows none. */
	priceFrom: string | null;
}

export const PACKAGES: ServicePackageTier[] = [
	{
		slug: 'light-package',
		name: 'Light Package',
		category: 'Premium Packages',
		description: 'This package is designed for those looking to maintain they car looking at its prime all year round',
		image: 'https://backend.autospajakarta.com/wp-content/uploads/2024/08/Package.jpg',
		includes: ["Full Car Detailing", "Full Body Coating (9H)", "Windshield Coating", "Member Maintenance 1 year"],
		note: '3-4 Days Workmanship*Durability 1-2 Years (Depends on Maintenance and Usage)',
		variants: [],
		priceFrom: null,
	},
	{
		slug: 'bronze-packages',
		name: 'Bronze Packages',
		category: 'Premium Packages',
		description: 'This package is designed for those looking to maintain they car looking at its prime all year round',
		image: 'https://backend.autospajakarta.com/wp-content/uploads/2024/08/Bronze-packages.jpg',
		includes: ["Full Car Detailing", "Full Body Coating (9H)", "Full Window Coating", "Plastic Coating", "Velg Coating", "Member Maintenance 2 Years"],
		note: '3-4 Days Workmanship',
		variants: [],
		priceFrom: null,
	},
	{
		slug: 'silver-package',
		name: 'Silver Package',
		category: 'Premium Packages',
		description: 'This package is designed for those looking to maintain they car looking at its prime all year round',
		image: 'https://backend.autospajakarta.com/wp-content/uploads/2024/08/Silver-Packages.jpg',
		includes: ["Full Car Detailing", "Full Body Coating (9H+)", "Full Window Coating", "Plastic Coating", "Velg Coating", "Member Maintenance 3 Years"],
		note: '3-4 Days Workmanship',
		variants: [],
		priceFrom: null,
	},
	{
		slug: 'gold-package',
		name: 'Gold Package',
		category: 'Premium Packages',
		description: 'This package is designed for those looking to maintain they car looking at its prime all year round',
		image: 'https://backend.autospajakarta.com/wp-content/uploads/2024/08/Gold-Package.jpg',
		includes: ["Full Car Detailing", "Full Body Coating (10H)", "Full Window Coating", "Plastic Coating", "Velg Coating", "Full Leather Coating and Interior Coating", "Member Maintenance 4 year"],
		note: '4-5 Days Workmanship*Durability 4-5 Years (Depends on Maintenance and Usage)',
		variants: [],
		priceFrom: null,
	},
	{
		slug: 'diamond-package',
		name: 'Diamond Package',
		category: 'Premium Packages',
		description: 'This package is designed for those looking to maintain they car looking at its prime all year round',
		image: 'https://backend.autospajakarta.com/wp-content/uploads/2025/06/Diamond-Package.jpg',
		includes: ["Full Car Detailing", "Full Body Coating (10H)", "Full Window Coating", "Plastic Coating", "Velg Coating", "Full Leather Coating and Interior Coating", "Member Maintenance 5 year"],
		note: '4-5 Days Workmanship*Durable 5-6 Years (Depends on Maintenance and Usage)',
		variants: [],
		priceFrom: null,
	},
	{
		slug: 'platinum-package',
		name: 'Platinum Package',
		category: 'Premium Packages',
		description: 'This package is designed for those looking to maintain they car looking at its prime all year round',
		image: 'https://backend.autospajakarta.com/wp-content/uploads/2025/06/Platinum-Package2.jpg',
		includes: ["Full Car Detailing", "Full Body Coating (10H+)", "Full Window Coating", "Plastic Coating", "Velg Coating", "Full Leather Coating and Interior Coating", "Member Maintenance Lifetime"],
		note: '3-4 Days Workmanship',
		variants: [],
		priceFrom: null,
	},
	{
		slug: 'daily-ppf-package',
		name: 'Daily PPF Package',
		category: '360° PAINT PROTECTION FILM PACKAGE',
		description: 'This package is designed for those looking to maintain they car looking at its prime all year round',
		image: 'https://backend.autospajakarta.com/wp-content/uploads/2025/06/DAILY-PPF-PACKAGE.jpg',
		includes: ["Full Car Detailing", "Full Body PPF (170micron + coating)", "Full Window Coating", "Plastic Coating", "Velg Coating", "Member Maintenance 2 year"],
		note: 'TPU Made in PRC*7-10 Days Workmanship*Durability up to 3 years (depending on maintenance and usage)',
		variants: [],
		priceFrom: null,
	},
	{
		slug: 'premium-ppf-package',
		name: 'Premium PPF Package',
		category: '360° PAINT PROTECTION FILM PACKAGE',
		description: 'This package is designed for those looking to maintain they car looking at its prime all year round',
		image: 'https://backend.autospajakarta.com/wp-content/uploads/2025/06/Premium-PPF-Package.jpg',
		includes: ["Full Car Detailing", "Full Body PPF (200micron + coating)", "Full Window Coating", "Plastic Coating", "Velg Coating", "Full Leather Coating and Interior Coating", "Member Maintenance 5 year"],
		note: 'High-GRADE TPU Made in USA*7-10 Days Workmanship*Durability up to 7 years (depending on maintenance and usage)',
		variants: [],
		priceFrom: null,
	},
	{
		slug: 'premium-360-ppf-package',
		name: 'Premium 360° PPF Package',
		category: '',
		description: '',
		image: 'https://backend.autospajakarta.com/wp-content/uploads/2025/07/360.jpg',
		includes: [],
		note: 'Durability Up to 3 years (Depend on care & use)',
		variants: [{"label": "SMALL", "price": "IDR 15.000k"}, {"label": "MEDIUM", "price": "IDR 20.000k"}, {"label": "LARGE", "price": "IDR 25.000k"}, {"label": "X-LARGE", "price": "IDR 30.000k"}, {"label": "SUPER", "price": "IDR 35.000k"}, {"label": "SMALL", "price": "IDR 25.000k"}, {"label": "MEDIUM", "price": "IDR 30.000k"}, {"label": "LARGE", "price": "IDR 35.000k"}, {"label": "X-LARGE", "price": "IDR 40.000k"}, {"label": "SUPER", "price": "IDR 45.000k"}, {"label": "SMALL", "price": "IDR 40.000k"}, {"label": "MEDIUM", "price": "IDR 45.000k"}, {"label": "LARGE", "price": "IDR 50.000k"}, {"label": "X-LARGE", "price": "IDR 55.000k"}, {"label": "SUPER", "price": "IDR 60.000k"}],
		priceFrom: 'IDR 15.000k',
	},
	{
		slug: 'premium-nano-ceramic-coating',
		name: 'Premium Nano Ceramic Coating',
		category: '',
		description: 'Car coating protects your car from ultra violet rays, preventing your car paint from dulling and fading.',
		image: 'https://backend.autospajakarta.com/wp-content/uploads/2025/07/Nano-Cearmic-Coating-Slide.jpg',
		includes: [],
		note: '3-4 Days Workmanship',
		variants: [{"label": "SMALL", "price": "IDR 3.000k"}, {"label": "MEDIUM", "price": "IDR 4.000k"}, {"label": "LARGE", "price": "IDR 5.000k"}, {"label": "X-LARGE", "price": "IDR 6.000k"}, {"label": "SUPER", "price": "IDR 8.000k"}, {"label": "SMALL", "price": "IDR 4.000k"}, {"label": "MEDIUM", "price": "IDR 5.000k"}, {"label": "LARGE", "price": "IDR 6.000k"}, {"label": "X-LARGE", "price": "IDR 7.000k"}, {"label": "SUPER", "price": "IDR 9.000k"}, {"label": "SMALL", "price": "IDR 6.000k"}, {"label": "MEDIUM", "price": "IDR 7.000k"}, {"label": "LARGE", "price": "IDR 8.000k"}, {"label": "X-LARGE", "price": "IDR 9.000k"}, {"label": "SUPER", "price": "IDR 11.000k"}, {"label": "SMALL", "price": "IDR 8.000k"}, {"label": "MEDIUM", "price": "IDR 9.000k"}, {"label": "LARGE", "price": "IDR 10.000k"}, {"label": "X-LARGE", "price": "IDR 11.000k"}, {"label": "SUPER", "price": "IDR 13.000k"}, {"label": "SMALL", "price": "IDR 10.000k"}, {"label": "MEDIUM", "price": "IDR 11.000k"}, {"label": "LARGE", "price": "IDR 12.000k"}, {"label": "X-LARGE", "price": "IDR 13.000k"}, {"label": "SUPER", "price": "IDR 15.000k"}, {"label": "SMALL", "price": "IDR 14.000k"}, {"label": "MEDIUM", "price": "IDR 15.000k"}, {"label": "LARGE", "price": "IDR 16.000k"}, {"label": "X-LARGE", "price": "IDR 17.000k"}, {"label": "SUPER", "price": "IDR 19.000k"}],
		priceFrom: 'IDR 3.000k',
	},
	{
		slug: 'premium-wash',
		name: 'Premium Wash',
		category: '',
		description: '',
		image: 'https://backend.autospajakarta.com/wp-content/uploads/2025/07/Premium-Wash-Slide.jpg',
		includes: [],
		note: '',
		variants: [{"label": "S - M", "price": "IDR 300k"}, {"label": "L - XL", "price": "IDR 400k"}, {"label": "S - M", "price": "IDR 500k"}, {"label": "L - XL", "price": "IDR 600k"}, {"label": "", "price": "IDR 150k"}, {"label": "Shine Wax", "price": "IDR 25k"}, {"label": "Tar Remover", "price": "IDR 50k"}, {"label": "Paste Wax", "price": "IDR 75k"}, {"label": "Paint Sealant", "price": "IDR 100k"}, {"label": "Moonlight Coating", "price": "IDR 250k"}, {"label": "", "price": "IDR 500k"}, {"label": "Shine Coating", "price": "IDR 750k"}, {"label": "Clay", "price": "IDR 125k"}, {"label": "Spot Polish", "price": "IDR 200k"}, {"label": "Spot Polish", "price": "IDR 350k"}, {"label": "Engine Cleaning", "price": "IDR 250k"}, {"label": "Glass Cleaning", "price": "IDR 1.000k"}, {"label": "Glass Cleaning", "price": "IDR 1.250k"}, {"label": "Wet Sanding", "price": "IDR 1.000k"}, {"label": "Bongkar Pasang", "price": "IDR 500k"}, {"label": "Jok + Karpet", "price": "IDR 700k"}, {"label": "Jok + Karpet", "price": "IDR 1.000k"}, {"label": "", "price": "IDR 125k"}, {"label": "", "price": "IDR 175k"}, {"label": "", "price": "IDR 350k"}, {"label": "", "price": "IDR 500k"}, {"label": "", "price": "IDR 500k"}, {"label": "", "price": "IDR 150k"}, {"label": "POLES KACA", "price": "IDR 650k"}, {"label": "POLES KACA", "price": "IDR 250k"}, {"label": "", "price": "IDR 950k"}, {"label": "", "price": "IDR 1.650k"}],
		priceFrom: 'IDR 300k',
	},
	{
		slug: 'premium-full-detailing',
		name: 'Premium Full Detailing',
		category: '',
		description: 'Interior Detailing is a service to restore the interior of a vehicle to a like-new condition. All surfaces are cleaned and restored to their original condition using premium cleaning products.',
		image: 'https://backend.autospajakarta.com/wp-content/uploads/2025/07/Premium-Detailing-SLide.jpg',
		includes: [],
		note: '',
		variants: [{"label": "", "price": "IDR 7000k"}, {"label": "", "price": "IDR 8000k"}, {"label": "", "price": "IDR 9000k"}, {"label": "S-M 2 Baris", "price": "IDR 500k"}, {"label": "M-L 3 Baris", "price": "IDR 700k"}, {"label": "XL 3 Baris", "price": "IDR 1.000k"}, {"label": "", "price": "IDR 1.000k"}, {"label": "", "price": "IDR 1.200k"}, {"label": "", "price": "IDR 1.400k"}, {"label": "", "price": "IDR 1.500k"}, {"label": "", "price": "IDR 1.700k"}, {"label": "", "price": "IDR 1.900k"}],
		priceFrom: 'IDR 7000k',
	},
];

/** The packages grouped by the category production assigns them. */
export const PACKAGE_CATEGORIES = [
	...new Set(PACKAGES.map((p) => p.category).filter(Boolean)),
];

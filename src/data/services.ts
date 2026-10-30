/**
 * Service catalogue.
 *
 * Every string in this file was taken from the production WordPress site
 * (autospajakarta.com) - the service pages, the "Our Services" page and the
 * homepage services carousel. Nothing was invented; where production does not
 * publish a detail (package contents, prices), the field is left empty and
 * the page asks for a consultation instead.
 *
 * Sources
 *   Premium Wash          /premium-wash/ + /our-services/
 *   Premium Detailing     /premium-detailing/ + /our-services/ + /faq/
 *   Premium Coating       /nano-ceramic-coating/ + /premium-nano-ceramic-coating/ + /faq/
 *   Premium 360° PPF      /360-paint-protection-film-package/ + /faq/
 *   Engine & Glass        homepage services carousel (card "Additional Services")
 *   Rust Protection       /our-services/ + homepage card "Anti Rust"
 *
 * Phase 1C: the canonical URL of a service is `/services/<slug>/`.
 */

export type ServiceIcon = 'shield' | 'sparkles' | 'car' | 'lock' | 'droplet' | 'wrench';

export interface ServicePackage {
	/** Package name as published on production. */
	name: string;
	/** One line describing the variant, when production states one. */
	summary: string;
	/** The "All Includes" list of the package. */
	includes: string[];
}

export interface ServiceFaq {
	question: string;
	answer: string;
}

export interface Service {
	slug: string;
	/** Position in the production services carousel (01 - 06). */
	number: string;
	title: string;
	/** The promise line used by the production carousel. */
	tagline: string;
	/** The longer description from the "Our Services" page. */
	description: string;
	icon: ServiceIcon;
	/** Card image (services carousel). */
	image: string;
	/** Large image used on the single service page. */
	heroImage: string;
	/**
	 * The clip that opens the single service page.
	 *
	 * The Agntix portfolio detail layout opens with a video; the service
	 * pages reuse the footage of `public/videos`. A wide clip (16:9) is used
	 * on every service, because the frame of the template is a wide one and a
	 * vertical clip would be cropped to a sliver.
	 */
	video: string;
	gallery: string[];
	packages: ServicePackage[];
	/** Facts that are not tied to a package. */
	highlights: string[];
	faqs: ServiceFaq[];
	/** Where this service lives on production. */
	productionUrl: string;
}

const UPLOADS = '/wp-content/uploads';

export const SERVICES: Service[] = [
	{
		slug: 'premium-wash',
		number: '01',
		title: 'Premium Wash',
		tagline:
			'A car wash service that uses high-quality products and procedures to thoroughly clean the car, both exterior and interior.',
		description:
			'A more thorough and detailed car wash service compared to a regular car wash. The Premium Wash focuses on a thorough exterior, interior and undercarriage refresh, using a two-bucket wash method with a pH-balanced shampoo that is 100% safe for ceramic-coated cars.',
		icon: 'sparkles',
		image: `${UPLOADS}/2026/05/Premium-Wash.jpg`,
		heroImage: `${UPLOADS}/2025/07/Premium-Car-Wash-Hero4.jpg`,
		video: '/videos/car2.mp4',
		gallery: [
			`${UPLOADS}/2025/07/Premium-Car-Wash-Hero4.jpg`,
			`${UPLOADS}/2026/10/washme.jpg`,
			`${UPLOADS}/2026/05/24.jpg`,
		],
		packages: [
			{
				name: 'Premium Wash',
				summary: '+ Undercarriage Wash',
				includes: [
					'Thorough exterior, interior and undercarriage refresh',
					'Two-bucket wash method with pH-balanced shampoo',
					'Coating-safe chemicals - 100% safe for ceramic-coated cars',
				],
			},
			{
				name: 'Full Detox',
				summary: '',
				includes: [],
			},
			{
				name: 'Light Detox',
				summary: '',
				includes: [],
			},
		],
		highlights: [
			'Wash takes between 30 to 60 minutes',
			'Add-ons: interior and exterior detailing, window water-spot removal, express spray sealant',
			'Two-bucket method avoids swirl marks and does not degrade paint protection',
		],
		faqs: [
			{
				question: 'How long does the wash process take?',
				answer:
					'The process typically takes between 30 to 60 minutes. This duration allows our team to meticulously clean your vehicle’s exterior, including a thorough undercarriage cleaning, while still being highly efficient with your valuable time.',
			},
			{
				question: 'How often should I get a Premium Wash?',
				answer:
					'To maintain your car’s pristine condition, we highly recommend a Premium Wash minimal every weekly. Regular washing is crucial to prevent dirt buildup, and it ensures your vehicle always looks fresh and glossy as if it just rolled out of the spa.',
			},
			{
				question: 'Can I customize the Premium Wash service?',
				answer:
					'While the Premium Wash focuses on a thorough exterior, interior and undercarriage refresh, you can easily upgrade your visit. We offer excellent add-ons such as interior and exterior detailing, window water-spot removal, or an express spray sealant application. Just ask our Service Advisor upon arrival!',
			},
			{
				question: 'What’s the difference between the Premium Wash and a regular wash?',
				answer:
					'Unlike a standard street wash that often uses harsh detergents, our Premium Wash strictly utilizes a two-bucket wash method and a pH-balanced shampoo specially formulated to be 100% safe for ceramic-coated cars. Furthermore, our service includes a dedicated undercarriage cleaning, ensuring your vehicle is deeply refreshed from top to bottom without risking swirl marks or degrading your paint protection.',
			},
			{
				question: 'Is the Premium Wash worth the investment?',
				answer:
					'Definitely. Think of it as the ultimate routine maintenance for your vehicle. You get the absolute peace of mind knowing your car is washed using coating-safe chemicals, proper scratch-free techniques, and detailed attention to the undercarriage. It is the smartest and most affordable way to safely maintain your car’s daily shine.',
			},
		],
		productionUrl: 'https://autospajakarta.com/premium-wash/',
	},
	{
		slug: 'premium-detailing',
		number: '02',
		title: 'Premium Detailing',
		tagline: 'We provide a Premium Service & produce Premium Results.',
		description:
			'A comprehensive car treatment that includes deep cleaning, polishing, and exterior and interior protection. Experience a complete transformation inside and out: we meticulously restore your exterior paint’s flawless gloss and perform a deep interior cleaning, leaving your vehicle looking and feeling brand new.',
		icon: 'car',
		image: `${UPLOADS}/2024/08/Slider-3.jpg`,
		heroImage: `${UPLOADS}/2024/08/Slider-3.jpg`,
		video: '/videos/ferarri_wide.mp4',
		gallery: [
			`${UPLOADS}/2024/08/Slider-3.jpg`,
			`${UPLOADS}/2024/08/Slider-45.jpg`,
			`${UPLOADS}/2026/05/24.jpg`,
		],
		packages: [
			{
				name: 'Interior Detailing',
				summary: 'Deep clean of carpets, plastics and leather',
				includes: [
					'Cleaning, removing dirt and maintaining the condition of the interior',
					'Includes carpets, plastics and leather',
					'Aims to restore the interior to a like-new condition',
				],
			},
			{
				name: 'Exterior Detailing',
				summary: 'Paint correction and gloss restoration',
				includes: [
					'Deep clean of the exterior, polishing and protecting the surfaces',
					'Paint correction, waxing and scratch-free techniques',
				],
			},
			{
				name: 'Full Detailing',
				summary: 'Inside and out - usually 4 to 7 hours',
				includes: [
					'Cleaning and refreshing the outside and the inside of the vehicle',
					'Changing the oil and the filters, and repainting',
					'Typically takes between 4 to 7 hours, depending on the condition of the car',
				],
			},
		],
		highlights: [
			'Recommended every 3 to 6 months',
			'High-quality, environmentally friendly and non-toxic products',
			'Regular detailing helps maintain resale value',
		],
		faqs: [
			{
				question: 'What is auto detailing?',
				answer:
					'Auto detailing is a thorough cleaning and restoration of both the interior and exterior of your vehicle. It goes beyond a regular car wash and includes deep cleaning, polishing, and protecting your car’s surfaces.',
			},
			{
				question: 'How long does it typically take you to detail my vehicle?',
				answer:
					'That depends on a few things such as size of the vehicle, condition, package selection & any add on service you may choose. We will give you an estimate of how long it takes.',
			},
			{
				question: 'What is the difference between a car wash and a detailing?',
				answer:
					'A car wash typically involves a basic exterior wash and may include a quick cleaning of the interior. It’s a fast, surface-level clean meant to remove dirt and debris. A detailing, on the other hand, is a comprehensive cleaning and restoration process. It includes a deep clean of both the interior and exterior, such as paint correction, waxing, upholstery conditioning, and other services aimed at restoring your vehicle’s appearance and protecting its surfaces.',
			},
			{
				question: 'How often should I get my car detailed?',
				answer:
					'It depends on how often you use your car and the conditions it’s exposed to. Typically, we recommend a thorough detailing every 3-6 months, but if you drive often or in harsh conditions, more frequent detailing may be necessary.',
			},
			{
				question: 'Are the products you use safe for my vehicle?',
				answer:
					'Yes, all of the products we use are high-quality, safe, and specifically designed for automotive use. We choose environmentally friendly and non-toxic options whenever possible.',
			},
			{
				question: 'Will detailing my car improve its resale value?',
				answer:
					'Yes! Regular detailing helps maintain your car’s appearance and condition, which can positively affect its resale value. A clean, well-maintained car is always more attractive to potential buyers.',
			},
		],
		productionUrl: 'https://autospajakarta.com/premium-detailing/',
	},
	{
		slug: 'premium-coating',
		number: '03',
		title: 'Premium Coating',
		tagline:
			'Add years of protection with hydrophobic ceramic coating. Shields against UV rays, dirt, and scratches - making your car easier to clean and stay glossy longer.',
		description:
			'A coating technology that uses nanoparticles to protect against scratches, stains, water, dust, UV rays, and other environmental elements. Car coating protects your car from ultra violet rays, preventing your car paint from dulling and fading.',
		icon: 'shield',
		image: `${UPLOADS}/2024/08/Slider-45.jpg`,
		heroImage: `${UPLOADS}/2024/08/Slider-45.jpg`,
		video: '/videos/hero.mp4',
		gallery: [
			`${UPLOADS}/2024/08/Slider-45.jpg`,
			`${UPLOADS}/2025/11/Auto-Detailing-1.jpg`,
			`${UPLOADS}/2026/05/5-1.jpg`,
		],
		packages: [
			{
				name: 'Light Package',
				summary: 'Double Layer Nano Ceramic Coating Package',
				includes: [
					'Full Car Detailing (Kolong, Mesin, Interior, Body, Velg, Kaca)',
					'Full Body Coating (9H), Windshield Coating (kaca depan)',
					'1 year Member Maintenance',
				],
			},
			{
				name: 'Bronze Package',
				summary: 'Double Layer Nano Ceramic Coating Package',
				includes: [
					'Full Car Detailing (Undercarriage, Engine, Interior, Body, Wheel, Glass)',
					'Full Body Coating (9H), Full Window Coating, Plastic Coating, Velg Coating',
					'2 year Member Maintenance',
				],
			},
			{
				name: 'Silver Package',
				summary: 'Nano Ceramic Coating Triple Layer Package',
				includes: [
					'Full Car Detailing (Undercarriage, Engine, Interior, Body, Wheel, Glass)',
					'Full Body Coating (9H+), Full Window Coating, Plastic Coating, Velg Coating',
					'3 year Member Maintenance',
				],
			},
			{
				name: 'Gold Package',
				summary: 'Nano Ceramic Coating 5 Layers package',
				includes: [
					'Full Car Detailing (Undercarriage, Engine, Interior, Body, Wheel, Glass)',
					'Full Body Coating (10H), Full Window Coating, Plastic Coating, Velg Coating',
					'4 year Member Maintenance',
				],
			},
			{
				name: 'Diamond Package',
				summary: 'Nano Ceramic Coating 7 Layers package',
				includes: [
					'Full Car Detailing (Undercarriage, Engine, Interior, Body, Wheel, Glass)',
					'Full Body Coating (10H), Full Window Coating, Plastic Coating, Velg Coating',
					'Full Leather Coating and Interior Coating',
					'5 year Member Maintenance',
				],
			},
			{
				name: 'Platinum Package',
				summary: 'Nano Ceramic Coating 10 Layers package',
				includes: [
					'Full Car Detailing (Undercarriage, Engine, Interior, Body, Wheel, Glass)',
					'Full Body Coating (10H+), Full Window Coating, Plastic Coating, Velg Coating',
					'Full Leather Coating and Interior Coating',
					'Lifetime Member Maintenance',
				],
			},
		],
		highlights: [
			'Hydrophobic surface - easier to clean and stays glossy longer',
			'Protects against UV rays, dirt, dust, water and stains',
			'Layer count grows with the package: 2, 3, 5, 7 up to 10 layers',
		],
		faqs: [
			{
				question: 'What is a nano ceramic coating?',
				answer:
					'Nano ceramic coating is a special protective coating for vehicle surfaces made of nano-technological particles. It provides long-term protection from dirt, dust and contaminants, and enhances the appearance of your vehicle.',
			},
			{
				question: 'How long does a paint protection film last?',
				answer:
					'The lifespan of a paint protection film depends on the weather conditions and the quality of the film. Generally, PPF lasts for 5-8 years.',
			},
		],
		productionUrl: 'https://autospajakarta.com/premium-nano-ceramic-coating/',
	},
	{
		slug: 'premium-360-ppf',
		number: '04',
		title: 'Premium 360° PPF',
		tagline:
			'Our Premium 360° PPF provides the ultimate armor for your vehicle. We meticulously wrap the entire exterior with a high-gloss, self-healing transparent film, safeguarding your factory paint against rock chips, deep scratches, and harsh elements.',
		description:
			'Wrapping the entire exterior of a vehicle with a clear, self-healing film to protect the paint from various types of damage. A clear protective coating that covers the entire surface of the car body, providing maximum protection against scratches, gravel, stains, and UV damage.',
		icon: 'lock',
		image: `${UPLOADS}/2026/05/PPF.jpg`,
		heroImage: `${UPLOADS}/2026/05/PPF.jpg`,
		video: '/videos/hero_video.mp4',
		gallery: [
			`${UPLOADS}/2026/05/PPF.jpg`,
			`${UPLOADS}/2025/07/choose-1.png`,
			`${UPLOADS}/2026/05/6_1.jpg`,
		],
		packages: [
			{
				name: 'Daily PPF Package',
				summary: '170 Micron Thickness & Self Curing',
				includes: [
					'Up to 2 years Membership Maintenance',
					'TPU Made in PRC',
					'Durability Up to 3 years (depend on care & use)',
				],
			},
			{
				name: 'Premium PPF Package',
				summary: '200 Micron Thickness & Self Curing',
				includes: [
					'Up to 5 years Membership Maintenance',
					'High Grade TPU Made in USA',
					'Durability Up to 7 years (depend on care & use)',
				],
			},
			{
				name: 'Ultimate PPF Package',
				summary: '230 Micron Thickness & Self Curing',
				includes: [
					'Up to 8 years Membership Maintenance',
					'High Grade TPU Made in USA',
					'Durability Up to 10 years (depend on care & use)',
				],
			},
		],
		highlights: [
			'Full Body Car Detailing (Undercarriage, Machine, Interior, Body, Velg & Glass)',
			'Full Window Coating, Plastic Coating & Velg Coating',
			'Full Leather Coating & Interior Coating',
		],
		faqs: [
			{
				question: 'What is a paint protection film (PPF)?',
				answer:
					'Paint Protection Film (PPF) is a protective coating for your car’s surface designed to protect against scratches, dirt and sun damage. It is applied precisely over the surface of your vehicle to protect the color from the elements.',
			},
			{
				question: 'How long does a paint protection film last?',
				answer:
					'The lifespan of a paint protection film depends on the weather conditions and the quality of the film. Generally, PPF lasts for 5-8 years.',
			},
			{
				question: 'How do I clean paint protection film?',
				answer:
					'You can clean the PPF by using car soap and water. Use a soft sponge and don’t forget to moisten the sponge with water before cleaning the PPF. You can also use special products to maintain and clean the PPF.',
			},
		],
		productionUrl: 'https://autospajakarta.com/360-paint-protection-film-package/',
	},
	{
		slug: 'engine-glass',
		number: '05',
		title: 'Engine & Glass',
		tagline:
			'Restore your visibility and under-hood aesthetics. We thoroughly remove stubborn water spots from all windows and meticulously degrease your engine bay, finishing with a premium dressing for a fresh, like-new look.',
		description:
			'Engine & Glass is the refresh service for the two areas that take the most abuse: the engine bay and the glass. It is listed on production as part of the service lineup and as an additional service that can be added to a wash or detailing visit.',
		icon: 'droplet',
		image: `${UPLOADS}/2026/05/Engine-BAy.jpg`,
		heroImage: `${UPLOADS}/2026/05/Engine-BAy.jpg`,
		video: '/videos/buat_section_videol.mp4',
		gallery: [
			`${UPLOADS}/2026/05/Engine-BAy.jpg`,
			`${UPLOADS}/2026/05/6-1.jpg`,
			`${UPLOADS}/2026/05/6-2.jpg`,
		],
		packages: [],
		highlights: [
			'Removal of stubborn water spots from all windows',
			'Meticulous degreasing of the engine bay',
			'Premium finishing dressing for a fresh, like-new look',
		],
		faqs: [],
		productionUrl: 'https://autospajakarta.com/',
	},
	{
		slug: 'rust-protection',
		number: '06',
		title: 'Rust Protection',
		tagline:
			'Our rust protection uses a water-based rubber material - not Flintkote or asphalt - ensuring it is completely odor-free.',
		description:
			'Rust protection from AutoSPA Jakarta is applied with a water-based rubber material rather than Flintkote or asphalt, so the vehicle stays completely odor-free. Regular treatment prevents rust from forming and keeps the underbody protected.',
		icon: 'wrench',
		image: `${UPLOADS}/2026/05/Anti-Rust-1.jpg`,
		heroImage: `${UPLOADS}/2026/05/Anti-Rust-1.jpg`,
		video: '/videos/Rust_Protection.mp4',
		gallery: [
			`${UPLOADS}/2026/05/Anti-Rust-1.jpg`,
			`${UPLOADS}/2026/05/5-4.jpg`,
			`${UPLOADS}/2026/05/6-2.jpg`,
		],
		packages: [],
		highlights: [
			'Water-based rubber material',
			'Completely odor-free - not Flintkote or asphalt',
			'Prevents rust from forming on the underbody',
		],
		faqs: [],
		productionUrl: 'https://autospajakarta.com/our-services/',
	},
];

export function getService(slug: string): Service | undefined {
	return SERVICES.find((service) => service.slug === slug);
}

/** The other services, used for the "related services" block. */
export function getRelatedServices(slug: string, limit = 3): Service[] {
	return SERVICES.filter((service) => service.slug !== slug).slice(0, limit);
}

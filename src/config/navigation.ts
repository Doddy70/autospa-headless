/**
 * Site navigation.
 *
 * The structure is the one the Agntix `CorporateAgencyHeader` uses: a flat
 * menu where one entry ("Services") opens a dropdown. The links themselves
 * point at the routes this app actually serves.
 */

export interface NavLink {
	label: string;
	href: string;
}

export interface NavItem extends NavLink {
	/** When present the entry opens a dropdown panel instead of a page. */
	children?: NavLink[];
}

export const NAVIGATION: NavItem[] = [
	{ label: 'Home', href: '/' },
	{ label: 'About', href: '/about' },
	{
		label: 'Services',
		href: '/services',
		children: [
			{ label: 'Premium Wash', href: '/services/premium-wash' },
			{ label: 'Premium Detailing', href: '/services/premium-detailing' },
			{ label: 'Premium Coating', href: '/services/premium-coating' },
			{ label: 'Premium 360° PPF', href: '/services/premium-360-ppf' },
			{ label: 'Engine & Glass', href: '/services/engine-glass' },
			{ label: 'Rust Protection', href: '/services/rust-protection' },
		],
	},
	{ label: 'Blog', href: '/blog' },
	{ label: 'FAQ', href: '/faq' },
	{ label: 'Contact', href: '/contact' },
];

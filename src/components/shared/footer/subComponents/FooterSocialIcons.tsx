'use client';

/**
 * The social icons of the footer.
 *
 * Cloned from the Agntix `FooterSocialIcons` (the `CreativeAgencyFooter`
 * variant), which draws the brand marks as inline SVG on circular buttons.
 * The icons are inlined here because AutoSPA has no `@/svg` library - the
 * paths are taken from the Agntix social icons (Facebook, Twitter/X,
 * LinkedIn, Instagram).
 */

import Link from 'next/link';

import { SOCIALS } from '@/data/contact';

function FacebookIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.645c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
		</svg>
	);
}

function XIcon() {
	return (
		<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	);
}

function LinkedinIcon() {
	return (
		<svg width="15" height="15" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
			<path d="M9.8001 4.2002C10.914 4.2002 11.9823 4.64269 12.7699 5.43035C13.5576 6.218 14.0001 7.28629 14.0001 8.4002V13.3002H11.2001V8.4002C11.2001 8.02889 11.0526 7.6728 10.79 7.41025C10.5275 7.1477 10.1714 7.0002 9.8001 7.0002C9.42879 7.0002 9.0727 7.1477 8.81015 7.41025C8.5476 7.6728 8.4001 8.02889 8.4001 8.4002V13.3002H5.6001V8.4002C5.6001 7.28629 6.0426 6.218 6.83025 5.43035C7.6179 4.64269 8.68619 4.2002 9.8001 4.2002Z" />
			<path d="M2.8 4.89941H0V13.2994H2.8V4.89941Z" />
			<path d="M1.4 2.8C2.1732 2.8 2.8 2.1732 2.8 1.4C2.8 0.626801 2.1732 0 1.4 0C0.626801 0 0 0.626801 0 1.4C0 2.1732 0.626801 2.8 1.4 2.8Z" />
		</svg>
	);
}

function InstagramIcon() {
	return (
		<svg
			width="18"
			height="17"
			viewBox="0 0 20 19"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M14.2426 4.82562H14.2496M5.27195 1H13.8159C16.1752 1 18.0878 2.90279 18.0878 5.25V13.75C18.0878 16.0972 16.1752 18 13.8159 18H5.27195C2.91262 18 1 16.0972 1 13.75V5.25C1 2.90279 2.91262 1 5.27195 1ZM12.9615 8.96482C13.0669 9.67223 12.9455 10.3947 12.6144 11.0295C12.2833 11.6643 11.7595 12.179 11.1174 12.5005C10.4753 12.8221 9.74767 12.934 9.03796 12.8204C8.32825 12.7067 7.67263 12.3734 7.16433 11.8677C6.65603 11.362 6.32096 10.7098 6.20675 10.0037C6.09255 9.29764 6.20504 8.57373 6.52823 7.93494C6.85141 7.29615 7.36883 6.775 8.00688 6.44563C8.64494 6.11625 9.37115 5.99542 10.0822 6.10032C10.8075 6.20732 11.479 6.54356 11.9975 7.05938C12.516 7.5752 12.854 8.24324 12.9615 8.96482Z" />
		</svg>
	);
}

/** The mark of every social network of the site. */
const ICONS: Record<string, () => React.JSX.Element> = {
	Facebook: FacebookIcon,
	'X (Twitter)': XIcon,
	LinkedIn: LinkedinIcon,
	Instagram: InstagramIcon,
};

export function FooterSocialIcons({ className = '' }: { className?: string }) {
	return (
		<div className={className}>
			{SOCIALS.map((social) => {
				const Icon = ICONS[social.label];

				if (!Icon) return null;

				return (
					<Link
						key={social.label}
						href={social.href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={social.label}
						className="inline-flex size-[42px] items-center justify-center rounded-full bg-white/[0.06] text-white transition-colors duration-300 hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
					>
						<Icon />
					</Link>
				);
			})}
		</div>
	);
}

export default FooterSocialIcons;

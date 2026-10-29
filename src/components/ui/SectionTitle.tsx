import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Section title - the reusable headline block.
 *
 * Ported from the Agntix template's `tp-section-title` pattern (a small
 * uppercase eyebrow above a large grotesk headline, optionally with the last
 * word underlined by a hand-drawn shape). The template ships it as Bootstrap
 * markup plus SCSS, so the shape is rebuilt here as an inline SVG that takes
 * the AutoSPA brand colour.
 */
export interface SectionTitleProps {
	/** Small uppercase label above the headline. */
	eyebrow?: string;
	/** The headline. */
	title: ReactNode;
	/** Optional supporting line under the headline. */
	description?: ReactNode;
	/** Renders the headline centred instead of left aligned. */
	centered?: boolean;
	/** The word that gets the underline shape. */
	underline?: string;
	className?: string;
}

export function SectionTitle({
	eyebrow,
	title,
	description,
	centered = false,
	underline,
	className = '',
}: SectionTitleProps) {
	const parts = underline
		? String(title).split(underline)
		: null;

	return (
		<div className={`${centered ? 'text-center mx-auto max-w-3xl' : 'max-w-3xl'} ${className}`}>
			{eyebrow ? (
				<span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-500">
					<span className="h-2 w-2 rounded-full bg-primary-500" />
					{eyebrow}
				</span>
			) : null}

			<h2 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
				{parts ? (
					<>
						{parts[0]}
						<span className="relative inline-block">
							{underline}
							<UnderlineShape className="absolute -bottom-2 left-0 h-2 w-full text-primary-500" />
						</span>
						{parts[1]}
					</>
				) : (
					title
				)}
			</h2>

			{description ? (
				<p className="mt-5 text-base leading-relaxed text-white/60 md:text-lg">{description}</p>
			) : null}
		</div>
	);
}

/**
 * The hand-drawn underline used under the highlighted word.
 *
 * The Agntix template draws this as a filled SVG path with a green/yellow
 * gradient; here it is a simple stroke that inherits the brand colour.
 */
function UnderlineShape({ className = '' }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 130 12"
			fill="none"
			preserveAspectRatio="none"
			aria-hidden="true"
			className={className}
		>
			<path
				d="M2 8.5C30 3.5 62 2.5 92 4C108 4.8 120 6.2 128 7.5"
				stroke="currentColor"
				strokeWidth="3"
				strokeLinecap="round"
			/>
		</svg>
	);
}

/**
 * Page hero - the banner at the top of an inner page.
 *
 * Combines the Agntix inner-page header with the breadcrumb widget that the
 * production Elementor pages carry ("Pages / FAQ").
 */
export interface PageHeroProps {
	/** The page title. */
	title: string;
	/** Short line under the title. */
	subtitle?: string;
	/** Breadcrumb trail, starting after the "Pages" root. */
	crumbs?: { label: string; href?: string }[];
	/** Background image for the banner. */
	image?: string;
	children?: ReactNode;
}

export function PageHero({ title, subtitle, crumbs, image, children }: PageHeroProps) {
	return (
		<section className="relative overflow-hidden bg-background-8 px-6 pb-16 pt-32 md:pb-20 md:pt-40">
			{image ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={image}
					alt=""
					className="absolute inset-0 size-full object-cover opacity-25"
				/>
			) : (
				<div className="absolute inset-0 bg-gradient-to-br from-primary-500/15 via-transparent to-transparent" />
			)}
			<div className="absolute inset-0 bg-gradient-to-t from-background-8 via-background-8/70 to-background-8/30" />

			<div className="relative mx-auto max-w-6xl">
				{crumbs?.length ? (
					<nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-white/50">
						<Link href="/" className="transition-colors hover:text-primary-500">
							Pages
						</Link>
						{crumbs.map((crumb) => (
							<span key={crumb.label} className="flex items-center gap-2">
								<span aria-hidden="true">/</span>
								{crumb.href ? (
									<Link href={crumb.href} className="transition-colors hover:text-primary-500">
										{crumb.label}
									</Link>
								) : (
									<span className="text-white/80">{crumb.label}</span>
								)}
							</span>
						))}
					</nav>
				) : null}

				<h1 className="max-w-4xl text-4xl font-bold leading-[1.1] text-white md:text-5xl lg:text-6xl">
					{title}
				</h1>

				{subtitle ? <p className="mt-5 max-w-2xl text-lg text-white/70">{subtitle}</p> : null}

				{children}
			</div>
		</section>
	);
}

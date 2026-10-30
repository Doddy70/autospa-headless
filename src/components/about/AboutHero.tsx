import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * The hero of the About page.
 *
 * The Agntix template (`src/components/hero-banner/AboutUsHero.tsx`) puts an
 * oversized title in the middle of the banner and a small block with the
 * eyebrow, an arrow and a paragraph on the right. The template draws the
 * banner from a picture and a floating shape; here the shape is a ring of
 * the brand colour, so the banner needs no asset.
 */

interface AboutHeroProps {
	/** The oversized title. */
	title: string;
	/** The line above the paragraph on the right. */
	eyebrow?: string;
	/** The paragraph on the right. */
	description: string;
	/** The label of the call to action. */
	ctaLabel?: string;
	/** The target of the call to action. */
	ctaHref?: string;
	/** The photo behind the banner. */
	image?: { src: string; alt: string; width: number; height: number };
	className?: string;
}

export function AboutHero({
	title,
	eyebrow = 'About Us',
	description,
	ctaLabel = 'Book Sekarang',
	ctaHref = '/services',
	image,
	className = '',
}: AboutHeroProps) {
	return (
		<section
			className={`relative overflow-hidden bg-background-8 pt-header pb-16 md:pb-24 ${className}`}
		>
			{image ? (
				<Image
					src={image.src}
					alt={image.alt}
					fill
					priority
					sizes="100vw"
					className="object-cover opacity-20"
				/>
			) : null}

			{/* The brand shape of the template, drawn instead of imported. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute top-1/3 right-[8%] hidden size-[220px] rounded-full border border-primary-500/30 lg:block"
			>
				<div className="absolute inset-[18%] rounded-full border border-primary-500/20" />
			</div>

			<div className="absolute inset-0 bg-gradient-to-t from-background-8 via-background-8/70 to-background-8/40" />

			<div className="relative mx-auto max-w-6xl px-6">
				<h1 className="max-w-4xl text-[clamp(2.6rem,7vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-white uppercase">
					{title}
				</h1>

				<div className="mt-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-end">
					<span className="text-sm font-semibold tracking-[0.2em] text-primary-500 uppercase">
						{eyebrow}
					</span>

					<span aria-hidden="true" className="hidden h-px w-16 bg-primary-500/60 md:block" />

					<p className="max-w-md text-base leading-relaxed text-white/70">{description}</p>
				</div>

				<Link
					href={ctaHref}
					className="btn btn-lg btn-primary mt-10 group inline-flex"
				>
					{ctaLabel}
					<ArrowUpRight className="ml-2 size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
				</Link>
			</div>
		</section>
	);
}

export default AboutHero;

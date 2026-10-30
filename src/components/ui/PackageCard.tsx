import { Check } from 'lucide-react';
import Link from 'next/link';
import { BookingTrigger } from '@/components/booking/ReservationModal';
import { isBookingLabel } from '@/lib/booking/labels';

/**
 * Package card - one service package with its included items.
 *
 * Ported from the Agntix template's price cards (`crp-price-item`): a card
 * with a head (name, price, description), a check list and a full-width
 * button. The production service pages publish the package names and their
 * contents but no prices, so the price slot is optional.
 */
export interface PackageCardProps {
	name: string;
	/** Optional price line. Production does not publish prices per package. */
	price?: string;
	/** Optional short line under the name. */
	summary?: string;
	/** The "All Includes" list. */
	includes?: string[];
	/** Label of the call-to-action button. */
	ctaLabel?: string;
	/** Target of the call-to-action button. */
	ctaHref?: string;
	/** Highlights this card as the recommended one. */
	featured?: boolean;
	className?: string;
}

export function PackageCard({
	name,
	price,
	summary,
	includes = [],
	ctaLabel = 'Book Sekarang',
	ctaHref = '/contact',
	featured = false,
	className = '',
}: PackageCardProps) {
	return (
		<article
			className={`flex h-full flex-col rounded-[20px] border p-7 transition-all duration-300 ${
				featured
					? 'border-primary-500/60 bg-primary-500/5 shadow-lg shadow-primary-500/10'
					: 'border-white/10 bg-background-7 hover:border-primary-500/40'
			} ${className}`}
		>
			{featured ? (
				<span className="mb-4 self-start rounded-full bg-primary-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
					Recommended
				</span>
			) : null}

			<h3 className="text-xl font-bold text-white">{name}</h3>

			{price ? <p className="mt-3 text-3xl font-bold text-primary-500">{price}</p> : null}

			{summary ? <p className="mt-3 text-sm text-white/60">{summary}</p> : null}

			{includes.length ? (
				<ul className="mt-6 flex-1 space-y-3">
					{includes.map((item) => (
						<li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-white/70">
							<span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary-500/15 text-primary-500">
								<Check className="size-3" strokeWidth={3} />
							</span>
							{item}
						</li>
					))}
				</ul>
			) : (
				<div className="flex-1" />
			)}

			{/* A package that asks for a booking opens the reservation
			    dialog instead of a page. */}
			{isBookingLabel(ctaLabel) ? (
				<BookingTrigger
					label={ctaLabel}
					className={`btn mt-8 w-full ${featured ? 'btn-primary' : 'border border-stroke-6 text-white hover:bg-white/10'}`}
				/>
			) : (
				<Link
					href={ctaHref}
					className={`btn mt-8 w-full ${featured ? 'btn-primary' : 'border border-stroke-6 text-white hover:bg-white/10'}`}
				>
					{ctaLabel}
				</Link>
			)}
		</article>
	);
}

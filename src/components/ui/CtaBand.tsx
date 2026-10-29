import { ArrowRight, Phone } from 'lucide-react';
import Link from 'next/link';

import { CONTACT } from '@/data/contact';

/**
 * CTA band - the closing call-to-action of a page.
 *
 * Ported from the Agntix template's CTA sections, which end every inner page
 * with a gradient panel, a headline and two buttons. The copy and the phone
 * number come from the production site.
 */
export interface CtaBandProps {
	/** Small label above the headline. */
	eyebrow?: string;
	/** The headline. */
	title?: string;
	/** Supporting line under the headline. */
	description?: string;
	/** Label of the primary button. */
	primaryLabel?: string;
	/** Target of the primary button. */
	primaryHref?: string;
	/** Hide the phone button. */
	hidePhone?: boolean;
	className?: string;
}

export function CtaBand({
	eyebrow = 'Free Consultation',
	title = 'Still have a question? Just ask us anything',
	description = 'Our Service Advisor will recommend the right package for your vehicle.',
	primaryLabel = 'Book Sekarang',
	primaryHref = '/contact',
	hidePhone = false,
	className = '',
}: CtaBandProps) {
	return (
		<section className={`relative overflow-hidden bg-background-8 px-6 py-20 md:py-24 ${className}`}>
			<div className="absolute inset-0 bg-gradient-to-r from-primary-500/15 via-transparent to-primary-500/15" />
			<div className="absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/10 blur-3xl" />

			<div className="relative mx-auto max-w-3xl text-center">
				<span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-500">
					{eyebrow}
				</span>

				<h2 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
					{title}
				</h2>

				{description ? (
					<p className="mx-auto mt-4 max-w-xl text-base text-white/70 md:text-lg">
						{description}
					</p>
				) : null}

				<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<Link href={primaryHref} className="btn btn-lg btn-primary group">
						{primaryLabel}
						<ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
					</Link>

					{!hidePhone ? (
						<a
							href={`tel:+${CONTACT.whatsapp}`}
							className="btn btn-lg border border-stroke-6 bg-transparent text-white hover:bg-white/10"
						>
							<Phone className="mr-2 size-5" />
							{CONTACT.phone}
						</a>
					) : null}
				</div>
			</div>
		</section>
	);
}

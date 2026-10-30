'use client';

import Link from 'next/link';

import { BookingTrigger } from '@/components/booking/ReservationModal';
import { isBookingLabel } from '@/lib/booking/labels';

/**
 * One link of the footer.
 *
 * A link that asks for a booking opens the reservation dialog; every other
 * link is a plain route. The footer itself is a server component, so the
 * rule lives here, in the one place that renders the links.
 */
export function FooterLink({
	href,
	label,
	className,
}: {
	href: string;
	label: string;
	/** The classes of the link - the footer sets them per menu. */
	className?: string;
}) {
	if (isBookingLabel(label)) {
		return (
			<BookingTrigger
				label={label}
				className={className ?? 'footer-link text-sm text-left'}
			/>
		);
	}

	return (
		<Link href={href} className={className ?? 'footer-link text-sm'}>
			{label}
		</Link>
	);
}

export default FooterLink;
